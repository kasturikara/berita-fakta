import express from "express";
import { supabase } from "../config/supabase.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) throw profileError;

    // generate JWT token
    const token = jwt.sign(
      {
        userId: data.user.id,
        role: profile.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          role: profile.role,
          username: profile.username,
          fullname: profile.full_name,
          avatar_url: profile.avatar_url,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
