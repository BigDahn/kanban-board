const express = require("express");

const { protect } = require("../controller/authController");

const {
  createBoard,
  editBoard,
  getAllBoard,
  addNewColumn,
  getBoard,
  deleteBoard,
} = require("../controller/boardController");
const {
  addNewTask,
  editTask,
  deleteTask,
} = require("../controller/taskController");

const router = express.Router();

router.use(protect);

router.get("/getAllBoards", getAllBoard);
router.get("/getBoard/:slug", getBoard);

router.post("/AddNewColumn/:slug", addNewColumn);
router.post("/AddNewTask/:slug", addNewTask);
router.post("/createBoard", createBoard);

router.patch("/editBoard/:slug", editBoard);
router.patch("/:slug/editTask/:taskId", editTask);

router.delete("/:slug/deleteTask/:taskId", deleteTask);
router.delete("/deleteCurrentBoard/:slug", deleteBoard);
module.exports = router;
