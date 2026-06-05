/**
 * SAIS - Sidebar Loader Utility
 * Dynamically includes the admin sidebar and highlights the active page.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    try {
        const response = await fetch('sidebar_admin.html');
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
        const logoutBtn = document.getElementById('sidebarLogoutBtn');
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
