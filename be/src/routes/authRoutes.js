import express from "express";
import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMidlleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

export default router;
