// ============================================
// Konfigurasi Database Neon untuk SAIS
// ============================================
//
// Strategi:
// 1. Development: Data disimpan di localStorage
// 2. Production (Vercel): Data menggunakan API routes -> Neon PostgreSQL
//
// ============================================

// Konfigurasi
const CONFIG = {
    APP_NAME: 'SAIS - Sistem Informasi Sekolah',
    VERSION: '2.0.0',
    STORAGE_PREFIX: 'sais_',
    API_URL: '/api/db'
};

// Cek apakah menggunakan Vercel Production
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// Cek apakah Database (Neon) sudah dikonfigurasi via Environment Variable
window.isDatabaseConfigured = function() {
    return isProduction;
};

// Cek apakah menggunakan localStorage
window.isLocalStorageAvailable = function() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
};

// ============================================
// STORAGE HELPERS - LocalStorage
// ============================================

const Storage = {
    get(key) {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_PREFIX + key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Storage.get error:', e);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage.set error:', e);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(CONFIG.STORAGE_PREFIX + key);
            return true;
        } catch (e) {
            return false;
        }
    }
};

// ============================================
// API HELPER - untuk Vercel/Neon
// ============================================

async function apiCall(table, action, data = null) {
    try {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table, action, data })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error);
        }
        return result.data;
    } catch (e) {
        console.error('API call error:', e);
        throw e;
    }
}

async function apiGet(table, params = {}) {
    try {
        const url = new URL(CONFIG.API_URL, window.location.origin);
        url.searchParams.set('table', table);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
        const response = await fetch(url);
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error);
        }
        return result.data;
    } catch (e) {
        console.error('API get error:', e);
        throw e;
    }
}

// ============================================
// DATABASE HELPERS - Hybrid (LocalStorage + Neon)
// ============================================

window.db = {
    // ==================== SISWA ====================

    async getAllSiswa() {
        if (isProduction) {
            return await apiGet('siswa');
        }
        const data = Storage.get('siswa_data');
        return data || [];
    },

    async getSiswaById(id) {
        if (isProduction) {
            const data = await apiGet('siswa');
            return data.find(s => s.id === id) || null;
        }
        const data = Storage.get('siswa_data') || [];
        return data.find(s => s.id === id) || null;
    },

    async getSiswaByNisn(nisn) {
        if (isProduction) {
            const data = await apiGet('siswa');
            return data.find(s => s.nisn === nisn) || null;
        }
        const data = Storage.get('siswa_data') || [];
        return data.find(s => s.nisn === nisn) || null;
    },

    async insertSiswa(siswa) {
        if (isProduction) {
            return await apiCall('siswa', 'insert', siswa);
        }
        const data = Storage.get('siswa_data') || [];
        if (!siswa.id) {
            siswa.id = 'siswa_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        siswa.created_at = new Date().toISOString();
        data.push(siswa);
        Storage.set('siswa_data', data);
        return siswa;
    },

    async updateSiswa(id, siswa) {
        if (isProduction) {
            return await apiCall('siswa', 'update', { ...siswa, id });
        }
        const data = Storage.get('siswa_data') || [];
        const index = data.findIndex(s => s.id === id);
        if (index >= 0) {
            siswa.updated_at = new Date().toISOString();
            data[index] = { ...data[index], ...siswa };
            Storage.set('siswa_data', data);
            return data[index];
        }
        return null;
    },

    async deleteSiswa(id) {
        if (isProduction) {
            return await apiCall('siswa', 'delete', { id });
        }
        const data = Storage.get('siswa_data') || [];
        const filtered = data.filter(s => s.id !== id);
        Storage.set('siswa_data', filtered);
        return true;
    },

    // ==================== GURU ====================

    async getAllGuru() {
        if (isProduction) {
            return await apiGet('guru');
        }
        const data = Storage.get('dataGuru');
        return data || [];
    },

    async getGuruById(id) {
        if (isProduction) {
            const data = await apiGet('guru');
            return data.find(g => g.id === id) || null;
        }
        const data = Storage.get('dataGuru') || [];
        return data.find(g => g.id === id) || null;
    },

    async getGuruByNuptk(nuptk) {
        if (isProduction) {
            const data = await apiGet('guru');
            return data.find(g => g.nuptk === nuptk) || null;
        }
        const data = Storage.get('dataGuru') || [];
        return data.find(g => g.nuptk === nuptk) || null;
    },

    async insertGuru(guru) {
        if (isProduction) {
            return await apiCall('guru', 'insert', guru);
        }
        const data = Storage.get('dataGuru') || [];
        if (!guru.id) {
            guru.id = 'guru_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        guru.created_at = new Date().toISOString();
        data.push(guru);
        Storage.set('dataGuru', data);
        return guru;
    },

    async updateGuru(id, guru) {
        if (isProduction) {
            return await apiCall('guru', 'update', { ...guru, id });
        }
        const data = Storage.get('dataGuru') || [];
        const index = data.findIndex(g => g.id === id);
        if (index >= 0) {
            guru.updated_at = new Date().toISOString();
            data[index] = { ...data[index], ...guru };
            Storage.set('dataGuru', data);
            return data[index];
        }
        return null;
    },

    async deleteGuru(id) {
        if (isProduction) {
            return await apiCall('guru', 'delete', { id });
        }
        const data = Storage.get('dataGuru') || [];
        const filtered = data.filter(g => g.id !== id);
        Storage.set('dataGuru', filtered);
        return true;
    },

    // ==================== KELAS ====================

    async getAllKelas() {
        if (isProduction) {
            const data = await apiGet('kelas');
            return data.map(k => k.nama);
        }
        const data = Storage.get('kelas_data');
        return data || ['VII-A', 'VII-B', 'VIII-A', 'VIII-B', 'IX-A', 'IX-B'];
    },

    // ==================== MATA PELAJARAN ====================

    async getAllMapel() {
        if (isProduction) {
            return await apiGet('mapel');
        }
        const data = Storage.get('mapel_data');
        return data || [
            { id: '1', nama: 'Pendidikan Agama Islam', singkatan: 'PAI' },
            { id: '2', nama: 'Bahasa Indonesia', singkatan: 'B. Indo' },
            { id: '3', nama: 'Matematika', singkatan: 'MTK' },
            { id: '4', nama: 'Ilmu Pengetahuan Alam', singkatan: 'IPA' },
            { id: '5', nama: 'Ilmu Pengetahuan Sosial', singkatan: 'IPS' },
            { id: '6', nama: 'Bahasa Inggris', singkatan: 'B. Inggris' },
            { id: '7', nama: 'Pendidikan Jasmani dan Olahraga', singkatan: 'PJOK' },
            { id: '8', nama: 'Seni Budaya', singkatan: 'Senbud' },
            { id: '9', nama: 'Prakarya', singkatan: 'Prakarya' },
            { id: '10', nama: 'Informatika', singkatan: 'Informatika' }
        ];
    },

    // ==================== ADMIN LOGIN ====================

    async verifyAdminLogin(username, password) {
        if (isProduction) {
            const result = await apiCall('login', 'verify', { username, password, role: 'admin' });
            return result && result.length > 0 ? result[0] : null;
        }
        const demoAdmin = { username: 'admin', password: 'admin123', nama: 'Administrator' };
        if (username === demoAdmin.username && password === demoAdmin.password) {
            return demoAdmin;
        }
        return null;
    },

    async verifyGuruLogin(username, password) {
        if (isProduction) {
            const result = await apiCall('login', 'verify', { username, password, role: 'guru' });
            return result && result.length > 0 ? result[0] : null;
        }
        const guruData = Storage.get('dataGuru') || [];
        return guruData.find(g =>
            (g.username === username || g.nuptk === username) &&
            g.password === password &&
            g.status === 'Aktif'
        ) || null;
    },

    async verifySiswaLogin(username, password) {
        if (isProduction) {
            const result = await apiCall('login', 'verify', { username, password, role: 'siswa' });
            return result && result.length > 0 ? result[0] : null;
        }
        const siswaData = Storage.get('siswa_data') || [];
        return siswaData.find(s =>
            (s.username === username || s.nisn === username) &&
            s.password === password &&
            s.status === 'Aktif'
        ) || null;
    },

    // ==================== STATISTIK ====================

    async getDashboardStats() {
        if (isProduction) {
            const stats = await apiGet('siswa', { action: 'stats' });
            const guruData = await apiGet('guru');
            return {
                totalSiswa: parseInt(stats[0]?.total_siswa || 0),
                totalGuru: guruData.length,
                totalKelas: parseInt(stats[0]?.total_kelas || 0)
            };
        }
        const siswaData = Storage.get('siswa_data') || [];
        const guruData = Storage.get('dataGuru') || [];
        const kelasSet = new Set(siswaData.map(s => s.kelas).filter(k => k));
        return {
            totalSiswa: siswaData.length,
            totalGuru: guruData.length,
            totalKelas: kelasSet.size
        };
    },

    // ==================== INFORMASI ====================

    async getAllInformasi() {
        if (isProduction) {
            return await apiGet('informasi');
        }
        const data = Storage.get('informasi_data') || [];
        return data.filter(i => i.is_published);
    },

    async getInformasiById(id) {
        if (isProduction) {
            const data = await apiGet('informasi');
            return data.find(i => i.id === id) || null;
        }
        const data = Storage.get('informasi_data') || [];
        return data.find(i => i.id === id) || null;
    },

    async insertInformasi(info) {
        if (isProduction) {
            return await apiCall('informasi', 'insert', info);
        }
        const data = Storage.get('informasi_data') || [];
        if (!info.id) {
            info.id = 'info_' + Date.now();
        }
        info.created_at = new Date().toISOString();
        info.is_published = true;
        data.unshift(info);
        Storage.set('informasi_data', data);
        return info;
    },

    async updateInformasi(id, info) {
        if (isProduction) {
            return await apiCall('informasi', 'update', { ...info, id });
        }
        const data = Storage.get('informasi_data') || [];
        const index = data.findIndex(i => i.id === id);
        if (index >= 0) {
            info.updated_at = new Date().toISOString();
            data[index] = { ...data[index], ...info };
            Storage.set('informasi_data', data);
            return data[index];
        }
        return null;
    },

    async deleteInformasi(id) {
        if (isProduction) {
            return await apiCall('informasi', 'delete', { id });
        }
        const data = Storage.get('informasi_data') || [];
        const filtered = data.filter(i => i.id !== id);
        Storage.set('informasi_data', filtered);
        return true;
    },

    // ==================== JADWAL ====================

    async getAllJadwal() {
        if (isProduction) {
            return await apiGet('jadwal');
        }
        return Storage.get('jadwal_data') || [];
    },

    async getJadwalByKelas(kelas) {
        if (isProduction) {
            return await apiGet('jadwal', { kelas });
        }
        const data = Storage.get('jadwal_data') || [];
        return data.filter(j => j.kelas === kelas);
    },

    // ==================== NILAI ====================

    async getAllNilai() {
        if (isProduction) {
            return await apiGet('nilai');
        }
        return Storage.get('nilai_data') || [];
    },

    async getNilaiBySiswa(siswaId) {
        if (isProduction) {
            return await apiGet('nilai', { siswa_id: siswaId });
        }
        const data = Storage.get('nilai_data') || [];
        return data.filter(n => n.siswa_id === siswaId);
    },

    // ==================== PRESENSI ====================

    async getAllPresensi() {
        return Storage.get('presensi_data') || [];
    },

    async getPresensiBySiswa(siswaId) {
        const data = Storage.get('presensi_data') || [];
        return data.filter(p => p.siswa_id === siswaId);
    },

    async insertPresensi(presensi) {
        const data = Storage.get('presensi_data') || [];
        if (!presensi.id) {
            presensi.id = 'presensi_' + Date.now();
        }
        presensi.created_at = new Date().toISOString();
        data.push(presensi);
        Storage.set('presensi_data', data);
        return presensi;
    }
};

// ============================================
// SESSION HELPERS
// ============================================

window.Session = {
    set(user, type) {
        const sessionData = {
            type: type,
            user: user,
            loginAt: new Date().toISOString()
        };
        Storage.set('current_user', sessionData);
    },

    get() {
        return Storage.get('current_user');
    },

    clear() {
        Storage.remove('current_user');
    },

    isLoggedIn() {
        return !!Storage.get('current_user');
    }
};

// ============================================
// INITIALIZATION
// ============================================

console.log('='.repeat(50));
console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION}`);
console.log('Mode:', isProduction ? 'Production (Neon)' : 'Development (LocalStorage)');
console.log('API:', isProduction ? CONFIG.API_URL : 'Disabled');
console.log('='.repeat(50));
