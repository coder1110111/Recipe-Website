const backendAPI='http://localhost:3030'

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('recipeform').addEventListener('submit', async function(e) {
        e.preventDefault();
    
        const form = e.target;
        const formData = new FormData(form);
        
        try {
            const response = await fetch(`${backendAPI}/recipe/share-a-recipe`, {
                method: 'POST',
                headers: {
                    authorization: localStorage.getItem('token')
                },
                body: formData
            });

            const result = await response.json();

            if(response.ok) {
                alert('Recipe shared Successfully!');
                console.log(result.recipe);
                form.reset();
            } else {
                alert('Error: ' + result.message);
            }
        } catch(err) {
            alert('Something went wrong!');
            console.log(err);
        }
        /* for(const [key, value] of formData.entries()) {
            console.log(`${key}: `, value);
        } */
    });
});
