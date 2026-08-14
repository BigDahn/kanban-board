const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  { _id: true },
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A task must have a title'],
    },
    description: {
      type: String,
      default: '',
    },
    board: {
      type: mongoose.Schema.ObjectId,
      ref: 'Board',
      required: [true, 'A task must belong to a board'],
      index: true,
    },
    status: {
      type: String,
      required: true,
    },
    subTasks: [subTaskSchema], // for embedded data
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  { timestamps: true },
);

taskSchema.index({ board: 1 });
taskSchema.index({ board: 1, status: 1 });

taskSchema.pre('save', async function (next) {
  if (this.isModified('status') || this.isNew) {
    try {
      const Board = this.constructor.model('Board');
      const board = await Board.findById(this.board);

      if (!board) return next('Board not found ');

      const validStatus = board.column.map((el) => el.status);

      if (!validStatus.includes(this.status)) {
        return next(
          new Error(
            `Invalid status "${
              this.status
            }". Valid statuses for this board are: ${validStatus.join(', ')}`,
          ),
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

taskSchema.pre(/^find/, function () {
  this.select('-createdAt');
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
