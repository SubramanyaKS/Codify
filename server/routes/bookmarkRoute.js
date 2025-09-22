import express from "express";
import * as controllers from "../controllers/bookmarkController.js";
import verifyUser from "../middlewares/authMiddleware.js";  // your auth middleware

const bookmarkRouter = express.Router();

bookmarkRouter.route("/").get(verifyUser, controllers.getBookmarks);
bookmarkRouter.route("/add").post(verifyUser, controllers.addBookmark);
bookmarkRouter.route("/remove").post(verifyUser, controllers.removeBookmark);

export default bookmarkRouter;
