const backendAPI = 'http://localhost:3030';


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-form').addEventListener('submit', async(e) => {
        e.preventDefault();
    
        const query = document.getElementById('search-input').value.trim();
        const diet = document.getElementById('diet-filter').value;
        const prepTime = document.getElementById('prep-time-filter').value;

        try {
            const res = await fetch(`${backendAPI}/recipe/details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: localStorage.getItem('token')
                },
                body: JSON.stringify({query, diet, prepTime})
            });
            //console.log(res);
            //console.log(res.headers.get('content-type'));
        
            const data = await res.json();
            console.log(data);
            const container = document.getElementById('results-container');
            container.innerHTML = '';
        
            data.recipes.forEach(recipe => {
                const card = document.createElement('div');
                card.classList.add('recipe-card');
        
                const recipetitle = document.createElement('h3');
                recipetitle.textContent = recipe.title;
        
                const imgEle = document.createElement('img');
                imgEle.src = recipe.image_url;
                imgEle.alt = recipe.title;
        
                const author = document.createElement('p');
                author.innerHTML=`<strong>Author:</strong> ${recipe.User.name}`;
        
                const cuisine = document.createElement('p');
                cuisine.innerHTML = `<strong>Cuisine:</strong> ${recipe.cuisine_type}`;
        
                const prepEle = document.createElement('p');
                prepEle.innerHTML = `<strong>Preparation Time:</strong> ${recipe.prep_time}`
        
                card.appendChild(recipetitle);
                card.appendChild(imgEle);
                card.appendChild(author);
                card.appendChild(cuisine);
                card.appendChild(prepEle);
        
                card.addEventListener('click', () => {
                    window.location.href = `${backendAPI}/recipe/details?id=${recipe.id}`
                });
        
                container.appendChild(card);
            });
        } catch(err) {
            console.log(err);
            console.error('Response is not JSON: '+  err);
        }
    });
})