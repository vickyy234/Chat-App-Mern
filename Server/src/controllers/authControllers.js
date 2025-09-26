import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import cloudinary from "../cloudinary/cloudinary.js";
import generateToken from "../middlewares/generateToken.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);
      return res
        .status(201)
        .json({ message: "Account created successfully", newUser });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Signup error:", error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Login error:", error);
  }
};

export const logout = (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.PRODUCTION === "true",
      sameSite: "none",
    })
    .status(200)
    .json({ message: "Logout successful" });
};

export const updateProfile = async (req, res) => {
  try {
    const { base64Image } = req.body;
    const userId = req.user._id;

    if (!base64Image) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profilePic) {
      const publicId = user.profilePic.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId); // Delete old image from Cloudinary
    }

    const uploadResponse = await cloudinary.uploader.upload(base64Image);
    user.profilePic = uploadResponse.secure_url;
    const updatedUser = await user.save();

    return res
      .status(200)
      .json({ message: "Profile picture updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Update profile error:", error);
  }
};

export const checkAuth = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized! Login required" });
  }

  return res
    .status(200)
    .json({ message: "User authenticated successfully", user });
};
