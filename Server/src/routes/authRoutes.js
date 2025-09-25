import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/authControllers.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/updateProfile", verifyToken, updateProfile);
router.get("/check", verifyToken, checkAuth);

export default router;
