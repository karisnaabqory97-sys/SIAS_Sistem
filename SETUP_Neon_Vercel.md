# Setup Lengkap: Neon + Vercel untuk SAIS

Dokumen ini berisi panduan step-by-step untuk deploy aplikasi SAIS ke Vercel dengan database Neon.

---

## 📋 Daftar Isi

1. [Prerequisites](#prerequisites)
2. [Bagian 1: Setup Neon Database](#bagian-1-setup-neon-database)
3. [Bagian 2: Setup Vercel](#bagian-2-setup-vercel)
4. [Bagian 3: Koneksi Neon + Vercel](#bagian-3-koneksi-neon--vercel)
5. [Bagian 4: Update Kode Aplikasi](#bagian-4-update-kode-aplikasi)
6. [Bagian 5: SQL Schema](#bagian-5-sql-schema)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

- Akun GitHub
- Akun Vercel (signup di vercel.com)
- Akun Neon (signup di neon.tech)

---

## 🔵 Bagian 1: Setup Neon Database

### Step 1.1: Buat Akun Neon

1. Buka [neon.tech](https://neon.tech)
2. Klik **Sign Up**
3. Gunakan **GitHub OAuth** (lebih cepat, tinggal klik authorize)
4. Verifikasi email jika diminta

### Step 1.2: Buat Project Baru

1. Di Neon Dashboard, klik **New Project**
2. Isi detail project:
   ```
   Project Name: sais-database
   Region: Singapore (atau yang terdekat dengan Indonesia)
   Database Name: sais_db
   ```
3. Klik **Create Project**
4. Tunggu beberapa detik hingga project ready

### Step 1.3: Copy Connection String

1. Di project dashboard, cari bagian **Connection Details**
2. Klik **Connection string**
3. Copy entire string, formatnya seperti ini:
   ```
   postgresql://username:password@ep-xxx-123456.us-east-2.aws.neon.tech/sais_db?sslmode=require
   ```
4. **SIMPAN** connection string ini di tempat aman (bisa di Notes dulu)

### Step 1.4: Create SQL Editor Query (Optional - untuk test)

1. Di Neon Dashboard, klik **SQL Editor** di sidebar
2. Jalankan query test sederhana:
   ```sql
   SELECT 1 as test;
   ```
3. Jika结果显示 "1", berarti koneksi berhasil!

---

## eco Bagian 2: Setup Vercel

### Step 2.1: Push Kode ke GitHub

1. Buka terminal di komputer Anda
2. Masuk ke folder project SAIS:
   ```bash
   cd "D:\2026\04. Mei\kelompok 1 kls kariyawan\sistem_informasi_sekolah"
   ```

3. Inisialisasi git (jika belum):
   ```bash
   git init
   ```

4. Tambahkan semua file:
   ```bash
   git add .
   ```

5. Commit:
   ```bash
   git commit -m "Initial commit - SAIS v1.0"
   ```

6. Buat repository di GitHub:
   - Buka [github.com](https://github.com)
   - Klik **New Repository**
   - Nama: `sais-sistem-informasi-sekolah`
   - Visibility: Public (gratis)
   - Jangan centang "Add README" karena sudah ada
   - Klik **Create Repository**

7. Push ke GitHub:
   ```bash
   git remote add origin https://github.com/USERNAME/sais-sistem-informasi-sekolah.git
   git branch -M main
   git push -u origin main
   ```

### Step 2.2: Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Login dengan **GitHub** (klik **Continue with GitHub**)
3. Klik **Add New** → **Project**
4. Pilih repository `sais-sistem-informasi-sekolah`
5. Klik **Import**
6. Configure Project:
   - **Framework Preset:** Other (karena pure HTML/JS)
   - **Root Directory:** `./` atau `src` (pilih yang ada file index.html)
   - **Build Command:** kosongkan
   - **Output Directory:** `.` atau `src`
7. Klik **Deploy**
8. Tunggu 1-2 menit
9. Jika berhasil, akan muncul URL seperti: `https://sais-sistem-informasi-sekolah.vercel.app`
10. **SIMPAN** URL ini!

---

## 🔗 Bagian 3: Koneksi Neon + Vercel

### Step 3.1: Buka Vercel Storage

1. Di Vercel Dashboard, masuk ke project Anda
2. Klik tab **Storage**
3. Klik **Create Database**
4. Pilih **Neon** (logo kucing Neon)
5. Klik **Continue**

### Step 3.2: Paste Connection String

1. Paste connection string dari Step 1.3
2. Klik **Create**
3. Tunggu beberapa detik
4. Database berhasil terhubung!

### Step 3.3: Setup Environment Variables

1. Di Vercel Dashboard → **Settings** → **Environment Variables**
2. Tambahkan variabel berikut:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://username:password@ep-xxx.neon.tech/sais_db?sslmode=require` |
| `NEON_CONNECTION_STRING` | (copy paste dari connection string) |

3. Klik **Save**
4. Untuk apply ke deployment existing, klik **Redeploy**

---

## 💻 Bagian 4: Update Kode Aplikasi

### Step 4.1: File yang Sudah Disiapkan

Untuk deployment sudah tersedia:
- `package.json` - Dependencies untuk Vercel + Neon
- `vercel.json` - Konfigurasi deployment
- `api/db.js` - API routes untuk koneksi ke Neon
- `src/neon-config.js` - Konfigurasi database (sudah dibuat)

### Step 4.2: Struktur Project

```
sistem_informasi_sekolah/
├── api/
│   └── db.js              # API routes untuk Neon
├── src/
│   ├── index.html         # Halaman login
│   ├── dashboard.html     # Dashboard admin
│   ├── siswa.html         # Manajemen siswa
│   ├── guru.html          # Manajemen guru
│   ├── neon-config.js     # Konfigurasi database
│   └── ...                # File HTML lainnya
├── package.json           # Dependencies
├── vercel.json           # Konfigurasi Vercel
└── .gitignore            # Git ignore file
```

### Step 4.3: Deploy ke Vercel

1. Push kode ke GitHub:
   ```bash
   git add .
   git commit -m "Update: Switch to Neon + Vercel"
   git push origin main
   ```

2. Di Vercel Dashboard:
   - Klik **Import Project**
   - Pilih repository GitHub
   - Klik **Deploy**

3. Setup Environment Variable:
   - Buka **Settings** → **Environment Variables**
   - Tambahkan:
     ```
     DATABASE_URL = postgresql://user:pass@ep-xxx.neon.tech/sais?sslmode=require
     ```

4. Connect Neon Storage:
   - Buka **Storage** tab
   - Klik **Create Database**
   - Pilih **Neon**
   - Paste connection string

### Step 4.4: Jalankan SQL Schema

1. Buka [neon.tech](https://neon.tech) → SQL Editor
2. Copy isi dari `FASE2_Seed_Data_SQL.sql`
3. Paste dan jalankan semua query
4. Data sample akan otomatis ter-create
        }
    },

    // CRUD helpers untuk Siswa
    async getSiswa() {
        const p = await getPool();
        const { rows } = await p.sql`SELECT * FROM siswa ORDER BY created_at ASC`;
        return rows;
    },

    async getSiswaById(id) {
        const p = await getPool();
        const { rows } = await p.sql`SELECT * FROM siswa WHERE id = ${id}`;
        return rows[0] || null;
    },

    async insertSiswa(data) {
        const p = await getPool();
        const { rows } = await p.sql`
            INSERT INTO siswa (nisn, nama, jenis_kelamin, kelas, nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, status)
            VALUES (${data.nisn}, ${data.nama}, ${data.jk}, ${data.kelas}, ${data.ayah}, ${data.pekerjaanAyah}, ${data.ibu}, ${data.pekerjaanIbu}, ${data.status || 'Aktif'})
            RETURNING *
        `;
        return rows[0];
    },

    async updateSiswa(id, data) {
        const p = await getPool();
        const { rows } = await p.sql`
            UPDATE siswa SET
                nisn = ${data.nisn},
                nama = ${data.nama},
                jenis_kelamin = ${data.jk},
                kelas = ${data.kelas},
                nama_ayah = ${data.ayah},
                pekerjaan_ayah = ${data.pekerjaanAyah},
                nama_ibu = ${data.ibu},
                pekerjaan_ibu = ${data.pekerjaanIbu},
                status = ${data.status},
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING *
        `;
        return rows[0];
    },

    async deleteSiswa(id) {
        const p = await getPool();
        await p.sql`DELETE FROM siswa WHERE id = ${id}`;
        return true;
    },

    // CRUD helpers untuk Guru
    async getGuru() {
        const p = await getPool();
        const { rows } = await p.sql`SELECT * FROM guru ORDER BY created_at ASC`;
        return rows;
    },

    async insertGuru(data) {
        const p = await getPool();
        const { rows } = await p.sql`
            INSERT INTO guru (nuptk, nama, mapel, status)
            VALUES (${data.nuptk}, ${data.nama}, ${data.mapel}, ${data.status || 'Aktif'})
            RETURNING *
        `;
        return rows[0];
    },

    async updateGuru(id, data) {
        const p = await getPool();
        const { rows } = await p.sql`
            UPDATE guru SET
                nuptk = ${data.nuptk},
                nama = ${data.nama},
                mapel = ${data.mapel},
                status = ${data.status},
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING *
        `;
        return rows[0];
    },

    async deleteGuru(id) {
        const p = await getPool();
        await p.sql`DELETE FROM guru WHERE id = ${id}`;
        return true;
    },

    // Stats untuk Dashboard
    async getStats() {
        const p = await getPool();
        const { rows } = await p.sql`
            SELECT
                (SELECT COUNT(*) FROM siswa) as total_siswa,
                (SELECT COUNT(*) FROM guru) as total_guru,
                (SELECT COUNT(DISTINCT kelas) FROM siswa WHERE kelas IS NOT NULL) as total_kelas
        `;
        return rows[0];
    }
};

console.log('Neon config loaded - Database:', window.isDatabaseConfigured() ? 'Connected' : 'Not configured');
```

### Step 4.3: Update `package.json`

Jika belum ada, buat `package.json` di root:

```json
{
  "name": "sais-sistem-informasi-sekolah",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vercel dev"
  },
  "dependencies": {
    "@vercel/postgres": "^0.8.0"
  }
}
```

### Step 4.4: Update File HTML

Di setiap file HTML yang menggunakan Supabase, ubah reference ke Neon:

```html
<!-- Sebelum (Supabase) -->
<script src="supabase-config.js"></script>

<!-- Sesudah (Neon) -->
<script src="neon-config.js"></script>
```

Atau buat file `.env` untuk development local:

```env
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/sais_db?sslmode=require
```

---

## 🗄️ Bagian 5: SQL Schema

Jalankan SQL berikut di **Neon SQL Editor** (https://neon.tech/sql-editor)

### 5.1 Create Tables

```sql
-- ============================================
-- SAIS - Sistem Informasi Sekolah
-- SQL Schema untuk Neon PostgreSQL
-- ============================================

-- 1. Tabel Mata Pelajaran
CREATE TABLE IF NOT EXISTS mata_pelajaran (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama VARCHAR(100) NOT NULL,
    singkatan VARCHAR(20),
    deskripsi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Kelas
CREATE TABLE IF NOT EXISTS kelas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama VARCHAR(20) UNIQUE NOT NULL,
    tingkat VARCHAR(10) CHECK (tingkat IN ('VII', 'VIII', 'IX')),
    tahun_ajaran VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Siswa
CREATE TABLE IF NOT EXISTS siswa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nisn VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jk CHAR(1) CHECK (jk IN ('L', 'P')),
    kelas VARCHAR(20),
    alamat TEXT,
    ayah VARCHAR(100),
    pekerjaan_ayah VARCHAR(50),
    ibu VARCHAR(100),
    pekerjaan_ibu VARCHAR(50),
    username VARCHAR(50),
    password VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Guru
CREATE TABLE IF NOT EXISTS guru (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nuptk VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    mapel VARCHAR(100),
    username VARCHAR(50),
    password VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Informasi
CREATE TABLE IF NOT EXISTS informasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul VARCHAR(200) NOT NULL,
    konten TEXT,
    kategori VARCHAR(20) CHECK (kategori IN ('Pengumuman', 'Agenda', 'Informasi')),
    pengirim VARCHAR(100),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel Jadwal
CREATE TABLE IF NOT EXISTS jadwal_pelajaran (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kelas VARCHAR(20) NOT NULL,
    hari VARCHAR(20),
    jam_mulai TIME,
    jam_selesai TIME,
    mapel VARCHAR(100),
    guru VARCHAR(100),
    semester VARCHAR(10),
    tahun_ajaran VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabel Nilai
CREATE TABLE IF NOT EXISTS nilai (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id UUID REFERENCES siswa(id),
    mapel VARCHAR(100),
    semester VARCHAR(10),
    tahun_ajaran VARCHAR(20),
    tugas NUMERIC(5,2),
    uts NUMERIC(5,2),
    uas NUMERIC(5,2),
    akhir NUMERIC(5,2),
    grade VARCHAR(2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabel Presensi
CREATE TABLE IF NOT EXISTS presensi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id UUID REFERENCES siswa(id),
    tanggal DATE,
    status VARCHAR(20) CHECK (status IN ('Hadir', 'Izin', 'Sakit', 'Alfa')),
    keterangan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Tabel Admin (login)
CREATE TABLE IF NOT EXISTS admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.2 Insert Data Awal

```sql
-- Insert Mata Pelajaran
INSERT INTO mata_pelajaran (nama, singkatan) VALUES
('Pendidikan Agama Islam', 'PAI'),
('Bahasa Indonesia', 'B. Indo'),
('Matematika', 'MTK'),
('Ilmu Pengetahuan Alam', 'IPA'),
('Ilmu Pengetahuan Sosial', 'IPS'),
('Bahasa Inggris', 'B. Inggris'),
('Pendidikan Jasmani dan Olahraga', 'PJOK'),
('Seni Budaya', 'Senbud'),
('Prakarya', 'Prakarya'),
('Informatika', 'Informatika');

-- Insert Kelas
INSERT INTO kelas (nama, tingkat, tahun_ajaran) VALUES
('VII-A', 'VII', '2025/2026'),
('VII-B', 'VII', '2025/2026'),
('VIII-A', 'VIII', '2025/2026'),
('VIII-B', 'VIII', '2025/2026'),
('IX-A', 'IX', '2025/2026'),
('IX-B', 'IX', '2025/2026');

-- Insert Admin (password: admin123)
INSERT INTO admin (username, password, nama) VALUES
('admin', 'admin123', 'Administrator');

-- Insert Guru Sample
INSERT INTO guru (nuptk, nama, mapel, username, password) VALUES
('198501012010011001', 'Budi Santoso, S.Pd.', 'Matematika', 'budi.santoso', 'guru123'),
('198501022010012002', 'Siti Aminah, S.Pd.', 'Bahasa Indonesia', 'siti.aminah', 'guru123'),
('198501032010013003', 'Ahmad Fauzi, M.Pd.', 'Ilmu Pengetahuan Alam', 'ahmad.fauzi', 'guru123'),
('198501042010014004', 'Dewi Lestari, S.Pd.', 'Bahasa Inggris', 'dewi.lestari', 'guru123');

-- Insert Siswa Sample
INSERT INTO siswa (nisn, nama, jk, kelas, ayah, pekerjaan_ayah, ibu, pekerjaan_ibu) VALUES
('0012345671', 'Rahmat Hidayat', 'L', 'VII-A', 'H. Anwar', 'PNS', 'Hj. Sari', 'Guru'),
('0012345672', 'Putri Andini', 'P', 'VII-A', 'Drs. Hasan', 'Wiraswasta', 'Dra. Yuni', 'PNS'),
('0012345673', 'Dimas Pratama', 'L', 'VIII-A', 'Budi Santoso', 'Karyawan Swasta', 'Siti Rahayu', 'Ibu Rumah Tangga'),
('0012345674', 'Nabila Zahra', 'P', 'VIII-B', 'Ir. Wijaya', 'Pengusaha', 'Ira Marlina', 'Dokter'),
('0012345675', 'Fajar Nugroho', 'L', 'IX-A', 'Agus Setiawan', 'Petani', 'Siti Fatimah', 'Ibu Rumah Tangga');

-- Insert Informasi
INSERT INTO informasi (judul, konten, kategori, pengirim, is_published) VALUES
('Selamat Datang di SAIS', 'Sistem Informasi Sekolah SMPS Negeri 1 siap beroperasi. Selamat使用 sistem ini dengan baik.', 'Informasi', 'Administrator', TRUE),
('Jadwal Ujian Semester', 'Ujian Tengah Semester akan dilaksanakan pada tanggal 15-20 Juni 2026.', 'Pengumuman', 'Administrator', TRUE);

-- Insert Jadwal Sample
INSERT INTO jadwal_pelajaran (kelas, hari, jam_mulai, jam_selesai, mapel, guru, semester, tahun_ajaran) VALUES
('VII-A', 'Senin', '07:00', '08:30', 'Matematika', 'Budi Santoso', 'Ganjil', '2025/2026'),
('VII-A', 'Senin', '08:30', '10:00', 'Bahasa Indonesia', 'Siti Aminah', 'Ganjil', '2025/2026'),
('VII-A', 'Senin', '10:15', '11:45', 'IPA', 'Ahmad Fauzi', 'Ganjil', '2025/2026'),
('VII-B', 'Senin', '07:00', '08:30', 'Bahasa Inggris', 'Dewi Lestari', 'Ganjil', '2025/2026');

-- Insert Nilai Sample
INSERT INTO nilai (siswa_id, mapel, semester, tugas, uts, uas, akhir, grade)
SELECT id, 'Matematika', 'Ganjil', 85, 80, 88, 84.67, 'B'
FROM siswa WHERE nisn = '0012345671';

INSERT INTO nilai (siswa_id, mapel, semester, tugas, uts, uas, akhir, grade)
SELECT id, 'Bahasa Indonesia', 'Ganjil', 90, 88, 92, 90.00, 'A'
FROM siswa WHERE nisn = '0012345671';

-- Insert Presensi Sample (hari ini)
INSERT INTO presensi (siswa_id, tanggal, status)
SELECT id, CURRENT_DATE, 'Hadir'
FROM siswa WHERE nisn IN ('0012345671', '0012345672', '0012345673');
```

### 5.3 Verifikasi Data

```sql
-- Cek semua data
SELECT 'mata_pelajaran' as tabel, COUNT(*) as jumlah FROM mata_pelajaran
UNION ALL SELECT 'kelas', COUNT(*) FROM kelas
UNION ALL SELECT 'siswa', COUNT(*) FROM siswa
UNION ALL SELECT 'guru', COUNT(*) FROM guru
UNION ALL SELECT 'informasi', COUNT(*) FROM informasi
UNION ALL SELECT 'jadwal', COUNT(*) FROM jadwal_pelajaran
UNION ALL SELECT 'nilai', COUNT(*) FROM nilai
UNION ALL SELECT 'presensi', COUNT(*) FROM presensi;
```

---

## ❓ Troubleshooting

### Problem: "Connection refused" atau timeout

**Solusi:**
1. Cek apakah Neon project masih aktif (buka neon.tech)
2. Pastikan connection string benar dan lengkap
3. Coba test di SQL Editor Neon dulu

### Problem: "Password authentication failed"

**Solusi:**
1. Cek apakah password di connection string benar
2. Di Neon Dashboard → Settings → Connection → Reset password

### Problem: Data tidak tampil

**Solusi:**
1. Buka browser DevTools (F12) → Console
2. Cek apakah ada error JavaScript
3. Pastikan `isDatabaseConfigured()` return true

### Problem: Slow loading

**Solusi:**
1. Neon memiliki cold start ~500ms
2. Data akan lebih cepat di subsequent requests
3. Consider adding connection pooling

---

## 📞 Dukungan

- **Neon Docs:** https://neon.tech/docs
- **Vercel Postgres:** https://vercel.com/docs/storage/vercel-postgres
- **GitHub Issues:** Buat issue jika menemukan bug

---

## ✅ Checklist Complete Setup

| Step | Task | Status |
|------|------|--------|
| 1 | Buat akun Neon | ☐ |
| 2 | Buat project Neon + copy connection string | ☐ |
| 3 | Push kode ke GitHub | ☐ |
| 4 | Deploy ke Vercel | ☐ |
| 5 | Connect Neon ke Vercel Storage | ☐ |
| 6 | Setup Environment Variables | ☐ |
| 7 | Update kode ke Neon | ☐ |
| 8 | Jalankan SQL Schema | ☐ |
| 9 | Insert data awal | ☐ |
| 10 | Test aplikasi | ☐ |

---

*Last Updated: 31 Mei 2026*
*Created for: SAIS - Sistem Informasi Sekolah*