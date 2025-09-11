import User from "../models/userSchema.js";
import Feedback from "../models/feedbackSchema.js";
import Course from "../models/courseSchema.js";
import bcryptjs from "bcryptjs";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmail } from "../utils/sendEmail.js";
import { otpEmailTemplate } from "../utils/OTPemailTemplates.js";
import { feedbackEmailTemplate } from "../utils/feedbackEmailTemplate.js";
const otpStore = {}; // temporary in-memory store
import passport from "passport";

const homePage = async (req, res) => {
  try {
    res.status(202).send("home page");
  } catch (error) {
    res.status(404).send({error});
  }
};
const regPage = async (req, res) => {
  try {
    const { email, password, phone, username } = req.body;
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).send({ message: "Email already exist" });
    }
    const userCreated = await User.create({ email, password, phone, username });
    res.status(201).json({
      message: userCreated,
      userId: userCreated._id.toString(),
      token: await userCreated.generateToken(),
    });
  } catch (error) {
    res.status(400).send({error});
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).send({ message: "invalid Credentions" });
    }
    // const isCorrectPassword =await bcryptjs.compare(password,userExist.password);
    const isCorrectPassword = await userExist.comparePassword(password);
    if (isCorrectPassword) {
      res.status(201).send({
        message: "logged In Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      return res.status(400).send({ message: "invalid Credentions" });
    }
  } catch (error) {
    res.status(500).send({ message: "internal server error" });
  }
};
const contact = async (req, res) => {
  try {
    const { email, message, username } = req.body;
    // const userExist = await User.findOne({ email: email });
    // if (!userExist) {
    //   return res.status(400).send({ message: "user not found Sign Up now" });
    // }
    // Save feedback to DB
    const newMessage = await Feedback.create({ email, username, message });
    // Build email content
    const { subject, html } = feedbackEmailTemplate(username, message);
    // Send email
    await sendEmail(
      email,            
      subject,          
      html,             
      `Hi ${username}, thanks for your feedback: ${message}` // text fallback
    );
    //frontend response
    res.status(201).json({"hello ":"hello from contact , message sent",
    message: newMessage.message,
      userId: newMessage._id.toString(),
      token: await userCreated.generateToken(),
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
const user = async (req,res)=>{
  try {
    const user = req.user;
    return res.status(200).json({user});
  } catch (error) {
    res.status(400).json({ message:error });
  }
}
const courses = async(req,res)=>{
  try {
    const response = await Course.find({});
    if(!response){
      return res.status(400).send(`fetching courses error : ${error}`);
    }
    res.status(200).json( {data:response});
  } catch (error) {
    res.status(400).send(`fetching courses error :  ${error}`);
  }
}
const defcontroller = async(req,res)=>{
  try {
    res.status(200).send("hello from def controller");
  } catch (error) {
    res.status(400).send(`fetching courses error :  ${error}`);
  }
}
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = generateOTP();
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
    const { subject, html } = otpEmailTemplate(otp);

    await sendEmail(email, subject, html);
    return res.status(200).json({ message: "OTP sent successfully" });
    
  } catch (error) {
    console.error("Error in sendOTP:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};


// Verify OTP Controller
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const record = otpStore[email];
    if (!record) return res.status(400).json({ message: "OTP not found. Please request again." });
    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }
    if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    delete otpStore[email];
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
};
// Check if email exists in DB before forgot password reset
const forgotPasswordCheck = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ message: "Email does not exist" });
    }
    return res.status(200).json({ message: "Email exists" });
  } catch (error) {
    console.error("Error in forgotPasswordCheck:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: "User not found" });

    user.password = newPassword; // plain text
    await user.save(); // hash will happen here
    
    res.status(200).send({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

//Google Login 
const googleLogin = async (req, res, next) => {
  try {
    passport.authenticate("google-login", (err, data, info) => {
      if (err) return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
      if (!data) {
        const errorMsg = encodeURIComponent(info?.message || "Authentication failed");
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=${errorMsg}`);
      }
      // Upon Successful Login, Redirect URL with token to frontend
      const { token } = data;
      res.redirect(`${process.env.FRONTEND_URL}/oauth/callback?token=${token}`); 
    })(req, res, next);
  } catch (error) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};
//Google Signup
const googleSignup = async (req, res, next) => {
  try {
    passport.authenticate("google-signup",async (err, data, info) => {
      if (err) return res.redirect(`${process.env.FRONTEND_URL}/signup?error=server_error`);
      if (!data) {
        const errorMsg = encodeURIComponent(info?.message || "Authentication failed");
        return res.redirect(`${process.env.FRONTEND_URL}/signup?error=${errorMsg}`); 
      }
      // Send email reminder to set password
      try {
        const userEmail = data.user.email; // Get user email from data
        const forgotPasswordLink = `${process.env.FRONTEND_URL}/forgot-password`;

        await sendEmail(
          userEmail,
          "Welcome to Codify - Set Your Password",
          `Hi ${data.user.username || "there"},\n\n
          Welcome to Codify! 🎉\n\n
          Since you signed up using Google, you don’t have a password yet.  
          You can set one anytime by clicking the link below:\n\n
          ${forgotPasswordLink}\n\n
          This will let you log in directly using your email & password as well as Google.\n\n
          Cheers,  
          Codify Team`
        );
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
      // Upon Successful Signup, Redirect URL with token to frontend
      const { token } = data;
      res.redirect(`${process.env.FRONTEND_URL}/oauth/callback?token=${token}`);
    })(req, res, next);
  } catch (error) {
    return res.redirect(`${process.env.FRONTEND_URL}/signup?error=server_error`);
  }
};

export { homePage, regPage, login, contact , user ,courses ,defcontroller,sendOTP,verifyOTP ,resetPassword,forgotPasswordCheck , googleLogin, googleSignup };
