const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,

    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'password must be at least 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  photo: {
    url: {
      type: String,
      default:
        'https://res.cloudinary.com/kanbanapp/image/upload/v1768089144/default_ap4xd6.jpg',
    },
    publicId: {
      type: String,
    },
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  sex: {
    type: String,
    enum: ['male', 'female'],
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  zip: {
    type: String,
  },
  createdAt: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetTokenExpires: {
    type: Date,
    select: false,
  },
  passwordChangedDate: {
    type: Date,
    select: false,
  },
  emailResetToken: {
    type: String,
    select: false,
  },
  emailResetTokenExpires: {
    type: Date,
    select: false,
  },
  emailChangedDate: {
    type: Date,
    select: false,
  },
  pendingEmail: {
    type: String,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.index({ email: 1 });

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedDate = Date.now() - 1000;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePassword = async function (password1, password2) {
  // password1 --- password from the body while password2 is the password stored in the db
  return await bcrypt.compare(password1, password2);
};

userSchema.methods.changedPasswordAfter = function (jwt_Time_Stamp) {
  if (this.passwordChangedDate) {
    const passwordTimeStamp = parseInt(
      this.passwordChangedDate.getTime() / 1000,
      10,
    );

    return jwt_Time_Stamp < passwordTimeStamp;
  }

  return false;
};

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; /// expires after 10 mins

  return resetToken;
};

userSchema.methods.createEmailResetOTP = function () {
  const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit numeric code

  this.emailResetToken = crypto.createHash('sha256').update(otp).digest('hex');

  this.emailResetTokenExpires = Date.now() + 10 * 60 * 1000; // expires after 10 mins

  return otp; // plain OTP — this is what gets emailed to the user
};

const User = mongoose.model('User', userSchema);

module.exports = User;
