import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";

export function configurePassport() {
  // Google Login
  passport.use(
    "google-login",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //callbackURL: "/api/v1/auth/google/login/callback",
        callbackURL: process.env.GOOGLE_LOGIN_CALLBACK_URL,
        prompt: "select_account",
      },
      async (_, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(null, false, { message: "Email not found" });

          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            // Link existing account by email if exists (For users who signed up manually)
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
              return done(null, false, { message: "Account not found. Please sign up first." });
            }
            existingUser.googleId = profile.id;
            existingUser.isOAuth = true;
            existingUser.avatar = profile.photos?.[0]?.value || "";
            await existingUser.save();
            user = existingUser;
          }

          const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "30d",
          });

          return done(null, { user, token });
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // Google Signup 
  passport.use(
    "google-signup",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //callbackURL: "/api/v1/auth/google/signup/callback",
        callbackURL: process.env.GOOGLE_SIGNUP_CALLBACK_URL,
        prompt: "select_account",
      },
      async (_, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(null, false, { message: "Email not found" });

          let existingUser = await User.findOne({ email });
          if (existingUser) {
            return done(null, false, { message: "Email already registered. Please login." });
          }

          // Create unique username
          let username = profile.displayName?.replace(/\s+/g, "_") || `user_${Date.now()}`;
          const usernameExists = await User.findOne({ username });
          if (usernameExists) {
            username = `${username}_${profile.id.substring(0, 5)}`;
          }

          const user = await User.create({
            googleId: profile.id,
            username,
            email,
            avatar: profile.photos?.[0]?.value || "",
            isOAuth: true,
          });

          const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "30d",
          });

          return done(null, { user, token });
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((data, done) => done(null, data));
  passport.deserializeUser((data, done) => done(null, data));
}
