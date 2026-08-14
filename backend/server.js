const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION.... SHUTTING DOWN!!!!');
  console.log(err.stack);
  console.log(err.name, err.message);
  process.exit(1);
});

/// DATABASE CONNECTION HERE
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    serverSelectionTimeoutMS: 30000,
    family: 4,
    maxPoolSize: 50,
    minPoolSize: 5,
  })
  .then(() => console.log('DATABASE CONNECTION IS SUCCESSFUL'))
  .catch((error) => console.log(error));
const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`App is running on port ${port} `);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION.... SHUTTING DOWN!!!');
  console.log(err.stack);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
