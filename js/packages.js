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

    /* ---- Apply combined filter + search ---- */
    function applyFilters() {
        let visibleCount = 0;

        cards.forEach(card => {
            const category = card.dataset.category || '';
            const title = (card.querySelector('.pkg-card-title')?.textContent || '').toLowerCase();
            const location = (card.querySelector('.pkg-location')?.textContent || '').toLowerCase();
            const desc = (card.querySelector('.pkg-desc')?.textContent || '').toLowerCase();
            const combined = title + ' ' + location + ' ' + desc;

            const matchCat = currentCategory === 'all' || category === currentCategory;
            const matchStr = currentQuery === '' || combined.includes(currentQuery);

            if (matchCat && matchStr) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        noResults.classList.toggle('show', visibleCount === 0);
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
})();
