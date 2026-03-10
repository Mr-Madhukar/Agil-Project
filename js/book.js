/* ======================================================
   US#7 + US#8 – Booking Form & Summary JS (book.js)
   ====================================================== */

(function () {
    'use strict';

    /* =====================================================
       BOOKING FORM (book.html)
       ===================================================== */
    const bookForm = document.getElementById('bookingForm');

    if (bookForm) {

        /* ---- Destination prices (static data) ---- */
        const PRICES = {
            'Paris, France': 149999,
            'Tokyo, Japan': 169999,
            'Bern, Switzerland': 159999,
            'Vancouver, Canada': 199999,
            'Seoul, South Korea': 149999,
            'Monaco, Monaco': 139999,
        };
        const DEST_IMAGES = {
            'Paris, France': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
            'Tokyo, Japan': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
            'Bern, Switzerland': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
            'Vancouver, Canada': 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=600&q=80',
            'Seoul, South Korea': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&q=80',
            'Monaco, Monaco': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        };

        /* ---- Pre-fill from URL parameters ---- */
        function parseUrl() {
            const params = new URLSearchParams(window.location.search);
            const pkg = params.get('package') || '';
            const dest = params.get('destination') || '';

            let destText = dest;
            if (pkg === 'swiss-adventure') destText = 'Bern, Switzerland';
            if (pkg === 'paris-escapade') destText = 'Paris, France';
            if (pkg === 'tokyo-explorer') destText = 'Tokyo, Japan';
            if (pkg === 'canadian-rockies') destText = 'Vancouver, Canada';
            if (pkg === 'korea-adventure') destText = 'Seoul, South Korea';
            if (pkg === 'monaco-luxury') destText = 'Monaco, Monaco';

            if (destText) {
                const destEl = document.getElementById('destination');
                if (destEl) destEl.value = destText;
                updateSummary();
            }

            const dateParam = params.get('date');
            if (dateParam) {
                const dateEl = document.getElementById('travelDate');
                if (dateEl) dateEl.value = dateParam;
                updateSummary();
            }
        }

        /* ---- Summary update ---- */
        function fmt(n) {
            return '₹ ' + n.toLocaleString('en-IN') + '.00';
        }

        function updateSummary() {
            const destVal = (document.getElementById('destination')?.value || '').trim();
            const travelers = parseInt(document.getElementById('travelers')?.value) || 1;
            const roomType = document.getElementById('roomType')?.value || 'standard';
            const airportPickup = document.getElementById('airportPickup')?.checked;
            const tourGuide = document.getElementById('tourGuide')?.checked;
            const insurance = document.getElementById('insurance')?.checked;

            let base = PRICES[destVal] || 149999;

            // Room upgrade cost
            const roomExtra = { standard: 0, deluxe: 15000, suite: 30000, family: 20000 };
            let addons = (roomExtra[roomType] || 0) * travelers;

            // Add-on services
            if (airportPickup) addons += 4200;
            if (tourGuide) addons += 8400;
            if (insurance) addons += 6300 * travelers;

            const total = (base * travelers) + addons;

            // Update sidebar display
            const el = id => document.getElementById(id);
            if (el('summDest')) el('summDest').textContent = destVal || 'Select a destination';
            if (el('summTravelers')) el('summTravelers').textContent = travelers;
            if (el('summRoom')) el('summRoom').textContent = roomType.charAt(0).toUpperCase() + roomType.slice(1);
            if (el('summBase')) el('summBase').textContent = fmt(base * travelers);
            if (el('summAddons')) el('summAddons').textContent = fmt(addons);
            if (el('summTotal')) el('summTotal').textContent = fmt(total);

            // Update image
            const img = document.getElementById('summImg');
            if (img && DEST_IMAGES[destVal]) img.src = DEST_IMAGES[destVal];

            // Update travel date display
            const dateEl = document.getElementById('travelDate');
            const summDate = document.getElementById('summDate');
            if (dateEl && summDate && dateEl.value) {
                const d = new Date(dateEl.value);
                summDate.textContent = d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
            }
        }

        // Attach change listeners for dynamic total
        ['destination', 'travelers', 'roomType', 'airportPickup', 'tourGuide', 'insurance', 'travelDate']
            .forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('change', updateSummary);
                if (el && el.tagName === 'INPUT' && el.type === 'text')
                    el.addEventListener('input', updateSummary);
            });

        // Payment method selection
        document.querySelectorAll('.pay-method').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Form submit → save to localStorage → go to summary
        bookForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            const token = localStorage.getItem('token');
            if(!token) {
                alert('Please log in to book a package.');
                window.location.href = 'signup.html?tab=login';
                return;
            }

            const destination = document.getElementById('destination')?.value || '';
            const travelDate = document.getElementById('travelDate')?.value || '';
            const travelers = parseInt(document.getElementById('travelers')?.value) || 1;
            
            // Map destination name back to a package ID (temp hack for static form)
            const destToId = {
                'Paris, France': 2,
                'Tokyo, Japan': 4,
                'Bern, Switzerland': 1,
                'Vancouver, Canada': 3,
                'Seoul, South Korea': 5,
                'Monaco, Monaco': 6
            };
            const packageId = destToId[destination] || 1;

            try {
                const res = await fetch('http://localhost:5000/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify({
                        package_id: packageId,
                        travel_date: travelDate,
                        travelers: travelers
                    })
                });

                if (res.ok) {
                    const result = await res.json();
                    
                    const data = {
                        ref: 'GT' + result.bookingId,
                        name: document.getElementById('fullName')?.value || '',
                        email: document.getElementById('email')?.value || '',
                        phone: document.getElementById('phone')?.value || '',
                        destination: destination,
                        date: travelDate,
                        travelers: travelers,
                        roomType: document.getElementById('roomType')?.value || 'standard',
                        requests: document.getElementById('specialRequests')?.value || '',
                        total: document.getElementById('summTotal')?.textContent || '₹ 0.00',
                        payment: (document.querySelector('.pay-method.active span')?.textContent) || 'Credit Card',
                    };

                    sessionStorage.setItem('bookingData', JSON.stringify(data));
                    window.location.href = 'summary.html';
                } else {
                    const err = await res.json();
                    alert('Booking failed: ' + (err.error || 'Unknown error'));
                }
            } catch (err) {
                console.error(err);
                alert('Network error during booking.');
            }
        });

        // Reviews Logic
        const destToIdRev = {
            'Paris, France': 2,
            'Tokyo, Japan': 4,
            'Bern, Switzerland': 1,
            'Vancouver, Canada': 3,
            'Seoul, South Korea': 5,
            'Monaco, Monaco': 6
        };

        async function fetchReviews() {
            const dest = document.getElementById('destination')?.value;
            const packageId = destToIdRev[dest] || 1;
            const reviewsList = document.getElementById('reviewsList');
            
            if(!reviewsList) return;
            
            try {
                const res = await fetch(`http://localhost:5000/api/packages/${packageId}/reviews`);
                if(res.ok) {
                    const reviews = await res.json();
                    reviewsList.innerHTML = '';
                    if(reviews.length === 0) {
                        reviewsList.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
                    } else {
                        reviews.forEach(r => {
                            let stars = '';
                            for(let i=0; i<5; i++) {
                                stars += `<i class="fas fa-star" style="color: ${i < r.rating ? '#ffc107' : '#e4e5e9'};"></i>`;
                            }
                            reviewsList.innerHTML += `
                                <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
                                    <strong><i class="fas fa-user-circle"></i> ${r.fullname}</strong>
                                    <div style="margin: 5px 0;">${stars}</div>
                                    <p style="margin: 0; color: #555;">${r.comment}</p>
                                    <small style="color: #999;">${new Date(r.created_at).toLocaleDateString()}</small>
                                </div>
                            `;
                        });
                    }
                }
            } catch (err) {
                console.error(err);
                reviewsList.innerHTML = '<p>Failed to load reviews.</p>';
            }
        }

        const reviewForm = document.getElementById('reviewForm');
        if(reviewForm) {
            reviewForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const token = localStorage.getItem('token');
                if(!token) {
                    alert('You must be logged in to leave a review.');
                    return;
                }

                const dest = document.getElementById('destination')?.value;
                const packageId = destToIdRev[dest] || 1;
                const rating = parseInt(document.getElementById('reviewRating').value);
                const comment = document.getElementById('reviewComment').value;
                const errorDiv = document.getElementById('reviewError');

                try {
                    const res = await fetch(`http://localhost:5000/api/packages/${packageId}/reviews`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': token
                        },
                        body: JSON.stringify({ rating, comment })
                    });

                    if(res.ok) {
                        document.getElementById('reviewComment').value = '';
                        errorDiv.style.display = 'none';
                        fetchReviews();
                    } else {
                        const err = await res.json();
                        errorDiv.textContent = err.error || 'Failed to submit review.';
                        errorDiv.style.display = 'block';
                    }
                } catch(err) {
                    console.error(err);
                    errorDiv.textContent = 'Network error.';
                    errorDiv.style.display = 'block';
                }
            });
        }

        // Fetch reviews on load and when destination changes
        document.getElementById('destination')?.addEventListener('change', fetchReviews);

        parseUrl();
        updateSummary();
        fetchReviews();
    }

    /* =====================================================
       SUMMARY PAGE (summary.html)
       ===================================================== */
    const summaryPage = document.getElementById('summaryPage');

    if (summaryPage) {
        const raw = sessionStorage.getItem('bookingData');
        const data = raw ? JSON.parse(raw) : null;

        if (data) {
            const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

            set('sRef', data.ref);
            set('sName', data.name);
            set('sEmail', data.email);
            set('sPhone', data.phone);
            set('sDest', data.destination);
            set('sDate', data.date ? new Date(data.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—');
            set('sTravelers', data.travelers);
            set('sRoom', data.roomType ? data.roomType.charAt(0).toUpperCase() + data.roomType.slice(1) : '');
            set('sPayment', data.payment);
            set('sTotal', data.total);
            set('sRef2', data.ref);

            // Also update title reference display
            const refTag = document.getElementById('refTag');
            if (refTag) refTag.textContent = 'Ref # ' + data.ref;
        }

        // Print
        const printBtn = document.getElementById('btnPrint');
        if (printBtn) printBtn.addEventListener('click', () => window.print());

        // Back
        const backBtn = document.getElementById('btnBack');
        if (backBtn) backBtn.addEventListener('click', () => window.location.href = 'book.html');
    }

    /* ---- Shared: hamburger + backdrop + back-to-top ---- */
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
