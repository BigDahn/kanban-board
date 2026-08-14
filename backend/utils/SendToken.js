const SignJwt = require('./SignJwt');

const createSendToken = (user, statusCode, res, message) => {
  const token = SignJwt(user);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token: token,
    message: message || undefined,
    data: {
      user,
    },
  });
};

module.exports = createSendToken;
