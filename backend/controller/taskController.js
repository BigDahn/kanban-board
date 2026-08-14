const connection = require('../config/redis');
const Board = require('../model/boardModel');
const Task = require('../model/tasksModel');
const BodyChecker = require('../utils/BodyCheck');
const CatchAsync = require('../utils/CatchAsync');
const ErrorClass = require('../utils/ErrorClass');

exports.addNewTask = CatchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const board = await Board.findOne({ slug, owner: req.user._id });

  if (!board) return next(new ErrorClass('Board not found', 404));

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    board: board._id,
    status: req.body.status,
    subTasks: req.body.subtasks,
  });
  await connection.del(`board:${req.user._id}:${req.params.slug}`);
  res.status(200).json({
    status: 'success',
    message: 'Task Successfully created',
    data: {
      task,
    },
  });
});

exports.deleteTask = CatchAsync(async (req, res, next) => {
  const { taskId, slug } = req.params;

  const board = await Board.findOne({ slug, owner: req.user._id });
  if (!board) return next(new ErrorClass('Board not found', 404));

  const task = await Task.findOneAndDelete({
    _id: taskId,
    board: board._id,
  });

  if (!task) return next(new ErrorClass('Task not found', 404));
  await connection.del(`board:${req.user._id}:${req.params.slug}`);

  res.status(200).json({
    status: 'success',
    message: 'Task Deleted Successfully',
  });
});

exports.editTask = CatchAsync(async (req, res, next) => {
  const { slug, taskId } = req.params;

  const board = await Board.findOne({ slug, owner: req.user._id });

  if (!board) return next(new ErrorClass('Board Not Found', 404));

  const task = await Task.findById(taskId);

  if (!task) return next(new ErrorClass('Task not found', 404));

  if (board.id !== task.board.toString())
    return next(new ErrorClass('Task does not belong to this board', 403));

  const filteredObj = BodyChecker(
    req.body,
    'title',
    'description',
    'status',
    'subTasks',
  );

  if (req.body.title) task.title = filteredObj.title;
  if (req.body.description) task.description = filteredObj.description;
  if (req.body.status) task.status = filteredObj.status;
  if (req.body.subTasks) task.subTasks = filteredObj.subTasks;

  await task.save();
  await connection.del(`board:${req.user._id}:${req.params.slug}`);

  res.status(200).json({
    status: 'success',
    message: 'Task Updated Successfully',
    data: {
      task,
    },
  });
});
