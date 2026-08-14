const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const { Worker } = require('bullmq');
const connection = require('../config/redis');
const { sendWelcome } = require('../services/welcome-email');
const { forgotPassword } = require('../services/forgot-password');
const { updatePassword } = require('../services/update-password-email');
const { resetPassword } = require('../services/reset-password');
const { updateEmail } = require('../services/update-email');
const { emailChangedOtp } = require('../services/email-change-otp');

const worker = new Worker(
  'email',
  async (job) => {
    switch (job.name) {
      case 'send-welcome-email':
        return sendWelcome(job.data.user, job.data.url);

      case 'forgot-password':
        return forgotPassword(job.data.user, job.data.url);

      case 'update-password': {
        const { user, options } = job.data;
        return updatePassword(user, options);
      }
      case 'reset-password': {
        const { user, options } = job.data;
        return resetPassword(user, options);
      }
      case 'update-email': {
        const { user, url, options } = job.data;
        return updateEmail(user, url, options);
      }
      case 'email-changed-otp': {
        const { user, url, options } = job.data;
        return emailChangedOtp(user, url, options);
      }
      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  },
  {
    connection,
  },
);

worker.on('completed', (job) => {
  console.log(`Completed ${job.name}`);
});

worker.on('failed', (job, err) => {
  console.log(`${job.name} failed`);
  console.log(err);
});
worker.on('error', (err) => {
  console.error('Worker error:', err);
});

module.exports = worker;
