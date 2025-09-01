import express from "express";
import courses, { enrollCourse, ytCourses } from "../controllers/coursesController.js";
import  authMiddleware  from "../middlewares/authMiddleware.js";

const coursesRouter = express.Router();

// Get all courses
coursesRouter.route("/").get(courses);
coursesRouter.route("/yt").get(ytCourses);

// Enroll in a course (protected route)
coursesRouter.route("/enroll").post(authMiddleware, enrollCourse);

export default coursesRouter;