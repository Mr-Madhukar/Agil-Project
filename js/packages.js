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

    /* ---- Hamburger ---- */
    const burger = document.getElementById('burger');
    const menu = document.getElementById('navMenu');
    if (burger && menu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            menu.classList.toggle('open');
        });
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
