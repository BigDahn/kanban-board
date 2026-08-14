const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  isBlacklisted,
  deleteUser,
  logout,
  protect,
} = require('../../controller/authController');

const User = require('../../model/userModel');
const Notification = require('../../model/notificationsModel');
const createSendToken = require('../../utils/SendToken');
const emailQueue = require('../../queues/emailQueue');
const notificationMessages = require('../../utils/NotificationMessages');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');
jest.mock('../../model/userModel');
jest.mock('../../model/notificationsModel');
jest.mock('../../utils/SendToken');
jest.mock('../../queues/emailQueue');

// SIGN UP CONTROLLER

describe('signUp controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        name: 'Dahn',
        email: 'dahn@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      },
    };
    ((res = {}), (next = jest.fn()));
    jest.clearAllMocks();
  });

  it('call next with an error if the email is missing', async () => {
    req.body.email = undefined;

    await signUp(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Please Provide Your Email and Password',
      }),
    );

    expect(User.create).not.toHaveBeenCalled();
  });

  it('calls an error if password is missing', async () => {
    req.body.password = undefined;

    await signUp(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Please Provide Your Email and Password',
      }),
    );
    expect(User.create).not.toHaveBeenCalled();
  });

  it('creates a new user with the correct data', async () => {
    const fakeUser = { _id: 123, name: 'Dahn' };
    User.create.mockResolvedValue(fakeUser);

    await signUp(req, res, next);

    expect(User.create).toHaveBeenCalledWith({
      name: 'Dahn',
      email: 'dahn@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    });
  });

  it('sends a notification after a successful signin', async () => {
    const fakeUser = { _id: 123, name: 'Dahn' };

    User.create.mockResolvedValue(fakeUser);

    await signUp(req, res, next);

    expect(Notification.create).toHaveBeenCalledWith({
      type: 'welcome_aboard',
      descriptions: notificationMessages.welcome_aboard({
        userName: fakeUser.name,
      }),
      owner: fakeUser._id,
    });
  });

  it('adds a welcome email job to the queue', async () => {
    const fakeUser = { _id: 123, name: 'Dahn' };
    User.create.mockResolvedValue(fakeUser);

    await signUp(req, res, next);

    expect(emailQueue.add).toHaveBeenCalledWith(
      'send-welcome-email',
      expect.objectContaining({ user: fakeUser }),
    );
  });

  it('calls createSendToken with the created User', async () => {
    const fakeUser = { _id: 123, name: 'Dahn' };
    User.create.mockResolvedValue(fakeUser);

    await signUp(req, res, next);

    expect(createSendToken).toHaveBeenCalledWith(fakeUser, 201, res);
  });
});

// LOGIN CONTROLLER

describe('login controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@test.com',
        password: 'test12345',
      },
    };
    ((res = {}), (next = jest.fn()));
    jest.clearAllMocks();
  });

  it('calls next with an error if email field is missing', async () => {
    req.body.email = undefined;

    await signUp(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Please Provide Your Email and Password',
      }),
    );
    expect(User.create).not.toHaveBeenCalled();
  });

  it('calls next with an error if password field is missing', async () => {
    req.body.password = undefined;

    await signUp(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Please Provide Your Email and Password',
      }),
    );
    expect(User.create).not.toHaveBeenCalled();
  });

  it('calls next with an error if an unregistered email is provided', async () => {
    ((req.body.email = 'dahn@test.com'), (req.body.password = 'password12345'));

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });
    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid Email or password',
      }),
    );
  });

  it('calls next with an error if the password is incorrect', async () => {
    ((req.body.email = 'test@test.com'), (req.body.password = 'wrongPassword'));

    const fakeUser = {
      _id: '123',
      email: 'test@test.com',
      password: 'hashedPassword',
      comparePassword: jest.fn().mockResolvedValue(false),
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeUser),
    });

    await login(req, res, next);

    expect(fakeUser.comparePassword).toHaveBeenCalledWith(
      'wrongPassword',
      'hashedPassword',
    );
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid Email or password' }),
    );
  });

  it('calls createSendToken when credentials are correct', async () => {
    ((req.body.email = 'test@test.com'),
      (req.body.password = 'hashedPassword'));

    const fakeUser = {
      _id: '123',
      email: 'test@test.com',
      password: 'hashedPassword',
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeUser),
    });

    await login(req, res, next);

    expect(createSendToken).toHaveBeenCalledWith(fakeUser, 200, res);
  });
});

// FORGOT PASSWORD CONTROLLER

describe('forgotPassword Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: 'dahn@test.com',
      },
      params: {},
    };
    ((res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }),
      (next = jest.fn()));
    jest.clearAllMocks();
  });

  it('calls next with an error if an unregistered email is provided', async () => {
    req.body.email = 'fake@test.com';
    User.findOne.mockResolvedValue(null);

    await forgotPassword(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'There is no user with that email',
      }),
    );
    expect(emailQueue.add).not.toHaveBeenCalled();
  });

  it('successfully finds the email and sets reset token and adds to queue', async () => {
    req.body.email = 'test@test.com';

    const fakeUser = {
      _id: '123',
      email: 'test@test.com',
      createResetToken: jest.fn().mockReturnValue('fake-reset-token'),
      save: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockResolvedValue(fakeUser);

    await forgotPassword(req, res, next);

    const expectedUrl = `${process.env.FRONTEND_URL}/resetPassword/fake-reset-token`;

    expect(fakeUser.createResetToken).toHaveBeenCalled();
    expect(fakeUser.save).toHaveBeenCalledWith({ validateBeforeSave: false });

    expect(emailQueue.add).toHaveBeenCalledWith(
      'forgot-password',
      { user: fakeUser, url: expectedUrl },
      expect.objectContaining({
        attempts: 5,
        backoff: { type: 'exponential', delay: 5000 },
      }),
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Password reset email sent.',
    });
  });
});

// UPDATE PASSWORD CONTROLLER

describe('update password controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@test.com',
        password: 'password123',
        passwordCurrent: 'password',
        passwordConfirm: 'password123',
      },
      headers: {
        authorization: 'Bearer someToken123',
      },
    };
    (isBlacklisted.clear(),
      (res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }),
      (next = jest.fn()),
      jest.clearAllMocks());
  });

  it("successfully updates user's password, sends a notification and adds job to the queue", async () => {
    req.user = { _id: 'user-id-123' };
    req.body.password = 'newPassword';
    req.body.passwordCurrent = 'oldPassword';
    req.body.passwordConfirm = 'newPassword';

    const fakeUser = {
      _id: '123',
      name: 'dahn',
      email: 'test@test.com',
      password: 'oldPassword',
      passwordConfirm: 'oldPassword',
      comparePassword: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
    };

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeUser),
    });

    // let capturedPasswordAtSaveTime;
    // fakeUser.save = jest.fn().mockImplementation(async function () {
    //   capturedPasswordAtSaveTime = fakeUser.password;
    //   return true;
    // });

    await updatePassword(req, res, next);

    expect(fakeUser.comparePassword).toHaveBeenCalledWith(
      'oldPassword',
      'oldPassword',
    );

    expect(fakeUser.save).toHaveBeenCalled();

    // expect(capturedPasswordAtSaveTime).toBe('newPassword');

    expect(fakeUser.passwordConfirm).toBeUndefined();
    expect(fakeUser.password).toBeUndefined();

    expect(isBlacklisted.has('someToken123')).toBe(true);

    expect(Notification.create).toHaveBeenCalledWith({
      type: 'password_updated',
      descriptions: notificationMessages.password_updated({
        userName: fakeUser.name,
      }),
      owner: fakeUser._id,
    });

    expect(emailQueue.add).toHaveBeenCalledWith(
      'update-password',
      expect.objectContaining({
        user: fakeUser,
        options: expect.objectContaining({
          date: expect.any(String),
          time: expect.any(String),
        }),
      }),
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Success',
      message: 'Password Changed Successfully, Please Login again',
    });
  });

  it('calls next if any of the password fields are empty', async () => {
    req.body.password = undefined;
    ((req.body.passwordConfirm = 'newPassword'),
      (req.body.passwordCurrent = 'oldPassword'));

    await updatePassword(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Please provide the required fields',
      }),
    );
  });

  it('calls next when the saved password does not match with what was provided', async () => {
    req.user = { _id: 'user-id-123' };
    ((req.body.passwordCurrent = 'fakePassword'),
      (req.body.password = 'newPassword'),
      (req.body.passwordConfirm = 'newPassword'));

    const fakeUser = {
      _id: '123',
      name: 'dahn',
      email: 'test@test.com',
      password: 'oldPassword',
      passwordConfirm: 'oldPassword',
      comparePassword: jest.fn().mockResolvedValue(false),
      save: jest.fn().mockResolvedValue(true),
    };

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeUser),
    });

    await updatePassword(req, res, next);

    expect(fakeUser.comparePassword).toHaveBeenCalledWith(
      'fakePassword',
      'oldPassword',
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid password',
      }),
    );
  });

  it('calls next with an error if no user is found for the given id', async () => {
    req.user = { _id: 'some-id' };

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await updatePassword(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid password',
      }),
    );
  });
});

// DELETE USER CONTROLLER
describe('delete Controller', () => {
  let req, res, next;
  beforeEach(() => {
    req = {
      body: {
        name: 'dahn',
        email: 'test@test.com',
        password: 'oldPasssword',
      },
      headers: {
        authorization: 'Bearer someToken',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    isBlacklisted.clear();
    jest.clearAllMocks();
  });

  it('successfully deletes the user', async () => {
    req.user = { _id: '123' };
    req.body.password = 'password123';

    const fakeUser = {
      _id: '123',
      name: 'dahn',
      email: 'test@test.com',
      password: 'password123',
      active: true,
      comparePassword: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
    };

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeUser),
    });

    await deleteUser(req, res, next);

    expect(isBlacklisted.has('someToken')).toBe(true);

    expect(fakeUser.comparePassword).toHaveBeenCalledWith(
      'password123',
      'password123',
    );

    expect(fakeUser.active).toBe(false);
    expect(fakeUser.save).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Success',
      message: 'Account deleted Successfully',
    });
  });

  it('calls next when an incorrect password was provided', async () => {
    req.user = { _id: '123' };
    req.body.password = 'fakePassword';

    const fakeUser = {
      _id: '123',
      name: 'dahn',
      email: 'test@test.com',
      password: 'password123',
      active: true,
      comparePassword: jest.fn().mockResolvedValue(false),
      save: jest.fn().mockResolvedValue(false),
    };

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(fakeUser),
    });

    await deleteUser(req, res, next);
    expect(fakeUser.comparePassword).toHaveBeenCalledWith(
      'fakePassword',
      'password123',
    );
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Incorrect password. Account deletion cancelled',
      }),
    );
    expect(fakeUser.active).toBe(true);
    expect(fakeUser.save).not.toHaveBeenCalled();
    expect(isBlacklisted.has('someToken')).toBe(true);
  });

  it("calls next when the user doesn't exist", async () => {
    req.user = { _id: 'some-random-user' };

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await deleteUser(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User not found',
      }),
    );
    expect(isBlacklisted.has('someToken')).toBe(true);
  });
});

// LOGOUT CONTROLLER
describe('logout controller', () => {
  let req, res, next;

  beforeEach(() => {
    ((req = {
      headers: {
        cookie: 'jwt=someToken123',
      },
    }),
      (res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }));
    next = jest.fn();
    isBlacklisted.clear();
    jest.clearAllMocks();
  });

  it('successfully logs the user out', async () => {
    await logout(req, res, next);

    expect(isBlacklisted.has('someToken123')).toBe(true);
    expect(res.cookie).toHaveBeenCalledWith('jwt', 'loggedOut', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Success',
      message: 'Logged out Successfully',
    });
  });
});

//RESET PASSWORD

describe('reset password controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@test.com',
      },
      params: {},
    };
    ((res = {}), (next = jest.fn()));
    jest.clearAllMocks();
  });

  it('successfully hashes the token ,resets the password adds to queue and sends a notification with a token', async () => {
    req.params.token = 'random-hashed-token';
    req.body.password = 'password123';
    req.body.passwordConfirm = 'password123';

    const fakeUser = {
      _id: '123',
      name: 'dahn',
      email: 'test@test.com',
      password: 'oldPassword',
      passwordConfirm: 'oldPassword',
      passwordResetToken: 'old-hashed-token',
      save: jest.fn().mockResolvedValue(true),
      passwordResetTokenExpires: Date.now() + 1000,
    };

    User.findOne.mockResolvedValue(fakeUser);

    await resetPassword(req, res, next);

    expect(fakeUser.password).toBe('password123');
    expect(fakeUser.passwordConfirm).toBe('password123');
    expect(fakeUser.passwordResetToken).toBeUndefined();
    expect(fakeUser.passwordResetTokenExpires).toBeUndefined();
    expect(fakeUser.save).toHaveBeenCalled();

    expect(Notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'password_reset',
        descriptions: notificationMessages.password_updated({
          userName: fakeUser.name,
        }),
        owner: fakeUser._id,
      }),
    );

    expect(emailQueue.add).toHaveBeenCalledWith(
      'reset-password',
      expect.objectContaining({
        user: fakeUser,
        options: expect.objectContaining({
          date: expect.any(String),
          time: expect.any(String),
        }),
      }),
    );

    expect(createSendToken).toHaveBeenCalledWith(
      fakeUser,
      200,
      res,
      'Password Changed Successfully',
    );
  });

  it('calls next with an error when an invalid or expired token is issued', async () => {
    req.params.token = 'fake-hashed-token';
    req.body.password = 'password123';
    req.body.passwordConfirm = 'password123';

    User.findOne.mockResolvedValue(null);

    await resetPassword(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid Token or Token has Expired',
      }),
    );
  });
});

// PROTECT MIDDLEWARE
describe('Protect Middleware Controller', () => {
  let req, res, next;
  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer someToken123',
      },
      cookies: {
        jwt: '',
      },
    };
    ((res = {}), (next = jest.fn()));
    isBlacklisted.clear();
    jest.clearAllMocks();
  });

  it('allows access to protected route', async () => {
    const decoded = { userId: '123', iat: 1000000000 };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decoded);
    });

    const fakeUser = {
      _id: '123',
      changedPasswordAfter: jest.fn().mockReturnValue(false),
    };

    User.findById.mockResolvedValue(fakeUser);
    await protect(req, res, next);

    expect(fakeUser.changedPasswordAfter).toHaveBeenCalledWith(decoded.iat);

    expect(req.user).toBe(fakeUser);

    expect(next).toHaveBeenCalled();
  });
  it('calls next with an error if the token is blacklisted', async () => {
    const decoded = { userId: '123', iat: 1000000000 };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decoded);
    });

    isBlacklisted.add('someToken123'); // simulate a PREVIOUSLY blacklisted token

    await protect(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User not logged in.. Please Login again',
      }),
    );
  });
  it('calls next with an error if no token is provided', async () => {
    req.headers.authorization = undefined;

    await protect(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'You are not logged in .. Please login and try again',
      }),
    );
  });
  it('calls next with an error if the user no longer exists', async () => {
    const decoded = { userId: '123', iat: 1000000000 };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decoded);
    });

    User.findById.mockResolvedValue(null);

    await protect(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'The user belonging to this token no longer exists.',
      }),
    );
  });
  it('calls next with an error if the password was changed after the token was issued', async () => {
    const decoded = { userId: '123', iat: 1000000000 };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decoded);
    });

    const fakeUser = {
      _id: '123',
      changedPasswordAfter: jest.fn().mockReturnValue(true),
    };

    User.findById.mockResolvedValue(fakeUser);

    await protect(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User recently changed password. Please log in again.',
      }),
    );
  });
});
