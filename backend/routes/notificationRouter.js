const express = require('express');
const { protect } = require('../controller/authController');
const {
  getNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead,
  deleteAllNotifications,
} = require('../controller/notificationController');

const router = express.Router();

router.use(protect);

router.route('/').get(getNotifications);

router.patch('/mark-all-read', markAllAsRead);
router.delete('/delete-all', deleteAllNotifications);

router.route('/:id').patch(markAsRead).delete(deleteNotification);

module.exports = router;
