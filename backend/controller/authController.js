const User = require('../model/userModel');
const crypto = require('crypto');
const CatchAsync = require('../utils/CatchAsync');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const ErrorClass = require('../utils/ErrorClass');
const Email = require('../utils/Email');
const createSendToken = require('../utils/SendToken');
const connection = require('../config/redis');
const emailQueue = require('../queues/emailQueue');
const Notification = require('../model/notificationsModel');
const notificationMessages = require('../utils/NotificationMessages');

const blacklisted = new Set();

exports.isBlacklisted = blacklisted;

exports.signUp = CatchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return next(new ErrorClass('Please Provide Your Email and Password', 401));

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${process.env.FRONTEND_URL}/`;

  await Promise.all([
    Notification.create({
      type: 'welcome_aboard',
      descriptions: notificationMessages.welcome_aboard({
        userName: user.name,
      }),
      owner: user._id,
    }),
    emailQueue.add(
      'send-welcome-email',
      { user, url },
      {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    ),
  ]);

  createSendToken(user, 201, res);
});

exports.login = CatchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return next(new ErrorClass('Please Provide Your Email and Password', 401));

  const user = await User.findOne({
    email: req.body.email,
  }).select('+password');

  if (!user || !(await user.comparePassword(req.body.password, user.password)))
    return next(new ErrorClass('Invalid Email or password', 401));

  createSendToken(user, 200, res);
});

exports.protect = CatchAsync(async (req, res, next) => {
  let token;
  let isBlackListed;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization?.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === 'loggedOut')
    return next(
      new ErrorClass(
        'You are not logged in .. Please login and try again',
        401,
      ),
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  if (process.env.NODE_ENV === 'production') {
    isBlackListed = await connection.get(`blacklisted:${token}`);
  } else {
    isBlackListed = blacklisted.has(token);
  }

  if (isBlackListed || isBlackListed === 'revoked') {
    return next(new ErrorClass('User not logged in.. Please Login again', 401));
  }

  const user = await User.findById(decoded.userId);

  if (!user)
    return next(
      new ErrorClass('The user belonging to this token no longer exists.', 401),
    );

  if (user.changedPasswordAfter(decoded.iat))
    return next(
      new ErrorClass(
        'User recently changed password. Please log in again.',
        401,
      ),
    );

  req.user = user;

  next();
});

exports.forgotPassword = CatchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new ErrorClass('There is no user with that email', 401));

  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  const url = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

  await emailQueue.add(
    'forgot-password',
    { user, url },
    {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    },
  );
  res.status(200).json({
    status: 'success',
    message: 'Password reset email sent.',
  });
});

exports.resetPassword = CatchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(new ErrorClass('Invalid Token or Token has Expired', 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();
  const options = {
    date: new Date().toDateString(),
    time: new Date().toLocaleTimeString('en-US'),
  };

  await Promise.all([
    Notification.create({
      type: 'password_reset',
      descriptions: notificationMessages.password_updated({
        userName: user.name,
      }),
      owner: user._id,
    }),
    emailQueue.add(
      'reset-password',
      {
        user,
        options,
      },
      {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    ),
  ]);

  createSendToken(user, 200, res, 'Password Changed Successfully');
});

exports.updatePassword = CatchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (
    !req.body.passwordCurrent ||
    !req.body.password ||
    !req.body.passwordConfirm
  )
    return next(new ErrorClass('Please provide the required fields', 400));

  const user = await User.findById(req.user._id).select('+password');

  if (
    !user ||
    !(await user.comparePassword(req.body.passwordCurrent, user.password))
  )
    return next(new ErrorClass('Invalid password', 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  user.passwordConfirm = undefined;
  user.password = undefined;

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

  const options = {
    date: new Date().toDateString(),
    time: new Date().toLocaleTimeString('en-US'),
  };

  await Promise.all([
    Notification.create({
      type: 'password_updated',
      descriptions: notificationMessages.password_updated({
        userName: user.name,
      }),
      owner: user._id,
    }),
    emailQueue.add(
      'update-password',
      {
        user,
        options,
      },
      {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    ),
  ]);

  res.status(200).json({
    status: 'Success',
    message: 'Password Changed Successfully, Please Login again',
  });
});

exports.logout = async (req, res, next) => {
  const token = req.cookies.jwt;

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

  res.cookie('jwt', 'loggedOut', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({
    status: 'Success',
    message: 'Logged out Successfully',
  });
};

exports.deleteUser = CatchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  const { password } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user) return next(new ErrorClass('User not found', 404));

  if (!(await user.comparePassword(password, user.password)))
    return next(
      new ErrorClass('Incorrect password. Account deletion cancelled', 401),
    );

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

  user.active = false;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'Success',
    message: 'Account deleted Successfully',
  });
});
