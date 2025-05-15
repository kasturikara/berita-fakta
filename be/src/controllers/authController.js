import { supabase } from "../config/supabase.js";
import jwt from "jsonwebtoken";

// helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || "user",
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// register user
export const register = async (req, res) => {
  try {
    const { email, password, username, full_name } = req.body;

    // register to auth supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // create user profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: authData.user.id,
          username,
          full_name,
          role: "user", // default role
        },
      ])
      .select();

    if (profileError) throw profileError;

    // generate JWT token
    const token = generateToken({
      id: authData.user.id,
      email: authData.user.email,
      role: "user",
    });

    res.status(201).json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username,
        full_name,
        role: "user",
      },
      token,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // login to auth supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
    if (authError) throw authError;

    // get user profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();
    if (profileError) throw profileError;

    // generate JWT token
    const token = generateToken({
      id: authData.user.id,
      email: authData.user.email,
      role: profileData.role,
    });

    res.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username: profileData.username,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        role: profileData.role,
      },
      token,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// get currrent user
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    // get user profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profileError) throw profileError;

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: profileData.username,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        role: profileData.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// logout user
export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
