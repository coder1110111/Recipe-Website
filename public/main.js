
const backendAPI='http://localhost:3030';

window.addEventListener('DOMContentLoaded', async() => {
    
    const container = document.querySelector('.container');

    container.innerHTML= '';

    try {
        const response = await fetch(`${backendAPI}/home/getRecipe`);
        const recipes = await response.json();

        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${recipe.image_url}" alt="${recipe.title}">
                <div class="recipe-content">
                    <h3>${recipe.title}</h3>
                    <p>${recipe.description}</p>
                </div>
            `;

            recipeDiv.addEventListener('click', () => {
                window.location.href = `${backendAPI}/recipe/details?id=${recipe.id}`;
            });

            container.appendChild(recipeDiv);
        });
    } catch(err) {
        console.error('Error loading recipes: ', err);
    }
});