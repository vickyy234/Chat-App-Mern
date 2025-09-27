import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized! Login required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized! Invalid token " });
    }

    const userId = decoded.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized! User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyToken;
