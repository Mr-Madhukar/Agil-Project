/* ======================================================
   US#5 – Package Search & Filter JS (packages.js)
   ====================================================== */

(function () {
    'use strict';

    const searchInput = document.getElementById('pkgSearch');
    const clearBtn = document.getElementById('searchClear');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.pkg-card');
    const noResults = document.getElementById('noResults');

    let currentCategory = 'all';
    let currentQuery = '';
    let allPackages = [];

    const packagesGrid = document.getElementById('packagesGrid');

    /* ---- Render packages ---- */
    function renderPackages(packages) {
        if (!packagesGrid) return;
        packagesGrid.innerHTML = '';

        if (packages.length === 0) {
            noResults.classList.add('show');
        } else {
            noResults.classList.remove('show');
            packages.forEach(pkg => {
                // Ensure photo is valid, or put a placeholder
                const img = pkg.image_url || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80`;
                
                const card = document.createElement('div');
                card.className = 'pkg-card';
                card.dataset.category = pkg.category.toLowerCase();

                card.innerHTML = `
                    <div class="pkg-img-wrap">
                        <img src="${img}" alt="${pkg.destination}" loading="lazy" />
                        <span class="pkg-badge">${pkg.duration}</span>
                        <span class="pkg-price-tag">${pkg.price_inr}</span>
                    </div>
                    <div class="pkg-body">
                        <div class="pkg-header">
                            <h3 class="pkg-card-title">${pkg.destination}</h3>
                            <div class="pkg-rating">
                                <i class="fas fa-star" style="color:#ffc107"></i>
                                <span>(${pkg.rating || 0})</span>
                            </div>
                        </div>
                        <div class="pkg-meta">
                            <span class="pkg-location"><i class="fas fa-map-marker-alt"></i> ${pkg.destination}</span>
                        </div>
                        <p class="pkg-desc">${pkg.description || 'Enjoy a wonderful trip to ' + pkg.destination}</p>
                        <a href="book.html?package=${pkg.id}" class="btn-book-now">Book Now <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
                packagesGrid.appendChild(card);
            });
        }
    }

    /* ---- Fetch packages from API ---- */
    async function fetchPackages() {
        try {
            const res = await fetch('http://localhost:5000/api/packages');
            if (res.ok) {
                allPackages = await res.json();
                applyFilters();
            } else {
                packagesGrid.innerHTML = '<p>Failed to load packages.</p>';
            }
        } catch (err) {
            console.error(err);
            if(packagesGrid) packagesGrid.innerHTML = '<p>Network error loading packages.</p>';
        }
    }

    /* ---- Apply combined filter + search ---- */
    function applyFilters() {
        const filtered = allPackages.filter(pkg => {
            const category = (pkg.category || '').toLowerCase();
            const title = (pkg.destination || '').toLowerCase();
            const desc = (pkg.description || '').toLowerCase();
            const combined = title + ' ' + desc;

            const matchCat = currentCategory === 'all' || category === currentCategory;
            const matchStr = currentQuery === '' || combined.includes(currentQuery);

            return matchCat && matchStr;
        });

        renderPackages(filtered);
    }

    /* ---- Search input ---- */
    searchInput.addEventListener('input', function () {
        currentQuery = this.value.trim().toLowerCase();
        clearBtn.classList.toggle('show', currentQuery.length > 0);
        applyFilters();
    });

    clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        currentQuery = '';
        clearBtn.classList.remove('show');
        searchInput.focus();
        applyFilters();
    });

    /* ---- Category filter buttons ---- */
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.filter;
            applyFilters();
        });
    });

    /* ---- Hamburger + Backdrop ---- */
    const burger = document.getElementById('burger');
    const menu = document.getElementById('navMenu');
    const backdrop = document.getElementById('navBackdrop');

    function openMenu() {
        menu.classList.add('open');
        burger.classList.add('open');
        burger.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (burger && menu) {
        burger.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
        if (backdrop) backdrop.addEventListener('click', closeMenu);
        menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    }

    /* ---- Back to top ---- */
    const backTop = document.getElementById('backTop');
    if (backTop) {
        window.addEventListener('scroll', () => {
            backTop.classList.toggle('show', window.scrollY > 300);
        });
        backTop.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Initialize list
    fetchPackages();
})();
