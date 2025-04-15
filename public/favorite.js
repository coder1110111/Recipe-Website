const backendAPI = 'http://localhost:3030';

document.addEventListener('DOMContentLoaded', async() => {
    const container = document.querySelector('.favorites-container');
    try {
        console.log(localStorage.getItem('token'));
        const res = await fetch(`${backendAPI}/user/favorites`, {
            
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            
        });

        const favorites = await res.json();
        console.log(favorites);
        const favoriteArray = favorites.favoritesData.FavoritedRecipes;
        if(favoriteArray.length === 0) {
            container.innerHTML = '<p>No Favorites Added yet.</p>';
            return;
        }

        favoriteArray.forEach(recipe => {
            const card = document.createElement('div');
            card.className='recipe-card';
            card.addEventListener('click', async() => {
                window.location.href = `${backendAPI}/recipe/details?id=${recipe.id}`;
            })

            const title = document.createElement('h3');
            title.textContent = recipe.title;

            const img = document.createElement('img');
            img.src = recipe.image_url;
            img.alt = recipe.title;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove from Favorites';
            removeBtn.className = 'remove-fav-btn';

            removeBtn.addEventListener('click', async() => {
                const delRes = await fetch(`${backendAPI}/favorites/unfavorite/${recipe.id}`, {
                    method: 'POST',
                    headers: {
                        authorization: localStorage.getItem('token')
                    }
                });

                if(delRes.ok) {
                    location.reload();
                } else {
                    alert('Failed to remove Favorite Recipe.');
                }
            });

            card.append(title, img, removeBtn);
            container.appendChild(card);
        });
        console.log(favoriteArray);
    } catch (err) {
        console.log(err);
        container.innerHTML = '<p>Error loading Favorites.</p>';
    }
});