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
// Mixed route - handles both public and authenticated access
router.get(
  "/author/:id",
  async (req, res, next) => {
    // Check if this is a request for the user's own articles
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // No auth token, treat as public request (only published articles)
      next();
      return;
    }

    try {
      // Apply authentication for user's own articles
      authenticate(req, res, () => {
        // Authentication worked, continue to the handler
        next();
      });
    } catch (error) {
      // Authentication failed, default to public access
      next();
    }
  },
  getArticlesByAuthor
);

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
