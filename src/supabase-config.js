// Konfigurasi Kredensial Supabase Anda
// Salin URL dan Anon Key dari dashboard proyek Supabase Anda.
window.SUPABASE_URL = "URL_SUPABASE_ANDA";
window.SUPABASE_ANON_KEY = "ANON_KEY_SUPABASE_ANDA";

// Cek apakah Supabase sudah dikonfigurasi secara valid
window.isSupabaseConfigured = function() {
    return window.SUPABASE_URL && 
           window.SUPABASE_URL !== "" && 
           window.SUPABASE_URL !== "URL_SUPABASE_ANDA" && 
           window.SUPABASE_ANON_KEY && 
           window.SUPABASE_ANON_KEY !== "" && 
           window.SUPABASE_ANON_KEY !== "ANON_KEY_SUPABASE_ANDA";
};

// Inisialisasi Supabase Client jika dikonfigurasi
window.supabaseClient = null;
if (window.isSupabaseConfigured()) {
    try {
        window.supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    } catch (e) {
        console.error("Gagal menginisialisasi Supabase Client:", e);
    }
}
