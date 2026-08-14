import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Trend } from 'k6/metrics';

// -----------------------------------------------------------------------
// CONFIG — adjust these to match your actual routes/payload shapes
// -----------------------------------------------------------------------
const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000/api/v1';

// Custom metrics (show up nicely in Grafana if you pipe results there)
const signupFailures = new Counter('signup_failures');
const loginFailures = new Counter('login_failures');
const boardCreateTrend = new Trend('board_create_duration');

export const options = {
  scenarios: {
    ramping_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 }, // ramp up to 20 virtual users
        { duration: '1m', target: 20 }, // hold steady
        { duration: '30s', target: 50 }, // spike to 50
        { duration: '1m', target: 50 }, // hold at spike
        { duration: '30s', target: 0 }, // ramp down
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be under 500ms
    http_req_failed: ['rate<0.05'], // error rate should stay under 5%
  },
};

// -----------------------------------------------------------------------
// HELPER — generate a unique user per VU/iteration so signups don't collide
// -----------------------------------------------------------------------
function randomEmail() {
  return `loadtest_${__VU}_${__ITER}_${Date.now()}@example.com`;
}

// k6 automatically maintains a cookie jar per VU across requests in the
// same iteration — since your auth uses an httpOnly `jwt` cookie set by
// createSendToken(), we don't need to manually extract/attach anything.
// Just make requests normally and the jwt cookie rides along automatically.

const jsonHeaders = { headers: { 'Content-Type': 'application/json' } };

export default function () {
  group('Signup', () => {
    const email = randomEmail();
    const payload = JSON.stringify({
      name: 'Load Test User',
      email,
      password: 'TestPassword123!',
      passwordConfirm: 'TestPassword123!',
    });

    const res = http.post(`${BASE_URL}/users/signup`, payload, jsonHeaders);

    const ok = check(res, {
      'signup status is 201': (r) => r.status === 201,
    });

    if (!ok) signupFailures.add(1);
    // On success, the jwt cookie is now set for this VU's session —
    // subsequent requests in this iteration are already authenticated.
  });

  sleep(1);

  group('Login', () => {
    // Using a known seeded user is more realistic than re-logging-in as
    // the just-created one — set TEST_EMAIL/TEST_PASSWORD to a real
    // pre-existing account, or just let signup's cookie carry through
    // and skip this group if you'd rather test the signup->active-session
    // path instead of a separate login.
    const payload = JSON.stringify({
      email: __ENV.TEST_EMAIL || 'loadtest-fixed-user@example.com',
      password: __ENV.TEST_PASSWORD || 'TestPassword123!',
    });

    const res = http.post(`${BASE_URL}/users/login`, payload, jsonHeaders);

    const ok = check(res, {
      'login status is 200': (r) => r.status === 200,
    });

    if (!ok) loginFailures.add(1);
  });

  sleep(1);

  // TODO: confirm the mount prefix (assumed /api/v1/boards below —
  // update if app.js mounts this router differently, e.g. /api/v1/users/boards)
  group('Create Board', () => {
    // Board title schema caps at 20 chars (maxLength: 20) and createBoard
    // rejects duplicate titles per-owner, so this needs to stay short AND
    // unique across every run, not just within one run.
    const payload = JSON.stringify({
      title: `LT${Date.now()}${__VU}`.slice(0, 20),
      column: [{ status: 'todo', color: '#6366f1' }], // adjust to match your Column subdocument schema
    });

    const start = Date.now();
    const res = http.post(
      `${BASE_URL}/boards/createBoard`,
      payload,
      jsonHeaders,
    );
    boardCreateTrend.add(Date.now() - start);

    check(res, {
      'create board status is 200': (r) => r.status === 200,
    });
  });

  sleep(1);

  group('Get Boards', () => {
    const res = http.get(`${BASE_URL}/boards/getAllBoards`, jsonHeaders);

    check(res, {
      'get boards status is 200': (r) => r.status === 200,
    });
  });

  sleep(2);
}
