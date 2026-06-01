# Fase 2: Integrasi Backend & Database (Supabase)

Dokumen ini berisi panduan langkah demi langkah untuk menghubungkan aplikasi web SAIS dengan database Supabase, menggantikan penyimpanan localStorage.

---

## 📋 Daftar Isi

1. [Persiapan](#persiapan)
2. [Membuat Project Supabase](#membuat-project-supabase)
3. [SQL Schema - Semua Tabel](#sql-schema---semua-tabel)
4. [Konfigurasi Kredensial](#konfigurasi-kredensial)
5. [Update File Aplikasi](#update-file-aplikasi)
6. [Row Level Security (RLS)](#row-level-security-rls)
7. [Testing & Verifikasi](#testing--verifikasi)

---

## 🛠️ Persiapan

### Yang dibutuhkan:
- Akun Supabase (daftar gratis di [supabase.com](https://supabase.com))
- Project baru di Supabase Dashboard
- URL dan Anon Key dari project Supabase

---

## 📦 Langkah 1: Membuat Project Supabase

1. Buka [supabase.com](https://supabase.com) dan login
2. Klik **New Project**
3. Isi detail project:
   - **Name:** SAIS - Sistem Informasi Sekolah
   - **Database Password:** ( ingat password ini! )
   - **Region:** Singapore (atau yang terdekat)
4. Klik **Create new project**
5. Tunggu beberapa menit hingga project selesai dibuat
6. Di Dashboard project, masuk ke **Settings** → **API**
7. Copy **Project URL** dan **anon/public** key

---

## 🗄️ Langkah 2: SQL Schema - Semua Tabel

Buka **SQL Editor** di Supabase Dashboard dan jalankan query berikut:

### 2.1 Tabel Profil (Users/Auth)

```sql
-- ============================================
-- TABEL: profil (Data Login & Role User)
-- ============================================
CREATE TABLE IF NOT EXISTS profil (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'guru', 'siswa')),
    nama_lengkap TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk pencarian cepat
CREATE INDEX idx_profil_email ON profil(email);
CREATE INDEX idx_profil_role ON profil(role);
```

### 2.2 Tabel Siswa

```sql
-- ============================================
-- TABEL: siswa
-- ============================================
CREATE TABLE IF NOT EXISTS siswa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profil_id UUID REFERENCES profil(id) ON DELETE CASCADE,
    nisn TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    jenis_kelamin TEXT CHECK (jenis_kelamin IN ('L', 'P')),
    kelas_id UUID REFERENCES kelas(id),
    alamat TEXT,
    nama_ayah TEXT,
    pekerjaan_ayah TEXT,
    nama_ibu TEXT,
    pekerjaan_ibu TEXT,
    no_hp_ortu TEXT,
    status TEXT DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_siswa_nisn ON siswa(nisn);
CREATE INDEX idx_siswa_profil ON siswa(profil_id);
CREATE INDEX idx_siswa_kelas ON siswa(kelas_id);
```

### 2.3 Tabel Guru

```sql
-- ============================================
-- TABEL: guru
-- ============================================
CREATE TABLE IF NOT EXISTS guru (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profil_id UUID REFERENCES profil(id) ON DELETE CASCADE,
    nuptk TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    jenis_kelamin TEXT CHECK (jenis_kelamin IN ('L', 'P')),
    mata_pelajaran_id UUID REFERENCES mata_pelajaran(id),
    no_hp TEXT,
    alamat TEXT,
    status TEXT DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_guru_nuptk ON guru(nuptk);
CREATE INDEX idx_guru_profil ON guru(profil_id);
CREATE INDEX idx_guru_mapel ON guru(mata_pelajaran_id);
```

### 2.4 Tabel Kelas

```sql
-- ============================================
-- TABEL: kelas
-- ============================================
CREATE TABLE IF NOT EXISTS kelas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT UNIQUE NOT NULL,
    tingkat TEXT CHECK (tingkat IN ('VII', 'VIII', 'IX')),
    tahun_ajaran TEXT,
    wali_kelas_id UUID REFERENCES guru(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_kelas_nama ON kelas(nama);
CREATE INDEX idx_kelas_tingkat ON kelas(tingkat);
```

### 2.5 Tabel Mata Pelajaran

```sql
-- ============================================
-- TABEL: mata_pelajaran
-- ============================================
CREATE TABLE IF NOT EXISTS mata_pelajaran (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    singkatan TEXT,
    deskripsi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mapel_nama ON mata_pelajaran(nama);
```

### 2.6 Tabel Jadwal Pelajaran

```sql
-- ============================================
-- TABEL: jadwal_pelajaran
-- ============================================
CREATE TABLE IF NOT EXISTS jadwal_pelajaran (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kelas_id UUID REFERENCES kelas(id) ON DELETE CASCADE,
    mata_pelajaran_id UUID REFERENCES mata_pelajaran(id),
    guru_id UUID REFERENCES guru(id),
    hari TEXT NOT NULL CHECK (hari IN ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')),
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    semester TEXT CHECK (semester IN ('Ganjil', 'Genap')),
    tahun_ajaran TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jadwal_kelas ON jadwal_pelajaran(kelas_id);
CREATE INDEX idx_jadwal_hari ON jadwal_pelajaran(hari);
CREATE INDEX idx_jadwal_guru ON jadwal_pelajaran(guru_id);
```

### 2.7 Tabel Nilai

```sql
-- ============================================
-- TABEL: nilai
-- ============================================
CREATE TABLE IF NOT EXISTS nilai (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id UUID REFERENCES siswa(id) ON DELETE CASCADE,
    mata_pelajaran_id UUID REFERENCES mata_pelajaran(id),
    semester TEXT CHECK (semester IN ('Ganjil', 'Genap')),
    tahun_ajaran TEXT,
    nilai_tugas NUMERIC(5,2),
    nilai_uts NUMERIC(5,2),
    nilai_uas NUMERIC(5,2),
    nilai_akhir NUMERIC(5,2),
    grade TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nilai_siswa ON nilai(siswa_id);
CREATE INDEX idx_nilai_mapel ON nilai(mata_pelajaran_id);
CREATE INDEX idx_nilai_semester ON nilai(semester);
```

### 2.8 Tabel Presensi

```sql
-- ============================================
-- TABEL: presensi
-- ============================================
CREATE TABLE IF NOT EXISTS presensi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id UUID REFERENCES siswa(id) ON DELETE CASCADE,
    tanggal DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Hadir', 'Izin', 'Sakit', 'Alfa')),
    keterangan TEXT,
    recorded_by UUID REFERENCES profil(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_presensi_siswa ON presensi(siswa_id);
CREATE INDEX idx_presensi_tanggal ON presensi(tanggal);
CREATE UNIQUE INDEX idx_presensi_unique ON presensi(siswa_id, tanggal);
```

### 2.9 Tabel Informasi

```sql
-- ============================================
-- TABEL: informasi
-- ============================================
CREATE TABLE IF NOT EXISTS informasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    konten TEXT,
    kategori TEXT CHECK (kategori IN ('Pengumuman', 'Agenda', 'Informasi')),
    published_by UUID REFERENCES profil(id),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_informasi_published ON informasi(is_published);
CREATE INDEX idx_informasi_kategori ON informasi(kategori);
```

---

## 🔑 Langkah 3: Konfigurasi Kredensial

### 3.1 Update supabase-config.js

Buka file `src/supabase-config.js` dan isi kredensial Anda:

```javascript
// Konfigurasi Kredensial Supabase Anda
// Ganti dengan URL dan Anon Key dari project Supabase Anda

window.SUPABASE_URL = "https://your-project-id.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### 3.2 Enable Email Auth di Supabase

1. Di Supabase Dashboard, masuk ke **Authentication** → **Settings**
2. Scroll ke **Email** section
3. Aktifkan **Enable Email Sign Up**
4. Matikan **Confirm email** (untuk testing mudah)

---

## 🔒 Langkah 4: Row Level Security (RLS)

RLS adalah sistem keamanan yang memastikan user hanya bisa melihat data mereka sendiri.

### 4.1 Enable RLS untuk Semua Tabel

Jalankan SQL berikut di SQL Editor:

```sql
-- Enable RLS untuk semua tabel
ALTER TABLE profil ENABLE ROW LEVEL SECURITY;
ALTER TABLE siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mata_pelajaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE jadwal_pelajaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE nilai ENABLE ROW LEVEL SECURITY;
ALTER TABLE presensi ENABLE ROW LEVEL SECURITY;
ALTER TABLE informasi ENABLE ROW LEVEL SECURITY;
```

### 4.2 Policy untuk Profil

```sql
-- Policy: Admin bisa lihat semua profil, user lain hanya profil sendiri
CREATE POLICY "Profil: Admin can see all" ON profil
    FOR SELECT USING (
        (SELECT role FROM profil WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Profil: Users can see own" ON profil
    FOR SELECT USING (
        id = auth.uid()
    );

CREATE POLICY "Profil: Admin can insert" ON profil
    FOR INSERT WITH CHECK (
        (SELECT role FROM profil WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Profil: Admin can update" ON profil
    FOR UPDATE USING (
        (SELECT role FROM profil WHERE id = auth.uid()) = 'admin'
    );
```

### 4.3 Policy untuk Siswa

```sql
-- Policy: Admin full access, Siswa hanya data sendiri
CREATE POLICY "Siswa: Admin can do all" ON siswa
    FOR ALL USING (
        (SELECT role FROM profil WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Siswa: Guru can read" ON siswa
    FOR SELECT USING (
        (SELECT role FROM profil WHERE id = auth.uid()) = 'guru'
    );
```

### 4.4 Policy untuk Informasi

```sql
-- Policy: Semua orang bisa baca informasi yang dipublish
CREATE POLICY "Informasi: Public can read published" ON informasi
    FOR SELECT USING (
        is_published = TRUE
    );

CREATE POLICY "Informasi: Admin can manage" ON informasi
    FOR ALL USING (
        (SELECT role FROM profil WHERE id = auth.uid()) = 'admin'
    );
```

---

## ✅ Checklist Fase 2

| No | Task | Status |
|----|------|--------|
| 1 | Buat project Supabase | ☐ |
| 2 | Jalankan semua SQL schema | ☐ |
| 3 | Update supabase-config.js dengan URL & Key | ☐ |
| 4 | Enable Email Auth | ☐ |
| 5 | Enable RLS di semua tabel | ☐ |
| 6 | Buat security policies | ☐ |
| 7 | Test login dengan Supabase Auth | ☐ |
| 8 | Test CRUD siswa/guru dengan Supabase | ☐ |

---

## 🧪 Langkah 5: Testing & Verifikasi

### Test 1: Login dengan Supabase Auth

1. Buka `src/index.html` di browser
2. Pastikan Supabase sudah dikonfigurasi
3. Test login dengan email yang sudah ada di tabel `profil`

### Test 2: CRUD Data

1. Buka halaman `siswa.html` sebagai admin
2. Tambah, edit, hapus data siswa
3. Verifikasi data tersimpan di Supabase

### Test 3: Security Test

1. Login sebagai siswa
2. Coba akses halaman admin
3. Pastikan tidak bisa

---

## 📝 Catatan Penting

1. **LocalStorage Fallback**: Aplikasi sudah dirancang untuk fallback ke localStorage jika Supabase tidak dikonfigurasi
2. **Testing Mode**: Untuk development, Anda bisa disable RLS sementara
3. **Production**: Sebelum launch, pastikan semua RLS policies aktif

---

## ▶️ Langkah Selanjutnya

Setelah Fase 2 selesai, lanjut ke **Fase 3: Pengembangan Flutter Mobile**

---

*Last Updated: 31 Mei 2026*