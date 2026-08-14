const connection = require('../config/redis');
const Board = require('../model/boardModel');
const Task = require('../model/tasksModel');
const BodyChecker = require('../utils/BodyCheck');
const CatchAsync = require('../utils/CatchAsync');
const ErrorClass = require('../utils/ErrorClass');

exports.createBoard = CatchAsync(async (req, res, next) => {
  const { title, description, column } = req.body;

  if (!title || !column || column.length === 0) {
    return next(
      new ErrorClass('Please provide a title and at least one column', 400),
    );
  }

  const existing = await Board.findOne({
    title: { $regex: new RegExp(`^${title}$`, 'i') },
    owner: req.user._id,
  });

  if (existing) {
    return next(
      new ErrorClass('You already have a board with this title', 401),
    );
  }

  const board = await Board.create({
    title: title,
    description: description,
    owner: req.user._id,
    column: column,
  });

  await connection.del(`boards:${req.user._id}`);

  res.status(200).json({
    message: 'Board Created Successfully',
    data: {
      board,
    },
  });
});

exports.getBoard = CatchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const cachedKey = `board:${req.user._id}:${slug}`;

  const cached = await connection.get(cachedKey);

  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  const board = await Board.findOne({
    slug: slug,
    owner: req.user._id,
  });

  if (!board) return next(new ErrorClass('Board Not Found', 404));

  const task = await Task.find({
    board: board._id,
  });

  const column = board.column.map((el) => ({
    id: el._id,
    status: el.status,
    color: el.color,
    tasks: task.filter((e) => e.status === el.status),
  }));

  const responseBody = {
    status: 'success',
    data: {
      _id: board._id,
      title: board.title,
      slug: board.slug,
      column,
    },
  };

  await connection.set(cachedKey, JSON.stringify(responseBody), 'EX', 60);

  res.status(200).json(responseBody);
});

exports.getAllBoard = CatchAsync(async (req, res, next) => {
  const cachedKey = `boards:${req.user._id}`;

  const cached = await connection.get(cachedKey);

  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  const board = await Board.find({
    owner: req.user._id,
  });

  if (!board)
    return next(new ErrorClass("Sorry you don't have any active board", 401));

  const responseBody = {
    status: 'success',
    length: board.length,
    data: {
      board,
    },
  };

  await connection.set(cachedKey, JSON.stringify(responseBody), 'EX', 60);

  res.status(200).json(responseBody);
});

exports.editBoard = CatchAsync(async (req, res, next) => {
  const board = await Board.findOne({
    slug: req.params.slug,
    owner: req.user._id,
  });

  if (!board) return next(new ErrorClass('No Board found .. Try again', 400));

  if (req.body.column) {
    const statues = req.body.column.map((el) => el.status.toLowerCase().trim());

    const uniqueStatus = new Set(statues);

    if (statues.length !== uniqueStatus.size) {
      return next(
        new ErrorClass('Duplicate column statuses are not allowed', 400),
      );
    }
  }

  // Find columns whose status changed
  const changedColumns = req.body.column.filter((newCol) => {
    const oldCol = board.column.find((old) => old._id.toString() === newCol.id);

    return oldCol && oldCol.status !== newCol.status.toLowerCase().trim();
  });

  // Update tasks for changed columns
  if (changedColumns.length > 0) {
    const newFIle = await Promise.all(
      changedColumns.map((newCol) => {
        const oldCol = board.column.find(
          (old) => old._id.toString() === newCol.id,
        );

        return Task.updateMany(
          { board: board._id, status: oldCol.status },
          { status: newCol.status.toLowerCase().trim() },
        );
      }),
    );
  }

  const filteredObj = BodyChecker(req.body, 'title', 'column');

  if (req.body.title) board.title = filteredObj.title;
  if (req.body.column) board.column = filteredObj.column;

  await board.save();

  await connection.del(`boards:${req.user._id}`);
  await connection.del(`board:${req.user._id}:${req.params.slug}`);

  res.status(200).json({
    status: 'success',
    message: 'Board Edited Successfully',
    data: {
      board,
    },
  });
});

exports.addNewColumn = CatchAsync(async (req, res, next) => {
  const board = await Board.findOne({
    slug: req.params.slug,
    owner: req.user._id,
  });

  if (!board) return next(new ErrorClass('No Board found .. Try again', 400));

  const statues = board.column.map((el) => el.status.toLowerCase().trim());
  const colors = board.column.map((el) => el.color.toLowerCase().trim());

  const uniqueStatus = req.body.column[0].status.toLowerCase().trim();
  const uniqueColors = req.body.column[0].color.toLowerCase().trim();

  if (statues.includes(uniqueStatus) || colors.includes(uniqueColors))
    return next(
      new ErrorClass(
        'Duplicate field names please make changes and proceed',
        401,
      ),
    );

  const body = { status: uniqueStatus, color: uniqueColors };
  board.column.push(body);
  await board.save();
  await connection.del(`boards:${req.user._id}`);
  await connection.del(`board:${req.user._id}:${req.params.slug}`);
  res.status(200).json({
    status: 'success',
    message: 'Status Added to the board',
    board,
  });
});

exports.deleteBoard = CatchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const board = await Board.findOneAndDelete({
    slug: slug,
    owner: req.user._id,
  });

  if (!board) return next(new ErrorClass('Board Not Found', 404));

  await connection.del(`boards:${req.user._id}`);
  await connection.del(`board:${req.user._id}:${req.params.slug}`);

  res.status(200).json({
    status: 'Success',
    message: 'Board deleted successfully',
  });
});
