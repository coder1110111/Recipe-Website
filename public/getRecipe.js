const backendAPI = 'http://localhost:3030';

const recipeId = new URLSearchParams(window.location.search).get('id');

async function loadRecipe() {
    const res = await fetch(`/recipe/recipeDetails/${recipeId}`, {
        headers: {
            authorization: localStorage.getItem('token')
        }
    });
    if(res.status === 403) {
        console.log('In if Statement');
        alert("Please Login to gain Access!");
        window.location.href = `${backendAPI}/userCheck/login`
    }
    console.log(res);
    const data = await res.json();
    console.log(data);
    console.log(data.UserId);
    document.getElementById('recipe-title').textContent = data.title;
    document.getElementById('recipe-author').textContent = data.User.name;
    document.getElementById('cuisine').textContent = data.cuisine_type;
    document.getElementById('recipe-description').textContent = data.description;
    document.getElementById('recipe-ingredients').textContent = data.ingredients;
    document.getElementById('recipe-instructions').textContent = data.instructions;
    document.getElementById('recipe-image').src = data.image_url;

    document.getElementById('recipe-author').style.cursor = 'pointer';
    document.getElementById('recipe-author').addEventListener('click', () => {
        window.location.href = `${backendAPI}/users/profile?userId=${data.UserId}`;
    })
}

async function loadLatestReviews() {
    const res = await fetch(`${backendAPI}/review/${recipeId}`);
    const reviews = await res.json();
    console.log(reviews);
    const container = document.getElementById('latest-reviews');

    reviews.forEach(review => {
        const div = document.createElement('div');
        div.className = 'review-item';

        const usernameEl = document.createElement('p');
        usernameEl.textContent = review.User.name;
        usernameEl.style.fontWeight='bold';
        usernameEl.style.cursor = 'pointer';
        usernameEl.style.marginBottom = '0.5rem';
        usernameEl.style.color='#007bff';

        usernameEl.addEventListener('click', () => {
            window.location.href = `${backendAPI}/users/profile?userId=${review.UserId}`;
        });

        const commentEl = document.createElement('p');
        commentEl.textContent = review.comment;

        div.appendChild(usernameEl);
        div.appendChild(commentEl);
        container.appendChild(div);
    });
}

async function checkFavoriteStatus() {
    const response = await fetch(`${backendAPI}/recipe/checkfavorite/${recipeId}`, {
        headers: {
            authorization: localStorage.getItem('token')
        }
    });
            //console.log('In Check Favorite');
            //console.log(response);
    const data = await response.json();
    console.log(data);                

    const favoriteBtn = document.getElementById('addFavorite');
    favoriteBtn.textContent = data.isFav ? 'Favorited' : 'Add to Favorites';

    favoriteBtn.addEventListener('click', async () => {
        const action = data.isFav ? 'unfavorite' : 'addtofavorite';
        const response = await fetch(`${backendAPI}/favorites/${action}/${recipeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('token')
            }
        });
        const data1 = await response.json();
        console.log(data1);
        location.reload();
    });
}
document.addEventListener('DOMContentLoaded', () => {
    loadRecipe();
    loadLatestReviews();
    checkFavoriteStatus();

    //Event Listeners
    document.getElementById('addCollection').addEventListener('click', async () => {
        const menu = document.getElementById('collection-menu');
        menu.innerHTML = '';
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    
        try {
            const res = await fetch(`${backendAPI}/collection/get-collection`, {
                headers: {
                    authorization: localStorage.getItem('token')
                }
            });
    
            const collections = await res.json();
            console.log(collections);
            if(!collections.CollectionData.length) {
                menu.innerHTML = '<p>No Collections found.</p>';
                return;
            }
    
            collections.CollectionData.forEach(collection => {
                const div = document.createElement('div');
                div.className = 'collection-option';
                div.textContent = collection.name;
                div.style.cursor = 'pointer';
    
                div.addEventListener('click', async() => {
                    const checkRes = await fetch(`${backendAPI}/collection/check-recipe/${recipeId}`, {
                        method: 'POST',
                        headers: {
                            authorization: localStorage.getItem('token'),
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ collectionId: collection.id })
                    });
                    const result = await checkRes.json();
                    if(result.exists) {
                        alert('Recipe already in this collection.');
                    } else {
                        await fetch(`${backendAPI}/collection/add-Recipe/${recipeId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                authorization: localStorage.getItem('token')
                            },
                            body: JSON.stringify({ collectionId: collection.id})
                        });
                        alert('Recipe added to Collection!');
                    }
    
                    menu.style.display = 'none';
                });
                menu.appendChild(div);
            });
        } catch (err) {
            console.log(err);
            alert('Failed to fetch Collections');
        }
    });

    document.getElementById('submitReview').addEventListener('click', async () => {
        const comment = document.getElementById('reviewText').value;
        await fetch(`${backendAPI}/review/${recipeId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                authorization: localStorage.getItem('token')
            },
            body: JSON.stringify({ comment })
        });
        alert('Review submitted!');
        document.getElementById('reviewText').value = '';
        document.getElementById('latest-reviews').innerHTML = '<h4>Latest Reviews</h4>';
        loadLatestReviews();
    });
});