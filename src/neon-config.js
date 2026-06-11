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
    API_URL: '/api/db',
    // API_KEY: Digunakan untuk autentikasi ke Vercel Serverless Function
    // Kosongkan jika tidak menggunakan proteksi API Key di sisi server
    API_KEY: window.localStorage.getItem('sais_api_key') || '' 
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
        const headers = { 'Content-Type': 'application/json' };
        if (CONFIG.API_KEY) {
            headers['x-api-key'] = CONFIG.API_KEY;
        }

        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: headers,
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

        const headers = {};
        if (CONFIG.API_KEY) {
            headers['x-api-key'] = CONFIG.API_KEY;
        }

        const response = await fetch(url, { headers });
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
            return await apiGet('kelas');
        }
        const data = Storage.get('kelas_data');
        return data || [];
    },

    async insertKelas(kelas) {
        if (isProduction) {
            return await apiCall('kelas', 'insert', kelas);
        }
        const data = Storage.get('kelas_data') || [];
        if (!kelas.id) {
            kelas.id = 'kelas_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        data.push(kelas);
        Storage.set('kelas_data', data);
        return kelas;
    },

    async updateKelas(id, kelas) {
        if (isProduction) {
            return await apiCall('kelas', 'update', { ...kelas, id });
        }
        const data = Storage.get('kelas_data') || [];
        const index = data.findIndex(k => k.id === id);
        if (index >= 0) {
            data[index] = { ...data[index], ...kelas };
            Storage.set('kelas_data', data);
            return data[index];
        }
        return null;
    },

    async deleteKelas(id) {
        if (isProduction) {
            return await apiCall('kelas', 'delete', { id });
        }
        const data = Storage.get('kelas_data') || [];
        const filtered = data.filter(k => k.id !== id);
        Storage.set('kelas_data', filtered);
        return true;
    },

    // ==================== MATA PELAJARAN ====================

    async getAllMapel() {
        if (isProduction) {
            return await apiGet('mapel');
        }
        const data = Storage.get('mapel_data');
        return data || [];
    },

    async insertMapel(mapel) {
        if (isProduction) {
            return await apiCall('mapel', 'insert', mapel);
        }
        const data = Storage.get('mapel_data') || [];
        if (!mapel.id) {
            mapel.id = 'mapel_' + Date.now();
        }
        data.push(mapel);
        Storage.set('mapel_data', data);
        return mapel;
    },

    async updateMapel(id, mapel) {
        if (isProduction) {
            return await apiCall('mapel', 'update', { ...mapel, id });
        }
        const data = Storage.get('mapel_data') || [];
        const index = data.findIndex(m => m.id === id);
        if (index >= 0) {
            data[index] = { ...data[index], ...mapel };
            Storage.set('mapel_data', data);
            return data[index];
        }
        return null;
    },

    async deleteMapel(id) {
        if (isProduction) {
            return await apiCall('mapel', 'delete', { id });
        }
        const data = Storage.get('mapel_data') || [];
        const filtered = data.filter(m => m.id !== id);
        Storage.set('mapel_data', filtered);
        return true;
    },

    // ==================== ADMIN LOGIN ====================

    async verifyAdminLogin(username, password) {
        if (isProduction) {
            const result = await apiCall('login', 'verify', { username, password, role: 'admin' });
            return result && result.length > 0 ? result[0] : null;
        }
        // Development mode: cek dari localStorage
        const data = Storage.get('admin_data');
        if (!data) return null;
        return data.username === username && data.password === password ? data : null;
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

    async upsertJadwal(kelas, semester, jadwalItems) {
        if (isProduction) {
            return await apiCall('jadwal', 'upsert', { kelas, semester, items: jadwalItems });
        }
        
        let allJadwal = Storage.get('jadwal_data') || [];
        // Remove old schedule for this class and semester
        allJadwal = allJadwal.filter(j => !(j.kelas === kelas && j.semester === semester));
        
        // Add new items
        const newEntries = jadwalItems.map(item => ({
            id: 'jdw_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            kelas,
            semester,
            ...item,
            updated_at: new Date().toISOString()
        }));
        
        allJadwal.push(...newEntries);
        Storage.set('jadwal_data', allJadwal);
        return true;
    },

    async getJadwalByGuru(namaGuru) {
        if (isProduction) {
            return await apiGet('jadwal', { guru: namaGuru });
        }
        const allJadwal = Storage.get('jadwal_data') || [];
        // In this logic, guru info comes from the 'pengampu' assignment saved in the schedule item
        return allJadwal.filter(j => j.guru === namaGuru);
    },

    // ==================== NILAI ====================
    async getAllNilai() {
        if (isProduction) {
            return await apiGet('nilai');
        }
        return Storage.get('nilai_data') || [];
    },

    async getNilaiByFilter(kelas, mapel, jenis) {
        if (isProduction) {
            return await apiGet('nilai', { kelas, mapel, jenis });
        }
        const data = Storage.get('nilai_data') || [];
        return data.filter(n => n.kelas === kelas && n.mapel === mapel && n.jenis_ujian === jenis);
    },

    async upsertNilai(nilaiData) {
        const records = Array.isArray(nilaiData) ? nilaiData : [nilaiData];
        if (isProduction) {
            return await apiCall('nilai', 'upsert', records);
        }
        const data = Storage.get('nilai_data') || [];
        records.forEach(rec => {
            const idx = data.findIndex(n => n.nisn === rec.nisn && n.mapel === rec.mapel && n.jenis_ujian === rec.jenis_ujian);
            if (idx > -1) data[idx] = { ...data[idx], ...rec, updated_at: new Date().toISOString() };
            else data.push({ ...rec, id: Date.now() + Math.random(), created_at: new Date().toISOString() });
        });
        Storage.set('nilai_data', data);
        return { success: true };
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
        if (isProduction) {
            return await apiGet('presensi');
        }
        return Storage.get('presensi_data') || [];
    },

    async getPresensiByFilter(kelas, mapel) {
        if (isProduction) {
            return await apiGet('presensi', { kelas, mapel });
        }
        const data = Storage.get('presensi_data') || [];
        return data.filter(p => p.kelas === kelas && p.mapel === mapel);
    },

    async getPresensiBySiswa(nisn) {
        if (isProduction) {
            return await apiGet('presensi', { nisn });
        }
        const data = Storage.get('presensi_data') || [];
        return data.filter(p => p.nisn === nisn);
    },

    async upsertPresensi(presensi) {
        // Handle single or array of attendance records
        const records = Array.isArray(presensi) ? presensi : [presensi];
        
        if (isProduction) {
            return await apiCall('presensi', 'upsert', records);
        }

        const data = Storage.get('presensi_data') || [];
        records.forEach(newRec => {
            // Find existing record for same student, class, mapel, and meeting
            const idx = data.findIndex(r => 
                r.nisn === newRec.nisn && 
                r.mapel === newRec.mapel && 
                r.pertemuan === newRec.pertemuan
            );

            if (idx >= 0) {
                data[idx] = { ...data[idx], ...newRec, updated_at: new Date().toISOString() };
            } else {
                newRec.id = 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
                newRec.created_at = new Date().toISOString();
                data.push(newRec);
            }
        });

        Storage.set('presensi_data', data);
        return true;
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

// ============================================
// GLOBAL ROUTE PROTECTION & LOGOUT HANDLER
// ============================================

(function() {
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('SW Registered!', reg.scope))
                .catch(err => console.log('SW Register Error:', err));
        });
    }

    const pathname = window.location.pathname;
    const currentPage = pathname.split('/').pop() || 'index.html';
    
    // Pages that don't require login
    const guestPages = ['index.html', ''];
    
    if (!guestPages.includes(currentPage)) {
        const session = window.Session.get();
        if (!session) {
            console.warn('Unauthorized access! Redirecting to login...');
            window.location.href = 'index.html';
            return;
        }
        
        // Role-based restrictions
        const role = session.type; // 'admin', 'guru', or 'siswa'
        
        if (role === 'siswa') {
            // Students can only access student pages
            if (!currentPage.includes('_siswa') && currentPage !== 'index.html') {
                console.warn('Students are not allowed on admin/guru pages! Redirecting to student dashboard...');
                window.location.href = 'dashboard_siswa.html';
            }
        } else if (role === 'guru') {
            // Teachers can only access teacher pages
            if (!currentPage.includes('_guru') && currentPage !== 'index.html') {
                console.warn('Teachers are not allowed on admin/siswa pages! Redirecting to teacher dashboard...');
                window.location.href = 'dashboard_guru.html';
            }
        } else if (role === 'admin') {
            // Admins should not access student or teacher pages
            if (currentPage.includes('_siswa') || currentPage.includes('_guru')) {
                console.warn('Admins are redirected to admin dashboard...');
                window.location.href = 'dashboard.html';
            }
        }
    } else {
        // If logged in and trying to access index.html, redirect to their respective dashboard
        const session = window.Session.get();
        if (session) {
            const role = session.type;
            if (role === 'siswa') window.location.href = 'dashboard_siswa.html';
            else if (role === 'guru') window.location.href = 'dashboard_guru.html';
            else if (role === 'admin') window.location.href = 'dashboard.html';
        }
    }

    // Intercept clicks on any logout-link element to clear session and sync branding
    document.addEventListener('DOMContentLoaded', () => {
        // Run global branding synchronization
        try {
            const appName = localStorage.getItem('sais_appName') || 'SAIS';
            const schoolName = localStorage.getItem('sais_schoolName') || 'Sistem Informasi SMP';
            const logo = localStorage.getItem('sais_logo');

            // 1. If we are on the login page (index.html or /), update title, logo and headings
            const pathname = window.location.pathname.toLowerCase();
            const isLoginPage = pathname.endsWith('index.html') || pathname.endsWith('/') || pathname === '';
            
            if (isLoginPage && !pathname.includes('_')) {
                document.title = `Login | ${appName} - ${schoolName}`;

                const appNameHeading = document.querySelector('.logo-section h1');
                if (appNameHeading) {
                    appNameHeading.textContent = appName;
                }

                const schoolSubtitle = document.querySelector('.logo-section p.subtitle');
                if (schoolSubtitle) {
                    schoolSubtitle.textContent = schoolName;
                }

                const logoIcon = document.querySelector('.logo-icon');
                if (logoIcon) {
                    if (logo) {
                        logoIcon.innerHTML = `<img src="${logo}" alt="Logo" style="max-width: 80%; max-height: 80%; object-fit: contain; border-radius: 12px;">`;
                        logoIcon.style.background = 'transparent';
                        logoIcon.style.boxShadow = 'none';
                    } else {
                        logoIcon.textContent = appName.charAt(0).toUpperCase();
                        logoIcon.style.background = 'var(--primary)';
                    }
                }
            }

            // 2. Sync sidebar branding on all dashboard/admin/siswa/guru pages
            if (!isLoginPage || pathname.includes('_')) {
                const sidebarLogoSection = document.querySelector('aside .logo-section, .sidebar .sidebar-logo, .logo-section');
                if (sidebarLogoSection) {
                    // Update Logo Box
                    const logoBox = sidebarLogoSection.querySelector('.logo-box, .avatar');
                    if (logoBox) {
                        if (logo) {
                            logoBox.innerHTML = `<img src="${logo}" alt="Logo" style="max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 4px;">`;
                            logoBox.style.background = 'transparent';
                        } else {
                            logoBox.textContent = appName.charAt(0).toUpperCase();
                            logoBox.style.background = 'var(--primary)';
                        }
                    }

                    // Update Brand Text
                    const brandTextSpan = sidebarLogoSection.querySelector('span, .brand-text');
                    if (brandTextSpan) {
                        let suffix = '';
                        const currentPage = pathname.split('/').pop() || '';
                        if (currentPage.includes('guru')) suffix = ' Guru';
                        else if (currentPage.includes('siswa')) suffix = ' Siswa';
                        else if (currentPage && !currentPage.includes('guru') && !currentPage.includes('siswa')) suffix = ' Admin';
                        
                        brandTextSpan.textContent = appName + suffix;
                    }
                }
            }

            // 3. Register PWA Manifest and Service Worker dynamically
            try {
                const pwaIcon = localStorage.getItem('sais_pwa') || '';
                
                const manifest = {
                    "name": `${appName} - ${schoolName}`,
                    "short_name": appName,
                    "start_url": "index.html",
                    "display": "standalone",
                    "background_color": "#0f172a",
                    "theme_color": "#2563eb",
                    "orientation": "any",
                    "icons": [
                        {
                            "src": pwaIcon || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' rx='128' fill='%232563eb'/%3E%3Ctext x='50%25' y='55%25' font-size='256' font-family='Poppins, sans-serif' font-weight='bold' fill='white' dominant-baseline='middle' text-anchor='middle'%3ES%3C/text%3E%3C/svg%3E",
                            "sizes": "512x512",
                            "type": "image/png",
                            "purpose": "any maskable"
                        }
                    ]
                };

                const stringManifest = JSON.stringify(manifest);
                const blob = new Blob([stringManifest], {type: 'application/json'});
                const manifestURL = URL.createObjectURL(blob);

                let manifestLink = document.querySelector('link[rel="manifest"]');
                if (!manifestLink) {
                    manifestLink = document.createElement('link');
                    manifestLink.rel = 'manifest';
                    document.head.appendChild(manifestLink);
                }
                manifestLink.href = manifestURL;

                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('sw.js').then(reg => {
                        console.log('Service Worker Registered successfully', reg.scope);
                    }).catch(err => {
                        console.warn('Service Worker registration failed:', err);
                    });
                }
            } catch (errPwa) {
                console.error("Error setting up PWA:", errPwa);
            }
        } catch (e) {
            console.error("Error synchronizing global branding:", e);
        }

        document.addEventListener('click', (e) => {
            if (e.target.closest('.logout-link')) {
                console.log('Logging out... clearing session.');
                window.Session.clear();
            }
        });
    });
})();
