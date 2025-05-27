import { supabase } from "../config/supabase.js";

// get all categories
export const getAllCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }
};

// create a new category (admin only)
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name, description }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// update an existing category (admin only)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const { data, error } = await supabase
      .from("categories")
      .update({ name, description, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// delete a category (admin only)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category is being used in articles
    const { data: articles, error: checkError } = await supabase
      .from("articles")
      .select("id")
      .eq("category_id", id);

    if (checkError) throw checkError;

    // Don't delete if category is being used
    if (articles && articles.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category that is used in articles",
      });
    }

    // Delete the category
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// get articles by category ID with pagination
export const getArticlesByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Check if category exists
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (categoryError) throw categoryError;

    // Get articles
    const {
      data: articles,
      count,
      error: articlesError,
    } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        cover_image_url,
        published_at,
        profiles(id, username, full_name, avatar_url),
        categories(id, name)
      `,
        { count: "exact" }
      )
      .eq("category_id", id)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range(from, to);

    if (articlesError) throw articlesError;

    res.json({
      success: true,
      data: articles,
      category: category,
      meta: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
