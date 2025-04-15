const backendAPI = 'http://localhost:3030';

document.addEventListener('DOMContentLoaded', async() => {
    const res = await fetch(`${backendAPI}/activity/feed`, {
        headers: {
            authorization: localStorage.getItem('token')
        }
    });
    const data = await res.json();
    console.log(data);

    const container = document.getElementById('activity-feed');
    if(data.recipes.length === 0) {
        const heading = document.createElement('h3');
        heading.textContent = 'Follow some users to see Content';

        container.appendChild(heading);
    }
    else {
        data.recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            
            const img = document.createElement('img');
            img.src = recipe.image_url;
            img.alt = recipe.title;
    
            const title = document.createElement('h3');
            title.className = 'title';
            title.textContent = recipe.title;
    
            const para1 = document.createElement('p');
            para1.innerHTML = `<strong>By: </strong>${recipe.User.name}`;
    
            const para2 = document.createElement('p');
            para2.innerHTML = `<strong>Cuisine: </strong>${recipe.cuisine_type}`;
    
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(para1);
            card.appendChild(para2);
    
            card.addEventListener('click', () => {
                window.location.href = `${backendAPI}/recipe/details?id=${recipe.id}`;
            });
    
            container.appendChild(card);
        })
    }
})