import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://nbmzlsmlmzffvzffquuf.supabase.co";
const supabaseAnonKey = "sb_publishable_ALvvrJD_ymKOAGfB9ylyVg_F3D4FnE-";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
