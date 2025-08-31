import  express  from "express";
import * as controllers from "../controllers//authController.js"
import validate from "../middlewares/validateMiddleware.js";
import {signUpSchema,loginSchema,contactSchema} from "../validations/authValidation.js";
import passport from "passport";

const authRouter = express.Router();
authRouter.route("/").get(controllers.homePage)
authRouter.route("/register").post(validate(signUpSchema),controllers.regPage);
authRouter.route("/login").post(validate(loginSchema),controllers.login);
authRouter.route("/send-otp").post(controllers.sendOTP);
authRouter.route("/verify-otp").post(controllers.verifyOTP);
authRouter.route("/reset-password").post(controllers.resetPassword);
authRouter.route("/forgot-password/check").post(controllers.forgotPasswordCheck);
// Google OAuth Login
authRouter.get(
  "/google/login",
  passport.authenticate("google-login", { scope: ["profile", "email"], prompt: "select_account" })
);
authRouter.get("/google/login/callback", controllers.googleLogin);
// Google OAuth Signup
authRouter.get(
  "/google/signup",
  passport.authenticate("google-signup", { scope: ["profile", "email"], prompt: "select_account" })
);
authRouter.get("/google/signup/callback", controllers.googleSignup);


export default authRouter;