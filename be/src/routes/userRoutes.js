import express from "express";
import {
  getUserById,
  getUsers,
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMidlleware.js";

const router = express.Router();

// All routes need authentication
router.use(authenticate);

router.get("/", getUsers);
router.get("/:id", getUserById);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.post("/change-password", changePassword);

export default router;
