const ErrorClass = require('../utils/ErrorClass');

const handleDuplicateFieldDB = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];

  const message =
    field === 'email'
      ? `An account with ${value} already exists. Try logging in instead.`
      : `${field} "${value}" is already taken. Please choose another.`;

  return new ErrorClass(message, 404);
};

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;

  return new ErrorClass(message, 404);
};

const handleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data:${error.join(', ')}`;

  return new ErrorClass(message, 400);
};

const handleJwtError = (err) =>
  new ErrorClass('Invalid token.. Please Log in again', 401);

const handleJwtExpiredError = (err) =>
  new ErrorClass('Token has expired .. Log in again', 401);

function sendDevError(err, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
}

function sendProdError(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = Object.create(err);

  if (error.code === 11000) error = handleDuplicateFieldDB(error);
  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJwtError(error);
  if (error.name === 'TokenExpiredError') error = handleJwtExpiredError(error);
  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  }
  sendProdError(error, res);
};

//  status: "error",
// message: "Something went very wrong",
