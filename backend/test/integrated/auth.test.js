jest.mock('../../config/redis');

jest.mock('../../queues/emailQueue', () => ({
  add: jest.fn().mockResolvedValue(true),
}));

const request = require('supertest');
const app = require('../../app');

describe("POST /'api/signUp", () => {
  it("fails when an email that doesn't exist is provided", async () => {
    await request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'tewrt@test.com',
        password: 'password',
      })
      .expect(401);
  });

  it('returns 401 when there is a missing email or password', async () => {
    await request(app).post('/api/v1/users/signUp').send({}).expect(401);
  });

  it('returns 400 when an invalid email is provided', async () => {
    await request(app)
      .post('/api/v1/users/signUp')
      .send({
        name: 'dahn',
        email: 'kqwjkqwqw',
        password: 'password',
        passwordConfirm: 'password',
      })
      .expect(400);
  });

  it('returns 400 when an invalid password is provided', async () => {
    await request(app)
      .post('/api/v1/users/signUp')
      .send({
        name: 'dahn',
        email: 'test@test.com',
        password: 'p',
        passwordConfirm: 'p',
      })
      .expect(400);
  });

  it('successfully creates a user', async () => {
    await request(app)
      .post('/api/v1/users/signUp')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: 'password',
        passwordConfirm: 'password',
      })
      .expect(201);
  });

  it('sets a cookie after successful sign-up', async () => {
    const response = await request(app)
      .post('/api/v1/users/signUp')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: 'password',
        passwordConfirm: 'password',
      })
      .expect(201);

    expect(response.body.token).toBeDefined();
    expect(response.get('Set-Cookie')).toBeDefined();
  });

  it('sets a cookie with a reasonable expiry duration', async () => {
    const response = await request(app)
      .post('/api/v1/users/signup')
      .send({
        name: 'Test',
        email: 'cookietest@test.com',
        password: 'password',
        passwordConfirm: 'password',
      })
      .expect(201);

    const cookie = response.get('Set-Cookie')[0];
    const expiresMatch = cookie.match(/Expires=([^;]+)/);
    const expiresDate = new Date(expiresMatch[1]);

    const hoursUntilExpiry = (expiresDate - Date.now()) / (1000 * 60 * 60);

    // should be roughly days, not hours — this would have caught the bug
    expect(hoursUntilExpiry).toBeGreaterThan(24);
  });
});

// --- LOGIN -- HERE --

describe('POST /api/login', () => {
  it('fails when an incorrect password is provided', async () => {
    await request(app)
      .post('/api/v1/users/signUp')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: 'password',
        passwordConfirm: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'test@test.com',
        password: 'testpass',
      })
      .expect(401);
  });

  it('fails when an invalid email is provided', async () => {
    await request(app)
      .post('/api/v1/users/signUp')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: 'password',
        passwordConfirm: 'password',
      })
      .expect(201);

    await request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'testswcom',
        password: 'password',
      })
      .expect(401);
  });

  it('responds with a cookie when given valid credentials', async () => {
    await request(app)
      .post('/api/v1/users/signUp')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: 'password',
        passwordConfirm: 'password',
      })
      .expect(201);
    const response = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});

// --- LOGOUT ROUTE HERE ---

describe('POST /api/users/logout', () => {
  it('clears the cookie after the user logs out', async () => {
    await request(app)
      .post('/api/v1/users/signUp')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: 'password',
        passwordConfirm: 'password',
      })
      .expect(201);
    const response1 = await request(app).post('/api/v1/users/login').send({
      email: 'test@test.com',
      password: 'password',
    });

    const response = await request(app)
      .post('/api/v1/users/logout')
      .send({})
      .set('Cookie', `jwt=${response1.body.token}`);

    expect(response.status).toBe(200);
  });

  it('sends an error when an unauthorized user tries to log out', async () => {
    await request(app).post('/api/v1/users/logout').send({}).expect(401);
  });
});

describe('DELETE USER /api/users/delete', () => {
  it('successfully deletes the user account', async () => {
    await request(app)
      .post('/api/v1/users/signUp')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: 'password',
        passwordConfirm: 'password',
      })
      .expect(201);

    const loginRes = await request(app).post('/api/v1/users/login').send({
      email: 'test@test.com',
      password: 'password',
    });

    const deleteRes = await request(app)
      .delete('/api/v1/users/deleteMe')
      .send({ password: 'password' })
      .set('Authorization', `Bearer ${loginRes.body.token}`);

    expect(deleteRes.status).toBe(200);
  });
});
