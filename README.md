# SAIS - Sistem Informasi Sekolah (v2.0.0)

[![Framework: Vanilla JS](https://img.shields.io/badge/Framework-Vanilla_JS-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Database: Neon PostgreSQL](https://img.shields.io/badge/Database-Neon_PostgreSQL-00E599?logo=postgresql&logoColor=white)](https://neon.tech)
[![Platform: Vercel](https://img.shields.io/badge/Platform-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**SAIS (Sistem Informasi Sekolah)** adalah aplikasi web manajemen sekolah modern yang dirancang khusus untuk tingkat SMP. Aplikasi ini menggabungkan kecepatan frontend statis dengan fleksibilitas database PostgreSQL cloud-native.

## ✨ Fitur Utama

- 👨‍🎓 **Manajemen Siswa:** Data diri, kelas, dan status keaktifan.
- 👩‍🏫 **Manajemen Guru:** Data pengajar dan mata pelajaran.
- 📚 **Akademik:** Pengaturan jadwal pelajaran, input nilai, dan kenaikan kelas.
- 📢 **Pusat Informasi:** Pengumuman sekolah real-time.
- 🔐 **Multi-Role Login:** Akses khusus untuk Admin, Guru, dan Siswa.
- 📱 **PWA Ready:** Dapat diinstal di HP/Desktop seperti aplikasi native.
- ☁️ **Cloud Database:** Integrasi mulus dengan Neon PostgreSQL dan Vercel Serverless.

## 🛠️ Stack Teknologi

- **Frontend:** HTML5, CSS3 (Modern Vanilla CSS), Vanilla JavaScript.
- **Backend:** Vercel Serverless Functions (Node.js).
- **Database:** Neon PostgreSQL (Cloud-native).
- **Deployment:** Vercel.

## 🚀 Cara Instalasi (Quick Start)

### 1. Persiapan Database
1. Buat project baru di [Neon.tech](https://neon.tech).
2. Jalankan SQL yang ada di file `FASE2_Seed_Data_SQL.sql` pada SQL Editor Neon.
3. Salin **Connection String** database Anda.

### 2. Deployment di Vercel
1. Fork atau upload repositori ini ke GitHub Anda.
2. Hubungkan repositori ke [Vercel](https://vercel.com).
3. Tambahkan **Environment Variables** di Vercel:
   - `DATABASE_URL`: Connection string Neon Anda.
   - `API_SECRET_KEY`: Kata sandi bebas untuk mengamankan API Anda.
4. Klik **Deploy**.

### 3. Konfigurasi Client
Agar aplikasi di browser dapat mengakses API yang sudah diamankan:
1. Buka URL aplikasi Anda.
2. Buka Console (F12) dan jalankan:
   ```javascript
   localStorage.setItem('sais_api_key', 'API_SECRET_KEY_ANDA');
   ```
3. Refresh halaman.

## 📁 Struktur Proyek

- `/api`: Logika backend serverless (Node.js).
- `/src`: File frontend (HTML, CSS, JS).
- `package.json`: Daftar dependensi.
- `vercel.json`: Konfigurasi routing Vercel.

## 🛡️ Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---
**SAIS Team** - *Membangun digitalisasi pendidikan yang lebih baik.*
