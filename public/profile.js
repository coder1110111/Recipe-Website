const backendAPI = 'http://localhost:3030';

const userId = new URLSearchParams(window.location.search).get('userId');
const followBtn = document.getElementById('followBtn');

async function fetchProfile() {
    const response = await fetch(`${backendAPI}/user/profile/${userId}`, {
        headers: {
            authorization: localStorage.getItem('token')
        }
    });

    const result = await response.json();
    const data = result.accountData;

    document.getElementById('username').textContent = data.name;
    document.getElementById('bio').textContent = data.bio || 'No bio provided';

    followBtn. textContent = data.isFollowing ? 'Following' : 'Follow';
    if(data.isFollowing)
}

window.addEventListener('DOMContentLoaded', () => {
    fetchProfile();
})