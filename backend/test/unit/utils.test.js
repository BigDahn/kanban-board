const notificationMessages = require('../../utils/NotificationMessages');

describe('notification messages', () => {
  it('returns a welcome message with the username after successful sign-up', () => {
    const result = notificationMessages.welcome_aboard({ userName: 'Dahn' });
    expect(result).toBe(
      'Welcome Aboard Dahn, We Are Pleased To Have You Here.',
    );
  });

  it('return undefined when no data is provided', () => {
    const result = notificationMessages.welcome_aboard();

    expect(result).not.toBeDefined();
  });

  it('returns undefined when userName is missing from data', () => {
    const result = notificationMessages.welcome_aboard({});
    expect(result).not.toBeDefined();
  });
});
