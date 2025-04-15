const backendAPI = 'http://localhost:3030';

document.addEventListener('DOMContentLoaded', async() => {
    const response1 = await fetch(`${backendAPI}/user/my-profile`, {
        headers: {
            authorization: localStorage.getItem('token')
        }
    });

    const data = await response1.json();
    console.log(data);
    console.log(data.userData.is_admin);

    document.getElementById('username').textContent = data.userData.name;
    document.getElementById('bio').textContent = data.userData.bio || 'No bio Added.';

    //Admin check
    if(!data.userData.is_admin) {
        const adminLink = document.querySelector('.admin-only');

        adminLink.style.display ='none';
    }

    const followingList = document.getElementById('following-list');
    data.followingData.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.name;
        li.addEventListener('click', () => {
            window.location.href = `${backendAPI}/users/profile?userId=${user.id}`
        });
        followingList.appendChild(li);
    });

    const recipesContainer = document.getElementById('my-recipes');
    data.RecipeData.forEach(recipe => {
        const div = document.createElement('div');
        div.className = 'recipe-card';
        
        const title = document.createElement('h3');
        title.textContent = recipe.title;
        title.style.cursor = 'pointer';

        title.addEventListener('click', () => {
            window.location.href = `${backendAPI}/recipe/details?id=${recipe.id}`;
        });

        const img = document.createElement('img');
        img.setAttribute('src', recipe.image_url);
        img.setAttribute('alt', recipe.title);

        const description = document.createElement('p');
        description.textContent = recipe.description;

        const actions = document.createElement('div');
        actions.className = 'card-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-recipe';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
            window.location.href = `${backendAPI}/user/edit-recipe?id=${recipe.id}`;
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-recipe';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', async() => {

            const confirmDelete = confirm("Are you sure to delete this?");
            if(!confirmDelete)
                return;
            const res = await fetch(`${backendAPI}/user/delete-recipe/${recipe.id}`, {
                method: 'DELETE',
                headers: {
                    authorization: localStorage.getItem('token')
                }
            });
            const data = await res.json();
            alert(data.message);
            if(res.ok) {
                div.remove();
            }
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        div.appendChild(title);
        div.appendChild(img);
        div.appendChild(description);
        div.appendChild(actions);

        recipesContainer.appendChild(div);
    })

    document.getElementById('edit-bio').addEventListener('click', async() => {
        const newBio = prompt("Enter new Bio:");
        if(newBio) {
            const updateRes = await fetch(`${backendAPI}/user/update-bio`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: localStorage.getItem('token')
                },
                body: JSON.stringify({bio: newBio})
            });

            if(updateRes.ok) {
                document.getElementById('bio').textContent = newBio;
            } else {
                alert('failed to update bio!');
            }
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
        logoutPrompt();
    })

});


function logoutPrompt() {
    console.log('logout Button clicked');
    localStorage.removeItem('token');
    window.location.href = `${backendAPI}/userCheck/login`;
}