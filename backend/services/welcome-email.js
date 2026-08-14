const Email = require('../utils/Email');

exports.sendWelcome = async (user, url) => {
  const email = new Email(user, url);

  await email.send('welcome', 'Welcome to kanban App');
};
