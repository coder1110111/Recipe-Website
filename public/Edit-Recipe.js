const backendAPI = 'http://localhost:3030';
const recipeId = new URLSearchParams(window.location.search).get('id');

document.addEventListener('DOMContentLoaded', async() => {
    try {

        const recipeData = await fetch(`${backendAPI}/recipe/recipeDetails/${recipeId}`, {
            headers: {
                authorization: localStorage.getItem('token')
            }
        });
    
        const recipe = await recipeData.json();
        console.log(recipe);
    
        document.getElementById('title').value = recipe.title
        document.getElementById('description').value = recipe.description;
        document.getElementById('cuisine').value = recipe.cuisine_type;
        document.getElementById('ingredients').value = recipe.ingredients;
        document.getElementById('instructions').value = recipe.instructions;
        document.getElementById('prepTime').value = recipe.prep_time;
        document.getElementById('servings').value = recipe.servings

    } catch (err) {
        console.error("failed to fetch recipe data: ", err);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('recipeform').addEventListener('submit', async (e) => {
        e.preventDefault();

        const updateImage = document.getElementById('update-image-checkbox').checked;
        const form = document.getElementById('recipeform');

        if(updateImage) {
            const formData = new FormData(form);
            try {
                const response = await fetch(`${backendAPI}/recipe/editWithImage/${recipeId}`, {
                    method: 'PUT',
                    headers: {
                        authorization: localStorage.getItem('token')
                    },
                    body: formData
                });
                const result = await response.json();
                alert(result.message);
            } catch(err) {
                console.error("Error updating with image: ", err);
            }
        } else {
            const recipeData = {
                title: form.title.value,
                description: form.description.value,
                cuisine: form.cuisine.value,
                ingredients: form.ingredients.value,
                instructions: form.instructions.value,
                prepTime: form.prepTime.value,
                servings: form.servings.value
            };

            try {
                const response = await fetch(`${backendAPI}/recipe/editNoImage/${recipeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: localStorage.getItem('token')
                    },
                    body: JSON.stringify(recipeData)
                });

                const result = await response.json();
                alert(result.message);
        
            } catch(err) {
                console.error("Error updating without image: ", err);
            }
        }
        window.location.href=`${backendAPI}/user/getMyProfilePage`
    });
});

