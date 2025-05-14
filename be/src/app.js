import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { supabase } from "./config/supabase.js";
import authRouter from "./routes/authRoutes.js";

const app = express();

// middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// test supabase
app.get("/test-supa", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(1);
    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// routes
app.use("/api/auth", authRouter);

// error handling
app.use((err, req, res, nect) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Something went wrong!" });
});

// start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
