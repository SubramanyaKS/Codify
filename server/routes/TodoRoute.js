import express from "express";
import { getTodos, addTodo, toggleTodo, deleteTodo } from "../controllers/todoController.js";
 import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getTodo", authMiddleware, getTodos);
router.post("/setTodo", authMiddleware, addTodo);
router.patch("/:id", authMiddleware, toggleTodo);
router.delete("/:id", authMiddleware, deleteTodo);

export default router;
