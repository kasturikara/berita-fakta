import { supabase } from "./../config/supabase.js";

// get all published articles
export const getAllArticles = async (req, res) => {
  try {
    const { category, tag, author, search, page = 1, limit = 10 } = req.query;

    // query to get count
    let countQuery = supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    // count
    const { count, error: countError } = await countQuery;
    if (countError) throw countError;

    // apply same filters to count query
    if (category) countQuery = countQuery.eq("category_id", category);
    if (tag) {
      countQuery = countQuery.contains("tags", [{ id: parseInt(tag) }]);
    }
    if (author) countQuery = countQuery.eq("author_id", author);
    if (search) countQuery = countQuery.ilike("title", `%${search}%`);

    let dataQuery = supabase
      .from("articles")
      .select(
        `
        id,
        title,
        content,
        cover_image_url,
        status,
        published_at,
        created_at,
        updated_at,
        categories(id, name),
        profiles(id, username, full_name, avatar_url),
        tags(id, name)`
      )
      .eq("status", "published")
      .order("published_at", { ascending: false });

    // filter
    if (category) dataQuery = dataQuery.eq("categories.id", category);
    if (tag) dataQuery = dataQuery.eq("tags.id", tag);
    if (author) dataQuery = dataQuery.eq("profiles.id", author);
    if (search) dataQuery = dataQuery.ilike("title", `%${search}%`);

    // pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    dataQuery = dataQuery.range(from, to);

    const { data, error } = await dataQuery;

    if (error) throw error;

    res.json({
      data,
      success: true,
      meta: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// get article by id with full details
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: article, error: articleError } = await supabase
      .from("articles")
      .select(
        `
        *,
        categories(*),
        profiles(*),
        tags(*)
      `
      )
      .eq("id", id)
      .single();

    if (articleError) throw articleError;

    // Get related articles (same category)
    const { data: relatedArticles, error: relatedError } = await supabase
      .from("articles")
      .select("id, title, cover_image_url, published_at")
      .eq("category_id", article.category_id)
      .neq("id", id)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3);

    if (relatedError) throw relatedError;

    res.json({
      ...article,
      related_articles: relatedArticles,
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: "Article not found",
    });
  }
};

// create new article (protected)
export const createArticle = async (req, res) => {
  try {
    const { title, content, category_id, tags, cover_image_url, status } =
      req.body;
    const author_id = req.user.id;

    // validate status
    const validStatuses = ["draft", "published"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    // create article
    const { data: article, error: articleError } = await supabase
      .from("articles")
      .insert([
        {
          title,
          content,
          category_id: category_id || null,
          author_id,
          cover_image_url: cover_image_url || null,
          status,
          published_at: status === "published" ? new Date() : null,
        },
      ])
      .select()
      .single();

    if (articleError) throw articleError;

    // add tags if provided
    if (tags && tags.length > 0) {
      const tagRelations = tags.map((tag_id) => ({
        article_id: article.id,
        tag_id,
      }));

      const { error: tagError } = await supabase
        .from("article_tags")
        .insert(tagRelations);

      if (tagError) throw tagError;
    }

    // get full article data with relations
    const { data: fullArticle, error: fetchError } = await supabase
      .from("articles")
      .select(
        `
        *,
        categories(*),
        profiles(*),
        tags(*)
      `
      )
      .eq("id", article.id)
      .single();

    if (fetchError) throw fetchError;

    res.status(201).json({
      ...fullArticle,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// update article (protected)
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category_id, tags, cover_image_url, status } =
      req.body;
    const user_id = req.user.id;

    // check if article exists and belongs to user (or user is admin)
    const { data: existingArticle, error: fetchError } = await supabase
      .from("articles")
      .select("author_id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (existingArticle.author_id !== user_id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this article",
      });
    }

    // validate status
    const validStatuses = ["draft", "published", "archived"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    // prepare update data
    const updateData = {
      title,
      content,
      category_id: category_id || null,
      cover_image_url,
      status,
      updated_at: new Date(),
    };

    // set published_at if status changed to published
    if (status === "published") {
      updateData.published_at = new Date();
    }

    // update article
    const { data: article, error: updateError } = await supabase
      .from("articles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    // update tags if provided
    if (tags) {
      // delete existing tags
      await supabase.from("article_tags").delete().eq("article_id", id);

      // add new tags if any
      if (tags.length > 0) {
        const tagRelations = tags.map((tag_id) => ({
          article_id: id,
          tag_id,
        }));

        await supabase.from("article_tags").insert(tagRelations);
      }
    }

    // get full updated article
    const { data: fullArticle, error: fetchError2 } = await supabase
      .from("articles")
      .select(
        `
        *,
        categories(*),
        profiles(*),
        tags(*)
      `
      )
      .eq("id", id)
      .single();

    if (fetchError2) throw fetchError2;

    res.json({
      ...fullArticle,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// delete article (protected)
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // check if article exists and belongs to user (or user is admin)
    const { data: existingArticle, error: fetchError } = await supabase
      .from("articles")
      .select("author_id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (existingArticle.author_id !== user_id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this article",
      });
    }

    // delete article
    const { error: deleteError } = await supabase
      .from("articles")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    res.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// get articles by author
export const getArticlesByAuthor = async (req, res) => {
  try {
    const { author_id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        cover_image_url,
        published_at,
        categories(id, name)
        `,
        { count: "exact" }
      )
      .eq("author_id", author_id)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    res.json({
      data,
      success: true,
      meta: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
