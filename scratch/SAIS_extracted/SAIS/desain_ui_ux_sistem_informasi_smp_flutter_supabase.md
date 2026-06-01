# Desain UI/UX Menu Login - Sistem Informasi SMP (SAIS)

Dokumen ini merinci rencana desain dan implementasi menu login yang menarik, modern, dan fungsional untuk Sistem Informasi Sekolah Menengah Pertama (SMP) menggunakan **Flutter** dan **Supabase**.

## 🎨 Konsep Visual (Mockup)

Berikut adalah konsep desain awal untuk layar login aplikasi mobile:

![Mockup Login SAIS](C:\Users\Lenovo\.gemini\antigravity\brain\d2274d69-2069-41d5-8091-14aa58bac81d\flutter_smp_login_mockup_1778745142546.png)

## 🚀 Prinsip UI/UX

1.  **Professional & Trustworthy**: Menggunakan palet warna biru sekolah (Primary Blue) dan putih untuk memberikan kesan formal, bersih, dan terpercaya.
2.  **Simplicity**: Tata letak yang bersih tanpa gangguan visual yang tidak perlu. Fokus utama adalah pada form input.
3.  **Feedback Interaktif**:
    *   **Loading State**: Animasi halus saat melakukan proses login.
    *   **Error Messaging**: Pesan kesalahan yang jelas (misal: "Email tidak ditemukan" atau "Password salah") menggunakan SnackBar atau teks merah di bawah input.
4.  **Accessibility**: Ukuran font yang mudah dibaca dan area klik tombol yang luas (minimal 48dp).

## 🛠️ Fitur Teknis (Flutter + Supabase)

### 1. Autentikasi Supabase
*   Menggunakan `supabase_flutter` package.
*   Fungsi `supabase.auth.signInWithPassword()` untuk proses masuk.
*   Penyimpanan session otomatis.

### 2. Komponen UI Flutter
*   **TextFormField**: Dengan `InputDecoration` custom (rounded corners, subtle shadows).
*   **Password Toggle**: Ikon mata untuk menampilkan/menyembunyikan password.
*   **Validation**: Validasi client-side untuk format email dan panjang password minimal.
*   **Animations**: Menggunakan `AnimatedContainer` untuk transisi antar state (misal saat tombol ditekan).

## 📋 Rencana Implementasi

1.  **Persiapan Proyek**: Inisialisasi Flutter dan konfigurasi Supabase Client.
2.  **Pembuatan Asset**: Menyiapkan logo sekolah dan font (misal: Google Fonts 'Poppins' atau 'Inter').
3.  **Pengembangan UI**:
    *   Membuat `LoginScreen` widget.
    *   Styling form input dan tombol.
4.  **Integrasi Logic**: Menghubungkan form dengan Supabase Auth API.
5.  **Pengujian UX**: Memastikan transisi layar lancar dan penanganan error berfungsi dengan baik.

---

**Tip**: Kita bisa menambahkan fitur **Biometric Login** (Fingerprint/FaceID) setelah login pertama berhasil untuk meningkatkan kemudahan akses pengguna di masa depan.

**Penting**: Apakah Anda setuju dengan palet warna dan tata letak pada mockup di atas? Jika ya, saya akan mulai menyiapkan struktur kodenya.
