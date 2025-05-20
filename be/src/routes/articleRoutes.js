import express from "express";
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByAuthor,
} from "../controllers/articleController.js";
import { authenticate, authorize } from "../middlewares/authMidlleware.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// public routes
router.get("/", getAllArticles);
router.get("/:id", getArticleById);
router.get("/author/:id", getArticlesByAuthor);

// protected routes (requires authentication)
router.use(authenticate);

// only user and admin can create, update, and delete articles
router.post("/", authorize(["user", "admin"]), createArticle);
router.put(
  "/:id",
  async (req, res, next) => {
    // custom middleware to check ownership
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from("articles")
        .select("author_id")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data.author_id !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Not authorized to update this article",
        });
      }
      next();
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  },
  updateArticle
);
router.delete(
  "/:id",
  async (req, res, next) => {
    // custom middleware to check ownership
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from("articles")
        .select("author_id")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data.author_id !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Not authorized to delete this article",
        });
      }
      next();
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  },
  deleteArticle
);

export default router;
