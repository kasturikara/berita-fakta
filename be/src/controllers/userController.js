import { supabase } from "../config/supabase.js";

export const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "user");
    if (error) throw error;
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    // User info is already attached to req.user by the authenticate middleware
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.user.id)
      .single();

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

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { username, full_name, avatar_url, bio } = req.body;

    // Validate required fields
    if (!username || !full_name) {
      return res.status(400).json({
        success: false,
        message: "Username and full name are required",
      });
    }

    // Check if username is already taken (by another user)
    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", req.user.id);

    if (checkError) throw checkError;

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
      });
    }

    // Update the profile
    const { data, error } = await supabase
      .from("profiles")
      .update({
        username,
        full_name,
        avatar_url,
        bio,
        updated_at: new Date(),
      })
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate required fields
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    // Get user with password
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("password")
      .eq("id", req.user.id)
      .single();

    if (userError) throw userError;

    // Compare old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        updated_at: new Date(),
      })
      .eq("id", req.user.id);

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
