const Email = require('../utils/Email');

exports.updateEmail = async (user, url, options) => {
  const email = new Email(user, url, options);

  await email.send('updateEmail', 'Your email has been changed Successfully');
};
