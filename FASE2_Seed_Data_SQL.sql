-- ============================================
-- SEED DATA - Data Awal untuk Testing
-- ============================================
-- Jalankan setelah schema tables selesai dibuat
-- ============================================

-- 1. Insert Mata Pelajaran
INSERT INTO mata_pelajaran (nama, singkatan, deskripsi) VALUES
('Pendidikan Agama Islam', 'PAI', 'Mata pelajaran Pendidikan Agama Islam'),
('Bahasa Indonesia', 'B. Indo', 'Mata pelajaran Bahasa Indonesia'),
('Matematika', 'MTK', 'Mata pelajaran Matematika'),
('Ilmu Pengetahuan Alam', 'IPA', 'Mata pelajaran Ilmu Pengetahuan Alam'),
('Ilmu Pengetahuan Sosial', 'IPS', 'Mata pelajaran Ilmu Pengetahuan Sosial'),
('Bahasa Inggris', 'B. Inggris', 'Mata pelajaran Bahasa Inggris'),
('Pendidikan Jasmani dan Olahraga', 'PJOK', 'Mata pelajaran Pendidikan Jasmani'),
('Seni Budaya', 'Senbud', 'Mata pelajaran Seni Budaya'),
('Prakarya', 'Prakarya', 'Mata pelajaran Prakarya'),
('Informatika', 'Informatika', 'Mata pelajaran Informatika');

-- 2. Insert Kelas
INSERT INTO kelas (nama, tingkat, tahun_ajaran) VALUES
('VII-A', 'VII', '2025/2026'),
('VII-B', 'VII', '2025/2026'),
('VIII-A', 'VIII', '2025/2026'),
('VIII-B', 'VIII', '2025/2026'),
('IX-A', 'IX', '2025/2026'),
('IX-B', 'IX', '2025/2026');

-- 3. Insert Profil Admin (password: admin123 - dalam produksi gunakan hash!)
INSERT INTO profil (email, password_hash, role, nama_lengkap) VALUES
('admin@sekolah.sch.id', 'admin123', 'admin', 'Administrator Sistem');

-- 4. Insert Profil Guru Sample
INSERT INTO profil (email, password_hash, role, nama_lengkap) VALUES
('budi.santoso@sekolah.sch.id', 'guru123', 'guru', 'Budi Santoso, S.Pd.'),
('siti.aminah@sekolah.sch.id', 'guru123', 'guru', 'Siti Aminah, S.Pd.'),
('ahmad.fauzi@sekolah.sch.id', 'guru123', 'guru', 'Ahmad Fauzi, M.Pd.'),
('dewi.lestari@sekolah.sch.id', 'guru123', 'guru', 'Dewi Lestari, S.Pd.');

-- 5. Insert Guru dengan referensi profil
INSERT INTO guru (profil_id, nuptk, nama, jenis_kelamin, mata_pelajaran_id, status)
SELECT
    p.id,
    '198501012010011001',
    p.nama_lengkap,
    'L',
    m.id,
    'Aktif'
FROM profil p
CROSS JOIN mata_pelajaran m
WHERE p.email = 'budi.santoso@sekolah.sch.id'
AND m.nama = 'Matematika';

INSERT INTO guru (profil_id, nuptk, nama, jenis_kelamin, mata_pelajaran_id, status)
SELECT
    p.id,
    '198501022010012002',
    p.nama_lengkap,
    'P',
    m.id,
    'Aktif'
FROM profil p
CROSS JOIN mata_pelajaran m
WHERE p.email = 'siti.aminah@sekolah.sch.id'
AND m.nama = 'Bahasa Indonesia';

INSERT INTO guru (profil_id, nuptk, nama, jenis_kelamin, mata_pelajaran_id, status)
SELECT
    p.id,
    '198501032010013003',
    p.nama_lengkap,
    'L',
    m.id,
    'Aktif'
FROM profil p
CROSS JOIN mata_pelajaran m
WHERE p.email = 'ahmad.fauzi@sekolah.sch.id'
AND m.nama = 'Ilmu Pengetahuan Alam';

INSERT INTO guru (profil_id, nuptk, nama, jenis_kelamin, mata_pelajaran_id, status)
SELECT
    p.id,
    '198501042010014004',
    p.nama_lengkap,
    'P',
    m.id,
    'Aktif'
FROM profil p
CROSS JOIN mata_pelajaran m
WHERE p.email = 'dewi.lestari@sekolah.sch.id'
AND m.nama = 'Bahasa Inggris';

-- 6. Insert Profil Siswa Sample
INSERT INTO profil (email, password_hash, role, nama_lengkap) VALUES
('siswa1@sekolah.sch.id', 'siswa123', 'siswa', 'Rahmat Hidayat'),
('siswa2@sekolah.sch.id', 'siswa123', 'siswa', 'Putri Andini'),
('siswa3@sekolah.sch.id', 'siswa123', 'siswa', 'Dimas Pratama'),
('siswa4@sekolah.sch.id', 'siswa123', 'siswa', 'Nabila Zahra'),
('siswa5@sekolah.sch.id', 'siswa123', 'siswa', 'Fajar Nugroho');

-- 7. Insert Siswa Sample
INSERT INTO siswa (profil_id, nisn, nama, jenis_kelamin, kelas_id, nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, status)
SELECT
    p.id,
    '0012345671',
    p.nama_lengkap,
    'L',
    k.id,
    'H. Anwar',
    'PNS',
    'Hj. Sari',
    'Guru',
    'Aktif'
FROM profil p
CROSS JOIN kelas k
WHERE p.email = 'siswa1@sekolah.sch.id'
AND k.nama = 'VII-A';

INSERT INTO siswa (profil_id, nisn, nama, jenis_kelamin, kelas_id, nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, status)
SELECT
    p.id,
    '0012345672',
    p.nama_lengkap,
    'P',
    k.id,
    'Drs. Hasan',
    'Wiraswasta',
    'Dra. Yuni',
    'PNS',
    'Aktif'
FROM profil p
CROSS JOIN kelas k
WHERE p.email = 'siswa2@sekolah.sch.id'
AND k.nama = 'VII-A';

INSERT INTO siswa (profil_id, nisn, nama, jenis_kelamin, kelas_id, nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, status)
SELECT
    p.id,
    '0012345673',
    p.nama_lengkap,
    'L',
    k.id,
    'Budi Santoso',
    'Karyawan Swasta',
    'Siti Rahayu',
    'Ibu Rumah Tangga',
    'Aktif'
FROM profil p
CROSS JOIN kelas k
WHERE p.email = 'siswa3@sekolah.sch.id'
AND k.nama = 'VIII-A';

INSERT INTO siswa (profil_id, nisn, nama, jenis_kelamin, kelas_id, nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, status)
SELECT
    p.id,
    '0012345674',
    p.nama_lengkap,
    'P',
    k.id,
    'Ir. Wijaya',
    'Pengusaha',
    'Ira Marlina',
    'Dokter',
    'Aktif'
FROM profil p
CROSS JOIN kelas k
WHERE p.email = 'siswa4@sekolah.sch.id'
AND k.nama = 'VIII-B';

INSERT INTO siswa (profil_id, nisn, nama, jenis_kelamin, kelas_id, nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, status)
SELECT
    p.id,
    '0012345675',
    p.nama_lengkap,
    'L',
    k.id,
    'Agus Setiawan',
    'Petani',
    'Siti Fatimah',
    'Ibu Rumah Tangga',
    'Aktif'
FROM profil p
CROSS JOIN kelas k
WHERE p.email = 'siswa5@sekolah.sch.id'
AND k.nama = 'IX-A';

-- 8. Insert Informasi Sample
INSERT INTO informasi (judul, konten, kategori, published_by, is_published)
SELECT
    'Pengumuman Libur Nasional',
    'Diberitahukan kepada seluruh warga sekolah bahwa besok akan libur nasional dalam rangka hari besar agama. KBM akan diliburkan.',
    'Pengumuman',
    p.id,
    TRUE
FROM profil p
WHERE p.role = 'admin'
LIMIT 1;

INSERT INTO informasi (judul, konten, kategori, published_by, is_published)
SELECT
    'Rapat Orang Tua/Wali',
    'Akan diadakan rapat orang tua/wali siswa pada hari Sabtu, 15 Juni 2026 pukul 08.00 WIB di aula sekolah.',
    'Agenda',
    p.id,
    TRUE
FROM profil p
WHERE p.role = 'admin'
LIMIT 1;

-- 9. Insert Jadwal Pelajaran Sample
INSERT INTO jadwal_pelajaran (kelas_id, mata_pelajaran_id, guru_id, hari, jam_mulai, jam_selesai, semester, tahun_ajaran)
SELECT
    k.id,
    m.id,
    g.id,
    'Senin',
    '07:00',
    '08:30',
    'Ganjil',
    '2025/2026'
FROM kelas k, mata_pelajaran m, guru g
WHERE k.nama = 'VII-A'
AND m.nama = 'Matematika'
AND g.nuptk = '198501012010011001';

INSERT INTO jadwal_pelajaran (kelas_id, mata_pelajaran_id, guru_id, hari, jam_mulai, jam_selesai, semester, tahun_ajaran)
SELECT
    k.id,
    m.id,
    g.id,
    'Senin',
    '08:30',
    '10:00',
    'Ganjil',
    '2025/2026'
FROM kelas k, mata_pelajaran m, guru g
WHERE k.nama = 'VII-A'
AND m.nama = 'Bahasa Indonesia'
AND g.nuptk = '198501022010012002';

INSERT INTO jadwal_pelajaran (kelas_id, mata_pelajaran_id, guru_id, hari, jam_mulai, jam_selesai, semester, tahun_ajaran)
SELECT
    k.id,
    m.id,
    g.id,
    'Senin',
    '10:15',
    '11:45',
    'Ganjil',
    '2025/2026'
FROM kelas k, mata_pelajaran m, guru g
WHERE k.nama = 'VII-A'
AND m.nama = 'Ilmu Pengetahuan Alam'
AND g.nuptk = '198501032010013003';

-- 10. Insert Nilai Sample
INSERT INTO nilai (siswa_id, mata_pelajaran_id, semester, tahun_ajaran, nilai_tugas, nilai_uts, nilai_uas, nilai_akhir, grade)
SELECT
    s.id,
    m.id,
    'Ganjil',
    '2025/2026',
    85,
    80,
    88,
    84.67,
    'B'
FROM siswa s, mata_pelajaran m
WHERE s.nisn = '0012345671'
AND m.nama = 'Matematika';

INSERT INTO nilai (siswa_id, mata_pelajaran_id, semester, tahun_ajaran, nilai_tugas, nilai_uts, nilai_uas, nilai_akhir, grade)
SELECT
    s.id,
    m.id,
    'Ganjil',
    '2025/2026',
    90,
    88,
    92,
    90.00,
    'A'
FROM siswa s, mata_pelajaran m
WHERE s.nisn = '0012345671'
AND m.nama = 'Bahasa Indonesia';

-- 11. Insert Presensi Sample
INSERT INTO presensi (siswa_id, tanggal, status, keterangan)
SELECT
    s.id,
    CURRENT_DATE,
    'Hadir',
    NULL
FROM siswa s
WHERE s.nisn = '0012345671';

INSERT INTO presensi (siswa_id, tanggal, status, keterangan)
SELECT
    s.id,
    CURRENT_DATE,
    'Hadir',
    NULL
FROM siswa s
WHERE s.nisn = '0012345672';

INSERT INTO presensi (siswa_id, tanggal, status, keterangan)
SELECT
    s.id,
    CURRENT_DATE - 1,
    'Sakit',
    'Izin sakit'
FROM siswa s
WHERE s.nisn = '0012345673';

-- ============================================
-- VERIFIKASI DATA
-- ============================================
SELECT 'Mata Pelajaran' as tabel, COUNT(*) as jumlah FROM mata_pelajaran
UNION ALL
SELECT 'Kelas', COUNT(*) FROM kelas
UNION ALL
SELECT 'Profil', COUNT(*) FROM profil
UNION ALL
SELECT 'Guru', COUNT(*) FROM guru
UNION ALL
SELECT 'Siswa', COUNT(*) FROM siswa
UNION ALL
SELECT 'Jadwal', COUNT(*) FROM jadwal_pelajaran
UNION ALL
SELECT 'Nilai', COUNT(*) FROM nilai
UNION ALL
SELECT 'Presensi', COUNT(*) FROM presensi
UNION ALL
SELECT 'Informasi', COUNT(*) FROM informasi;
