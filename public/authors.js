const backendAPI = 'http://localhost:3030';

async function loadAuthors() {

    console.log('Load Authors called');
    const res = await fetch(`${backendAPI}/users/allUsersDetails`);
    const authors = await res.json();

    const container = document.getElementById('authorsContainer');
    container.innerHTML = '';

    console.log(authors);

    authors.forEach(author => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.style.cursor = 'pointer';

        const name = document.createElement('h3');
        name.textContent = author.name;

        const stats = document.createElement('p');
        stats.className = 'user-stats';
        stats.textContent = `${author.recipeCount} Recipes | ${author.followerCount} Followers`;

        card.appendChild(name);
        card.appendChild(stats);

        card.addEventListener('click', () => {
            window.location.href = `${backendAPI}/users/profile?userId=${author.id}`;
        });

        container.appendChild(card);
    })
}

window.addEventListener('DOMContentLoaded', loadAuthors);