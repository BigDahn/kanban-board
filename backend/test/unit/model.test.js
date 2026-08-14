const User = require('../../model/userModel');

describe('password validation', () => {
  it('returns true when the password match', () => {
    const context = { password: 'abc123' };
    const validator = User.schema.path('passwordConfirm').validators;
    const matchValidator = validator.find(
      (v) => v.message === 'Passwords are not the same',
    );

    expect(matchValidator).toBeDefined();
    expect(
      matchValidator.validator.call({ password: 'abc123' }, 'abc123'),
    ).toBe(true);
  });
  it('returns false when the password do not match', () => {
    const context = { password: 'abc123' };
    const validator = User.schema.path('passwordConfirm').validators;
    const matchValidator = validator.find(
      (v) => v.message === 'Passwords are not the same',
    );

    expect(matchValidator).toBeDefined();
    expect(
      matchValidator.validator.call({ password: 'abc123' }, 'abc12233'),
    ).toBe(false);
  });

  it('fails validation if the password is shorter than 8 characters', () => {
    const validator = User.schema.path('password').validators;
    const matchValidator = validator.find(
      (v) => v.message === 'password must be at least 8 characters',
    );

    expect(matchValidator).toBeDefined();
  });

  it('passes validation if the password is 8 or more than 8 chars', () => {
    const validators = User.schema.path('password').validators;
    const matchValidator = validators.find((v) => {
      return v.message === 'password must be at least 8 characters';
    });

    expect(matchValidator.validator('abc12354')).toBe(true);
  });
});
