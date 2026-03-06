import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fpjuoccvshsgmtidksga.supabase.co";
const supabaseKey = "sb_publishable_TcRwx6-ejIWzQXt2L3K4MA_3vfc4VVk";

export const supabase = createClient(supabaseUrl, supabaseKey);
