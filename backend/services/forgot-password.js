const Email = require('../utils/Email');

exports.forgotPassword = async (user, url) => {
  const email = new Email(user, url);

  await email.send(
    'forgotPassword',
    'Password Reset Link sent to Your Email (Valid for only 10 minutes)',
  );
};
