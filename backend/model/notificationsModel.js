const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'password_updated',
        'email_updated',
        'profile_updated',
        'welcome_aboard',
      ],
      required: [true, 'Please provide a notification type'],
    },
    descriptions: {
      type: String,
      required: [true, 'Please Provide a description'],
    },
    status: {
      type: String,
      default: 'Unread',
      enum: ['Unread', 'Read'],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A notification must belong to a user'],
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ owner: 1, status: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
