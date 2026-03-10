document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        window.location.href = 'signup.html?tab=login';
        return;
    }

    const userObj = JSON.parse(userStr);
    
    try {
        const response = await fetch(`http://localhost:5000/api/profile/${userObj.id}`, {
            headers: {
                'x-auth-token': token
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('welcomeMsg').textContent = `Welcome back, ${data.fullname}!`;
            document.getElementById('profileName').textContent = data.fullname;
            document.getElementById('profileUser').textContent = data.username;
            document.getElementById('profileEmail').textContent = data.email;
            document.getElementById('profileRole').textContent = data.role.toUpperCase();
            
            document.getElementById('profileInfo').style.display = 'grid';
            
            // Fetch bookings
            fetchBookings(userObj.id, token);
        } else {
            console.error('Failed to load profile');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'signup.html?tab=login';
        }
    } catch (err) {
        console.error('Network error', err);
    }

    async function fetchBookings(userId, token) {
        const tbody = document.getElementById('bookingsTableBody');
        try {
            const res = await fetch(`http://localhost:5000/api/bookings/user/${userId}`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const bookings = await res.json();
                tbody.innerHTML = '';
                if (bookings.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No bookings found.</td></tr>';
                } else {
                    bookings.forEach(b => {
                        const date = new Date(b.travel_date).toLocaleDateString();
                        const cancelBtn = b.status === 'Confirmed' 
                            ? `<button class="cancel-btn" onclick="cancelBooking(${b.id})">Cancel</button>` 
                            : 'N/A';
                        
                        tbody.innerHTML += `
                            <tr>
                                <td>#${b.id}</td>
                                <td>${b.destination}</td>
                                <td>${date}</td>
                                <td>${b.travelers}</td>
                                <td>${b.status}</td>
                                <td>${cancelBtn}</td>
                            </tr>
                        `;
                    });
                }
            } else {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Failed to load bookings.</td></tr>';
            }
        } catch (err) {
            console.error(err);
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Network error.</td></tr>';
        }
    }

    // Expose cancel globally
    window.cancelBooking = async function(bookingId) {
        if (!confirm('Are you sure you want to cancel this booking?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                alert('Booking cancelled successfully.');
                fetchBookings(userObj.id, token); // reload
            } else {
                alert('Failed to cancel booking.');
            }
        } catch (err) {
            console.error(err);
            alert('Error cancelling booking.');
        }
    };

    // Logout handling
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});
