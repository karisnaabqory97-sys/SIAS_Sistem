/**
 * SAIS - Sidebar Loader Utility
 * Dynamically includes the admin sidebar and highlights the active page.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    // Detect which sidebar to load based on URL
    const pathname = window.location.pathname.toLowerCase();
    let sidebarFile = 'sidebar_admin.html';
    
    if (pathname.includes('_guru')) {
        sidebarFile = 'sidebar_guru.html';
    } else if (pathname.includes('_siswa')) {
        sidebarFile = 'sidebar_siswa.html';
    }

    try {
        const response = await fetch(sidebarFile);
        if (!response.ok) throw new Error('Failed to load sidebar');
        
        const html = await response.text();
        container.innerHTML = html;

        // 1. Highlight Active Page
        const currentPage = document.body.getAttribute('data-page');
        if (currentPage) {
            const activeLink = container.querySelector(`[data-page="${currentPage}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }

        // 2. Setup Logout Handler
        const logoutBtn = container.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                handleLogout();
            });
        }

        // 3. Mobile Menu Toggle Setup
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) sidebar.classList.toggle('active');
            });
        }

        // 4. Specific for Guru (Wali Kelas check)
        if (sidebarFile === 'sidebar_guru.html') {
            const user = JSON.parse(localStorage.getItem('sais_current_user') || '{}');
            if (user.nama) {
                const classes = await window.db.getAllKelas();
                const isWali = classes.some(k => k.wali === user.nama);
                if (isWali) {
                    const menuKelasSaya = document.getElementById('sidebarMenuKelasSaya');
                    if (menuKelasSaya) menuKelasSaya.style.display = 'flex';
                }
            }
        }

    } catch (error) {
        console.error('Sidebar error:', error);
    }
});

/**
 * Global Logout Utility
 */
function handleLogout() {
    localStorage.removeItem('sais_current_user');
    window.location.href = 'index.html';
}
