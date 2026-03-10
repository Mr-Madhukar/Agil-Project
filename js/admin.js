document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        window.location.href = 'signup.html?tab=login';
        return;
    }

    const userObj = JSON.parse(userStr);
    if (userObj.role !== 'admin') {
        document.querySelector('.admin-container').innerHTML = `
            <div style="text-align:center; padding: 50px;">
                <h1 style="color:#e74c3c;"><i class="fas fa-exclamation-triangle"></i> Access Denied</h1>
                <p>You do not have permission to view this page.</p>
                <a href="index.html" style="color:#3498db;">Return to Home</a>
            </div>
        `;
        return;
    }

    const tbody = document.getElementById('usersTableBody');
    const errorMsg = document.getElementById('errorMsg');

    try {
        const response = await fetch('http://localhost:5000/api/admin/users', {
            headers: {
                'x-auth-token': token
            }
        });

        if (response.ok) {
            const users = await response.json();
            tbody.innerHTML = '';
            
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No users found.</td></tr>';
            } else {
                users.forEach(user => {
                    const roleBadge = user.role === 'admin' 
                        ? '<span class="badge badge-admin">Admin</span>' 
                        : '<span class="badge badge-traveler">Traveler</span>';

                    tbody.innerHTML += `
                        <tr>
                            <td>#${user.id}</td>
                            <td>${user.fullname}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${roleBadge}</td>
                        </tr>
                    `;
                });
            }
        } else {
            errorMsg.textContent = 'Failed to load users. You might not have the right permissions.';
            errorMsg.style.display = 'block';
            tbody.innerHTML = '';
        }
    } catch (err) {
        console.error('Network error', err);
        errorMsg.textContent = 'Network error loading users.';
        errorMsg.style.display = 'block';
        tbody.innerHTML = '';
    }

    const bookingsBody = document.getElementById('adminBookingsBody');
    try {
        const responseList = await fetch('http://localhost:5000/api/admin/bookings', {
            headers: { 'x-auth-token': token }
        });
        if(responseList.ok) {
            const bookings = await responseList.json();
            bookingsBody.innerHTML = '';
            if(bookings.length === 0) {
                bookingsBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No bookings found.</td></tr>';
            } else {
                bookings.forEach(b => {
                    bookingsBody.innerHTML += `
                        <tr>
                            <td>#${b.id}</td>
                            <td>${b.user_fullname} <br> <small>${b.user_email}</small></td>
                            <td>${b.destination}</td>
                            <td>${new Date(b.travel_date).toLocaleDateString()}</td>
                            <td>${b.travelers}</td>
                            <td>₹ ${b.price_inr}</td>
                            <td>${b.status}</td>
                        </tr>
                    `;
                });
            }
        }
    } catch (err) {
        console.error(err);
        bookingsBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Network error loading bookings.</td></tr>';
    }

    // Logout handling
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});
