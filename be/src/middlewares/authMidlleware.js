import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

export const authenticate = async (req, res, next) => {
  try {
    // get token from headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // verify user exists
    const { data: user, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Not authorized",
    });
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    next();
  };
};
