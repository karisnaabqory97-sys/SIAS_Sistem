-- =============================================================================
-- SAIS SYSTEM DATABASE - FASE UPDATE FINAL
-- Nama File: Fase_data_sql.sql
-- Fokus: Sinkronisasi Level, Penugasan Guru, Detail Nilai, & Performa Tinggi
-- =============================================================================

-- 1. MEMBERSIHKAN DATABASE (Hapus tabel lama jika ada)
DROP TABLE IF EXISTS nilai, presensi, jadwal_pelajaran, siswa, guru, mata_pelajaran, kelas, informasi, admin CASCADE;

-- 2. TABEL PENGATURAN & ADMIN
CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    nama VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL KELAS (Mendukung Level VII, VIII, IX & Wali Kelas)
CREATE TABLE kelas (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(20) UNIQUE NOT NULL, 
    kode VARCHAR(20) NOT NULL, -- Kolom untuk Level/Tingkat
    wali VARCHAR(100),         -- Nama Guru sebagai Wali Kelas
    siswa_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL GURU
CREATE TABLE guru (
    id SERIAL PRIMARY KEY,
    nuptk VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    mapel VARCHAR(100),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Aktif',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL SISWA (Mendukung Kenaikan Kelas & Status Alumni)
CREATE TABLE siswa (
    id SERIAL PRIMARY KEY,
    nisn VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jk VARCHAR(1), -- 'L' untuk Laki-laki, 'P' untuk Perempuan
    kelas VARCHAR(20),
    ayah VARCHAR(100),
    pekerjaan_ayah VARCHAR(100),
    ibu VARCHAR(100),
    pekerjaan_ibu VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Aktif',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk mempercepat pencarian ribuan data siswa
CREATE INDEX idx_siswa_search ON siswa(nisn, nama);

-- 6. TABEL MATA PELAJARAN (Mendukung Sinkronisasi Penugasan Level/Guru)
CREATE TABLE mata_pelajaran (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    singkatan VARCHAR(10) UNIQUE NOT NULL,
    deskripsi TEXT, -- Menyimpan format JSON untuk relasi Level-Kelas-Guru
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL JADWAL PELAJARAN (Mendukung Deteksi Bentrok/Merah-Hijau)
CREATE TABLE jadwal_pelajaran (
    id SERIAL PRIMARY KEY,
    kelas VARCHAR(20) NOT NULL,
    semester VARCHAR(10) NOT NULL,
    hari VARCHAR(15) NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    mapel VARCHAR(100) NOT NULL,
    guru VARCHAR(100) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index gabungan untuk deteksi bentrok jadwal secara instan
CREATE INDEX idx_jadwal_global ON jadwal_pelajaran(hari, jam_mulai, guru);

-- 8. TABEL PRESENSI (Mendukung Input Pertemuan 1-10 & Real-time Sinkron)
CREATE TABLE presensi (
    id SERIAL PRIMARY KEY,
    nisn VARCHAR(20) NOT NULL,
    nama VARCHAR(100),
    kelas VARCHAR(20),
    mapel VARCHAR(100),
    tanggal DATE NOT NULL,
    pertemuan INTEGER NOT NULL, -- Pertemuan 1 s/d 10
    status VARCHAR(10) NOT NULL, -- Hadir, Sakit, Izin, Alpa
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(nisn, mapel, pertemuan) -- Logika agar data tidak ganda (Upsert)
);

-- 9. TABEL NILAI (Mendukung Harian, PTS, PAS, PAT & Edit Admin)
CREATE TABLE nilai (
    id SERIAL PRIMARY KEY,
    nisn VARCHAR(20) NOT NULL,
    nama VARCHAR(100),
    kelas VARCHAR(20),
    mapel VARCHAR(100),
    jenis_ujian VARCHAR(20) NOT NULL, -- Harian 1, PTS, PAS, PAT, dll
    nilai NUMERIC(5,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(nisn, mapel, jenis_ujian) -- Logika agar nilai bisa diperbarui (Upsert)
);

-- 10. TABEL JADWAL UJIAN (Dikelola Admin, Dilihat Guru & Siswa)
CREATE TABLE IF NOT EXISTS jadwal_ujian (
    id SERIAL PRIMARY KEY,
    mapel VARCHAR(100) NOT NULL,
    jenis VARCHAR(20) NOT NULL,
    tanggal DATE NOT NULL,
    waktu VARCHAR(50) NOT NULL,
    ruang VARCHAR(100) NOT NULL,
    kelas VARCHAR(20) NOT NULL,
    semester VARCHAR(10) DEFAULT 'Ganjil',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABEL INFORMASI (Mendukung Filter Sasaran Guru/Siswa)
CREATE TABLE informasi (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    isi TEXT NOT NULL,
    sasaran VARCHAR(20) DEFAULT 'Semua', -- Semua, Guru, Siswa
    kategori VARCHAR(50) DEFAULT 'Umum',
    tanggal DATE DEFAULT CURRENT_DATE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INITIAL DATA (Masukkan Akun Akses Awal)
-- Password Default: admin123
INSERT INTO admin (username, password, nama) 
VALUES ('admin', 'admin123', 'Administrator Utama');

-- =============================================================================
-- MIGRASI: Tambah kolom updated_at yang hilang (untuk database existing)
-- =============================================================================
ALTER TABLE admin ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE kelas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE guru ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE mata_pelajaran ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE informasi ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE jadwal_ujian ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- =============================================================================
-- DATABASE SELESAI DIKONFIGURASI
-- Sistem Siap Digunakan Untuk Ribuan Data.
-- =============================================================================
