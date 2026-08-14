const Email = require('../utils/Email');

exports.updatePassword = async (user, url, options) => {
  const email = new Email(user, url, options);

  await email.send(
    'passwordChanged',
    'Your password has been changed Successfully',
  );
};
