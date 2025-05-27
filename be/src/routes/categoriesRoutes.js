import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getArticlesByCategory,
} from "../controllers/categoriesController.js";
import { authenticate, authorize } from "../middlewares/authMidlleware.js";

const router = express.Router();

// public routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/:id/articles", getArticlesByCategory);

// admin routes
router.use(authenticate); // Apply authentication middleware for admin routes
router.use(authorize(["admin"]));
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
