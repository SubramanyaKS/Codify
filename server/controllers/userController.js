import User from "../models/userSchema.js";
import Course from "../models/courseSchema.js";
import UserActivity from "../models/userActivitySchema.js";
import mongoose from "mongoose";
export const toggleWatchlist = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id; // set by authMiddleware
  // const userId = req.params.userId;
  // console.log(userId);
  try {
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid courseId" });
    }
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ error: "User or Course not found" });
    }

    // Check if course is already in the watchlist
    const exists = user.watchlist.some((id) => id.toString() === courseId);
    if (!exists) {
      // If course is not in the watchlist, add it
      user.watchlist.push(courseId);
      await user.save();

      // Create activity for adding to watchlist
      const activity = new UserActivity({
        userId,
        courseId,
        activityType: 'added_to_watchlist'
      });
      await activity.save();

      return res.status(200).json({ message: "Course added to watchlist" });
    } else {
      // If course is in the watchlist, remove it
      user.watchlist = user.watchlist.filter((id) => id.toString() !== courseId);
      await user.save();

      // Create activity for removing from watchlist
      const activity = new UserActivity({
        userId,
        courseId,
        activityType: 'removed_from_watchlist'
      });
      await activity.save();

      return res.status(200).json({ message: "Course removed from watchlist" });
    }
  } catch (error) {
    console.error("toggleWatchlist error", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get the user's watchlist
export const getWatchlist = async (req, res) => {
  // const userId = req.params.userId;
  const userId = req.user.id; // Assuming you're using authMiddleware to get the user

  try {
    const user = await User.findById(userId).populate("watchlist");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ watchlist: user.watchlist });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
export const user = async (req, res) => {
  try {
    const user = req.user;
    // const list =await user.populate("watchlist")  ;
    // console.log(list,"user.....")
    return res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// Update logged-in user's profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Whitelist of fields that can be updated
    const {
      username,
      email,
      firstName,
      lastName,
      bio,
      profileImage,
      phone,
    } = req.body || {};

    const update = {};
    if (typeof username === "string") update.username = username;
    if (typeof email === "string") update.email = email;
    if (typeof firstName === "string") update.firstName = firstName;
    if (typeof lastName === "string") update.lastName = lastName;
    if (typeof bio === "string") update.bio = bio;
    if (typeof profileImage === "string") update.profileImage = profileImage;
    if (typeof phone === "string") update.phone = phone;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Profile updated", user: updated });
  } catch (error) {
    console.error("updateProfile error", error);
    return res.status(500).json({ message: "Server error" });
  }
};