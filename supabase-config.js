const SUPABASE_URL = "ضع رابط مشروع Supabase";
const SUPABASE_KEY = "ضع anon public key";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
