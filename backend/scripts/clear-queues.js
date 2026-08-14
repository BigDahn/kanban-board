const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const emailQueue = require('../queues/emailQueue');

(async () => {
  await emailQueue.clean(0, 1000, 'completed');
  await emailQueue.clean(0, 1000, 'failed');
  console.log('✅ Queue cleaned');

  process.exit(0);
})();
