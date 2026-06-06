# Laporan Analisis Desain Antarmuka (UI/UX) Admin - SIAS (Sistem Informasi Sekolah)

## 1. Pendahuluan
Dokumen ini berisi analisis mendalam mengenai desain antarmuka pengguna (UI) dan pengalaman pengguna (UX) pada modul Admin Sistem Informasi Sekolah (SIAS). Analisis ini mencakup elemen visual, tata letak, kegunaan, dan konsistensi desain.

## 2. Konsep Desain Utama
Sistem Admin SIAS mengadopsi gaya **Modern Dark Mode** dengan sentuhan **Glassmorphism**. Konsep ini memberikan kesan profesional, futuristik, dan fokus pada data.

### 2.1 Palet Warna
| Elemen | Kode Warna (Hex) | Deskripsi |
| :--- | :--- | :--- |
| **Background Utama** | `#0B0F1A` / `#0F1117` | Latar belakang gelap yang nyaman di mata. |
| **Card / Sidebar** | `#111827` / `#1A1D2E` | Gradasi gelap yang lebih terang untuk memisahkan konten. |
| **Aksen Utama** | `#6366F1` (Indigo) | Digunakan untuk tombol primer, ikon aktif, dan fokus. |
| **Aksen Sukses** | `#10B981` (Emerald) | Digunakan untuk status aktif dan tombol tambah/sinkron. |
| **Teks Utama** | `#F3F4F6` (Putih Terang) | Kontras tinggi untuk keterbacaan maksimal. |
| **Teks Sekunder** | `#9CA3AF` (Abu-abu Dim) | Digunakan untuk label, placeholder, dan sub-judul. |

### 2.2 Tipografi
*   **Font Family**: `Poppins`, sans-serif.
*   **Karakteristik**: Font sans-serif yang modern dan memiliki keterbacaan yang sangat baik pada layar digital. Penggunaan bobot (weight) yang bervariasi (300 hingga 700) membantu menciptakan hierarki informasi yang jelas.

---

## 3. Analisis Komponen UI

### 3.1 Sidebar (Navigasi)
*   **Lebar**: 260px - 280px.
*   **Interaksi**: Memiliki efek hover dengan latar belakang semi-transparan (`rgba(108, 99, 255, 0.1)`) dan perubahan warna teks menjadi ungu indigo.
*   **Responsivitas**: Menggunakan transformasi `translateX(-100%)` pada layar kecil dengan tombol toggle untuk membuka/tutup.

### 3.2 Header & Pencarian
*   **Layout**: Menggunakan Flexbox untuk memisahkan judul halaman dan area aksi (tombol/pencarian).
*   **Search Bar**: Memiliki desain minimalis dengan border halus dan efek fokus yang mengubah warna border menjadi warna aksen.

### 3.3 Tabel Data (Manajemen)
*   **Desain Modern**: Tidak menggunakan garis grid tradisional. Menggunakan `border-spacing` untuk memberikan jarak antar baris, sehingga setiap baris tampak seperti "kartu" (row-card).
*   **Visual**: Baris memiliki radius sudut (border-radius) yang lembut (16px) dan efek hover untuk memandu mata pengguna.

### 3.4 Modal & Form
*   **Efek Glassmorphism**: Menggunakan `backdrop-filter: blur(8px)` pada overlay modal untuk memberikan fokus penuh pada jendela pop-up.
*   **Form Grid**: Menggunakan tata letak grid 2 kolom untuk efisiensi ruang pada input data yang banyak.
*   **Radius**: Sudut modal yang sangat bulat (32px) memberikan kesan modern dan ramah pengguna.

---

## 4. Evaluasi UX (Pengalaman Pengguna)

### 4.1 Kelebihan (Strengths)
1.  **Visual Hirarki**: Penggunaan ukuran font dan warna yang tepat memudahkan admin membedakan antara aksi utama (Primary) dan aksi pendukung (Secondary).
2.  **Feedback Visual**: Transisi halus (0.3s cubic-bezier) pada tombol dan menu memberikan pengalaman yang responsif.
3.  **Modernitas**: Desain tidak terlihat kaku atau ketinggalan zaman, meningkatkan kebanggaan pengguna dalam menggunakan sistem.

### 4.2 Area Pengembangan (Improvements)
1.  **Konsistensi Warna**: Terdapat sedikit perbedaan variabel warna primer antara `style.css` (`#2563eb` - Blue) dan `siswa.html` (`#6366f1` - Indigo). Disarankan untuk menyatukan variabel ini dalam satu file CSS global.
2.  **Aksesibilitas**: Pastikan kontras teks abu-abu (`#9CA3AF`) pada latar belakang gelap memenuhi standar WCAG untuk pengguna dengan penglihatan terbatas.
3.  **Empty State**: Perlu penambahan ilustrasi visual atau pesan yang lebih menarik ketika data tabel kosong.

---

## 5. Kesimpulan
Secara keseluruhan, tampilan desain Admin SIAS sangat solid dan profesional. Penggunaan gaya *Dark Theme* dengan *Glassmorphism* sangat tepat untuk aplikasi berbasis data seperti Sistem Informasi Sekolah, karena dapat meminimalkan kelelahan mata admin yang sering bekerja dalam waktu lama di depan layar.

---
**Dibuat oleh**: Gemini CLI Agent
**Tanggal**: 6 Juni 2026
