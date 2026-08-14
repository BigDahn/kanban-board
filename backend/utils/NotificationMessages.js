const notificationMessages = {
  welcome_aboard: (data) => {
    if (!data?.userName) return;
    return `Welcome Aboard ${data.userName}, We Are Pleased To Have You Here.`;
  },

  password_updated: (data) =>
    `Hello ${data.userName}, Your Password Was Successfully Changed.`,
  email_updated: () => `Your Email Address Was Successfully Updated.`,
  profile_updated: () => 'Your Profile Has Been Updated',
};

module.exports = notificationMessages;
