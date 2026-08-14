const mongoose = require('mongoose');
const slugify = require('slugify');
const Task = require('./tasksModel');

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the board'],
    maxLength: [20, 'Please title must not be more than 20 chars'],
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A board must belong to a user'],
  },
  slug: 'String',
  column: [
    {
      status: {
        type: String,
        required: true,
        lowercase: true,
      },
      color: {
        type: String,
        required: true,
        lowercase: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    select: false,
  },
});

boardSchema.index({ owner: 1, slug: 1 });
boardSchema.index({ owner: 1, title: 1 });

boardSchema.pre('save', async function (next) {
  if (!this.column || this.column.length === 0) return next();

  const statuses = this.column.map((el) => el.status.toLowerCase().trim());
  const uniqueStatus = new Set(statuses);

  if (statuses.length !== uniqueStatus.size) {
    const error = new Error(
      'Duplicate column statuses are not allowed. Each status must be unique within the board.',
    );
    return next(error);
  }
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

boardSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Task.deleteMany({ board: doc._id });
  }
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
