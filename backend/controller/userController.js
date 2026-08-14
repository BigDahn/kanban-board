const User = require('../model/userModel');
const BodyChecker = require('../utils/BodyCheck');
const sharp = require('sharp');
const CatchAsync = require('../utils/CatchAsync');
const ErrorClass = require('../utils/ErrorClass');
const createSendToken = require('../utils/SendToken');
const connection = require('../config/redis');
const multer = require('multer');
const { cloudinaryUpload, cloudinaryDelete } = require('../utils/Cloudinary');
const Notification = require('../model/notificationsModel');
const notificationMessages = require('../utils/NotificationMessages');
const emailQueue = require('../queues/emailQueue');
const crypto = require('crypto');

const multerStorage = multer.memoryStorage();

const blacklisted = new Set();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ErrorClass('Not an Image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.updateUserProfile = upload.single('photo'); // for a single image

exports.resizeUserPhoto = async (req, res, next) => {
  /// middleware for image optimization
  if (!req.file) return next();

  // req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  req.file.buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();
  next();
};

exports.getUser = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorClass('User not found', 404));

  createSendToken(user, 200, res);
});

exports.getMe = (req, res, next) => {
  req.params.userID = req.user._id;
  next();
};

exports.updateMe = CatchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ErrorClass('Password update not allowed in this route', 401),
    );
  }

  const user = await User.findById(req.user._id);

  if (!user) return next(new ErrorClass('No User found', 404));

  const filteredBody = BodyChecker(
    req.body,
    'name',
    'zip',
    'phone',
    'sex',
    'phone',
    'country',
    'city',
    'address',
  );

  if (req.body.photo === 'default' || req.body.photo === null) {
    if (user.photo?.publicId) {
      await cloudinaryDelete(user.photo.publicId);
    }
    filteredBody.photo = {
      url: process.env.DEFAULT_AVATAR_URL,
      publicId: null,
    };
  } else if (req.file) {
    try {
      if (user.photo?.publicId) {
        await cloudinaryDelete(user.photo.publicId);
      }

      const result = await cloudinaryUpload(req.file.buffer);

      filteredBody.photo = {
        url: result.url,
        publicId: result.public_id,
      };
    } catch (error) {
      return next(new ErrorClass('Photo upload failed', 500));
    }
  }

  Object.keys(filteredBody).forEach((key) => {
    user[key] = filteredBody[key];
  });

  await user.save({ validateModifiedOnly: true });

  user.password = undefined;

  await Notification.create({
    type: 'profile_updated',
    descriptions: notificationMessages.profile_updated(),
    owner: user._id,
  });

  res.status(200).json({
    status: 'Success',
    message: 'User profile updated',
    user,
  });
});

exports.updateEmail = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorClass('Email and password are required', 400));

  const user = await User.findById(req.user._id).select('+password');

  if (!user || !(await user.comparePassword(req.body.password, user.password)))
    return next(new ErrorClass('Incorrect password', 401));

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ErrorClass('Email already in use', 400));

  const otp = user.createEmailResetOTP();

  user.pendingEmail = email;

  await user.save({ validateModifiedOnly: true });
  user.password = undefined;

  await emailQueue.add('email-changed-otp', {
    user,
    options: { otp },
  });

  res.status(200).json({
    status: 'Success',
    message:
      'A verification code has been sent to your current email. Please confirm to complete the change.',
    expiresAt: user.emailResetTokenExpires,
  });
});

exports.verifyOtpAndUpdateEmail = CatchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  const { otp } = req.body;

  if (!otp) return next(new ErrorClass('OTP is required', 400));

  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await User.findOne({
    _id: req.user._id,
    emailResetToken: hashedOTP,
    emailResetTokenExpires: { $gt: Date.now() },
  }).select('+pendingEmail');

  if (!user) return next(new ErrorClass('OTP not found or expired', 401));

  if (!user.pendingEmail) {
    return next(new ErrorClass('No pending email change request found', 400));
  }

  user.email = user.pendingEmail;
  user.pendingEmail = undefined;
  user.emailResetToken = undefined;
  user.emailResetTokenExpires = undefined;

  await user.save({ validateModifiedOnly: true });

  await Notification.create({
    type: 'email_updated',
    descriptions: notificationMessages.email_updated(),
    owner: user._id,
  });

  await emailQueue.add('update-email', {
    user,
    options: {
      date: new Date().toDateString(),
      time: new Date().toLocaleTimeString('en-US'),
    },
  });

  if (token) {
    if (process.env.NODE_ENV === 'production') {
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET,
      );
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
      if (expiresIn > 0) {
        await connection.set(
          `blacklisted:${token}`,
          'revoked',
          'EX',
          expiresIn,
        );
      }
    } else {
      blacklisted.add(token);
    }
  }
  res.status(200).json({
    status: 'success',
    message: 'Email updated successfully. Please log in again.',
  });
});

exports.resendOtp = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+pendingEmail');

  if (!user || !user.pendingEmail) {
    return next(new ErrorClass('No pending email change request found', 400));
  }

  const otp = user.createEmailResetOTP();
  await user.save({ validateModifiedOnly: true });

  await emailQueue.add('email-changed-otp', {
    user,
    options: { otp },
  });

  res.status(200).json({
    status: 'Success',
    message: 'A new verification code has been sent to your current email.',
    expiresAt: user.emailResetTokenExpires,
  });
});
