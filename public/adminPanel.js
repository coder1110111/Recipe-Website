const backendAPI = 'http://localhost:3030';

document.addEventListener('DOMContentLoaded', async() => {
    try {
        const res = await fetch(`${backendAPI}/admin/check`, {
            headers: {
                authorization: localStorage.getItem('token')
            }
        });

        const data = await res.json();
        console.log(data);
        if(!data.isAdmin) {
            alert("Access denied. Admins only.");
            window.location.href= `${backendAPI}/home/page`;
            return;
        }

        const userRes = await fetch(`${backendAPI}/admin/users`, {
            headers: {
                authorization: localStorage.getItem('token')
            }
        });

        const users = await userRes.json();
        const container = document.getElementById('user-list-container');
        container.innerHTML='';
        console.log(users); /////////
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('user-card');

            userDiv.innerHTML = `
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <button class="toggle-status-btn" data-id="${user.id}">
                    ${user.is_banned ? 'Banned' : 'Active'}
                </button>
                <button class="delete-btn" data-id="${user.id}">Delete User</button>
            `;

            container.appendChild(userDiv);
        });

        container.addEventListener('click', async (e) => {
            const userId = e.target.dataset.id;

            if (e.target.classList.contains('delete-btn')) {
                if (confirm("Are you sure you want to delete this user?")) {
                    await fetch(`${backendAPI}/admin/delete-user/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            authorization: localStorage.getItem('token')
                        }
                    });
                    e.target.closest('.user-card').remove();
                }
            }

            if (e.target.classList.contains('toggle-status-btn')) {
                const res = await fetch(`${backendAPI}/admin/toggle-ban/${userId}`, {
                    method: 'PUT',
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                });

                const result = await res.json();
                e.target.textContent = result.is_banned ? 'Banned' : 'Active';
            }
        });

        
    } catch(err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
    }
})