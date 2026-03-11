// auth-nav.js - Handles dynamic navigation based on user authentication state

document.addEventListener('DOMContentLoaded', () => {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    // Determine active page
    const currentPath = window.location.pathname;
    const isHome = currentPath.endsWith('/') || currentPath.endsWith('index.html');
    const isPackages = currentPath.endsWith('packages.html');
    const isBook = currentPath.endsWith('book.html');
    
    const activeClass = (check) => check ? 'class="active"' : '';

    if (token && userStr) {
        const userObj = JSON.parse(userStr);
        const isAdmin = userObj.role === 'admin';

        let navHTML = `
            <li><a href="index.html" ${activeClass(isHome)}><i class="fas fa-home"></i> Home</a></li>
            <li><a href="packages.html" ${activeClass(isPackages)}><i class="fas fa-suitcase"></i> Packages</a></li>
            <li><a href="book.html" ${activeClass(isBook)}><i class="fas fa-plane"></i> Book a Trip</a></li>
        `;

        // If admin, show admin panel link
        if (isAdmin) {
            const isAdminPage = currentPath.endsWith('admin.html');
            navHTML += `<li><a href="admin.html" ${activeClass(isAdminPage)}><i class="fas fa-user-shield"></i> Admin Panel</a></li>`;
        }

        // Always show profile and logout for authenticated users
        const isProfile = currentPath.endsWith('profile.html');
        navHTML += `
            <li><a href="profile.html" ${activeClass(isProfile)}><i class="fas fa-user-circle"></i> Profile</a></li>
            <li><a href="#" id="navLogoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        `;

        navMenu.innerHTML = navHTML;

        // Attach logout event listener
        const logoutBtn = document.getElementById('navLogoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            });
        }
    } else {
        // Guest layout
        const isSignup = currentPath.endsWith('signup.html');
        navMenu.innerHTML = `
            <li><a href="index.html" ${activeClass(isHome)}><i class="fas fa-home"></i> Home</a></li>
            <li><a href="packages.html" ${activeClass(isPackages)}><i class="fas fa-suitcase"></i> Packages</a></li>
            <li><a href="book.html" ${activeClass(isBook)}><i class="fas fa-plane"></i> Book a Trip</a></li>
            <li><a href="signup.html" ${activeClass(isSignup)}><i class="fas fa-user-plus"></i> Sign Up / Login</a></li>
        `;
    }
});
