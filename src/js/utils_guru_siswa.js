/**
 * SAIS - Guru/Siswa Dashboard Utilities
 * Contains common JavaScript functions for Guru and Siswa dashboards.
 */

// Global Logout Utility
function handleLogout() {
    localStorage.removeItem('sais_current_user');
    window.location.href = 'index.html';
}

// Profile Overlay Toggle Utility
function toggleProfile() {
    const overlay = document.getElementById('profileOverlay');
    if (overlay.style.display === 'flex') {
        overlay.style.animation = 'slideDown 0.3s ease-in forwards';
        setTimeout(() => { 
            overlay.style.display = 'none';
            overlay.style.animation = 'slideUp 0.3s ease-out';
        }, 300);
    } else {
        overlay.style.display = 'flex';
    }
}

// Add slideDown animation to CSS dynamically if it doesn't exist
// This is needed because slideDown is used in toggleProfile
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('style#slideDownAnim')) {
        const style = document.createElement('style');
        style.id = 'slideDownAnim';
        style.innerHTML = `@keyframes slideDown { from { transform: translateY(0); } to { transform: translateY(100%); } }`;
        document.head.appendChild(style);
    }
});

// Common User Info Loading Logic
function loadUserInfo(userType) {
    const raw = JSON.parse(localStorage.getItem('sais_current_user') || '{}');
    const currentUser = raw.user || raw;
    let userNama, userId, userLabel, initial, welcomeTextPrefix;

    if (userType === 'guru') {
        userNama = currentUser.nama || 'Guru SAIS';
        userId = currentUser.nuptk || '-';
        userLabel = 'NUPTK: ';
        initial = (userNama || 'G').charAt(0).toUpperCase();
        welcomeTextPrefix = 'Selamat Pagi';
    } else if (userType === 'siswa') {
        userNama = currentUser.nama || 'Siswa SAIS';
        userId = currentUser.nisn || '-';
        userLabel = 'NISN: ';
        initial = (userNama || 'S').charAt(0).toUpperCase();
        welcomeTextPrefix = 'Halo';
    }

    // Update UI Elements - Top Bar
    document.getElementById('userNamaTop').textContent = userNama;
    document.getElementById(userType === 'guru' ? 'userNuptkTop' : 'userNisnTop').textContent = userLabel + userId;
    document.getElementById('userAvatarTop').textContent = initial;
    
    // Update Profile Overlay
    document.getElementById('bigAvatar').textContent = initial;
    document.getElementById('fullNama').textContent = userNama;
    document.getElementById(userType === 'guru' ? 'fullNuptk' : 'fullNisn').textContent = userLabel + userId;

    // Welcome Text
    const now = new Date();
    const hour = now.getHours();
    let greeting;

    if (hour < 12) { greeting = "Pagi"; } 
    else if (hour < 15) { greeting = "Siang"; }
    else if (hour < 18) { greeting = "Sore"; }
    else { greeting = "Malam"; }

    document.getElementById('welcomeText').textContent = `${welcomeTextPrefix}, ${userNama.split(' ')[0]}! 👋`;

    // Specific for Guru
    if (userType === 'guru' && currentUser.mapel) {
        document.getElementById('fullMapel').textContent = currentUser.mapel;
    }
    // Specific for Siswa
    if (userType === 'siswa' && currentUser.kelas) {
        document.getElementById('fullKelas').textContent = 'Kelas ' + currentUser.kelas;
    }
}

// Check if Guru is a Wali Kelas
async function checkWaliKelas(guruNama) {
    try {
        const classes = await window.db.getAllKelas();
        const myClass = classes.find(k => k.wali === guruNama);
        if (myClass) {
            const menuKelasSaya = document.getElementById('menuKelasSaya');
            if (menuKelasSaya) {
                menuKelasSaya.style.display = 'flex';
            }
        }
    } catch (e) {
        console.error("Error checking Wali Kelas status:", e);
    }
}
