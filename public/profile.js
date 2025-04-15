const backendAPI = 'http://localhost:3030';

const userId = new URLSearchParams(window.location.search).get('userId');
const followBtn = document.getElementById('followBtn');

async function fetchProfile() {
    const response = await fetch(`${backendAPI}/users/profile/${userId}`, {
        headers: {
            authorization: localStorage.getItem('token')
        }
    });
    if(response.status === 403) {
        alert('Please Login to gain Access!');
        window.location.href = `${backendAPI}/userCheck/login`;
    }

    const result = await response.json();
    console.log(result);
    const data = result.accountData;

    document.getElementById('username').textContent = data.name;
    document.getElementById('bio').textContent = data.bio || 'No bio provided';

    /* const recipeList = document.getElementById('recipe-list');
    data. */
}

async function checkFollowStatus(userId) {
    const response = await fetch(`${backendAPI}/users/follow-status/${userId}`, {
        headers: {
            authorization: localStorage.getItem('token')
        }
    });
    
    const data = await response.json();
    //console.log(data);

    const followBtn = document.querySelector('.follow-btn');
    followBtn.textContent = data.isFollowing ? 'Following' : 'Follow';

    followBtn.addEventListener('click', async() => {
        const action = data.isFollowing ? 'unfollow' : 'follow';
        await fetch(`${backendAPI}/users/${action}/${userId}`, {
            method: 'POST',
            headers: {
                authorization: localStorage.getItem('token')
            }
        });
        location.reload();
    });
}

async function getVisitingUserRecipe(userId) {
    const response = await fetch(`${backendAPI}/users/getRecipes/${userId}`);

    const data = await response.json();
    console.log(data.recipes);
    const recipeList = document.getElementById('recipe-list');
    data.recipes.forEach(recipe => {
        const div = document.createElement('div');
        div.className = 'recipe';
        div.innerHTML = `
            <img src="${recipe.image_url}" alt="${recipe.title}">
            <div class="recipe-content">
                <h3>${recipe.title}</h3>
                <p>${recipe.description}</p>
            </div>
        `;
        div.addEventListener('click', () => {
            window.location.href = `${backendAPI}/recipe/details?id=${recipe.id}`;
        });
        recipeList.appendChild(div);
    })
}

window.addEventListener('DOMContentLoaded', () => {
    fetchProfile();
    checkFollowStatus(userId);
    getVisitingUserRecipe(userId);
})