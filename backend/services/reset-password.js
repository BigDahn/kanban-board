const Email = require('../utils/Email');

exports.resetPassword = async (user, url, options) => {
  const email = new Email(user, url, options);

  await email.send(
    'resetPassword',
    'Your password has been Updated Successfully',
  );
};
