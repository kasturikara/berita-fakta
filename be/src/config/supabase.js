import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supaUrl = process.env.SUPABASE_URL;
const supaKey = process.env.SUPABASE_ANON_KEY;

if (!supaUrl || !supaKey)
  throw new Error("Supabase URL or Key is not defined in .env file");

export const supabase = createClient(supaUrl, supaKey);
