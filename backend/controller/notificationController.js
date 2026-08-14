const Notification = require('../model/notificationsModel');
const CatchAsync = require('../utils/CatchAsync');
const ErrorClass = require('../utils/ErrorClass');

exports.getNotifications = CatchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ owner: req.user._id }).sort(
    '-createdAt',
  );

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: notifications,
  });
});

exports.markAsRead = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const notification = await Notification.findOne({
    owner: req.user._id,
    _id: id,
  });
  if (!notification) return next(new ErrorClass('No Notification Found', 404));

  notification.status = 'Read';
  notification.readAt = Date.now();
  await notification.save();

  res.status(200).json({
    status: 'success',
    data: notification,
  });
});

exports.deleteNotification = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const notification = await Notification.findOne({
    owner: req.user._id,
    _id: id,
  });
  if (!notification) return next(new ErrorClass('No Notification Found', 404));

  await notification.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteAllNotifications = CatchAsync(async (req, res, next) => {
  await Notification.deleteMany({ owner: req.user._id });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.markAllAsRead = CatchAsync(async (req, res, next) => {
  const result = await Notification.updateMany(
    { owner: req.user._id, status: 'Unread' },
    { $set: { status: 'Read', readAt: Date.now() } },
  );

  res.status(200).json({
    status: 'success',
    message: `${result.modifiedCount} notifications marked as read`,
  });
});
