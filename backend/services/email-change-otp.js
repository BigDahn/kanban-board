const Email = require('../utils/Email');

exports.emailChangedOtp = async (user, url, options) => {
  const email = new Email(user, url, options);

  await email.send(
    'emailChangedOtp',
    'Please verify your new email address using the OTP sent to your email.',
  );
};
