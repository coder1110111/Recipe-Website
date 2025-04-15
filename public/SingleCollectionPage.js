const backendAPI = 'http://localhost:3030';

const collectionId = new URLSearchParams(window.location.search).get('id');


document.addEventListener('DOMContentLoaded', () => {
    loadCollectionRecipes();
});

async function loadCollectionRecipes() {
    try {
        const res = await fetch(`${backendAPI}/collections/recipes/${collectionId}`, {
            headers: {
                authorization: localStorage.getItem('token')
            }
        });

        const recipes = await res.json();
        console.log(recipes);
        console.log(recipes.collectionData.recipes);

        const container = document.getElementById('recipes-container');
        container.innerHTML = '';

        recipes.collectionData.recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';

            const title = document.createElement('h3');
            title.textContent = recipe.title;
            title.className = 'recipe-title';
            title.style.cursor = 'pointer';
            title.addEventListener('click', () => {
                window.location.href = `${backendAPI}/recipe/details?id=${recipe.id}`;
            });
            
            const img = document.createElement('img');
            img.src = recipe.image_url;
            img.alt = recipe.title;
            img.className = 'recipe-img';

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-btn';
            removeBtn.addEventListener('click', async () => {
                await fetch(`${backendAPI}/collections/remove-recipe/${collectionId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: localStorage.getItem('token')
                    },
                    body: JSON.stringify({ recipeId: recipe.id })
                });
                alert('Recipe removed from Collection.');
                card.remove();
            });

            card.appendChild(title);
            card.appendChild(img);
            card.appendChild(removeBtn);
            container.appendChild(card);
        });
    } 
    catch(err) {
        console.error('Failed to load recipes: ', err);
    }
}