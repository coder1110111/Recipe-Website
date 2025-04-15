const backendAPI = 'http://localhost:3030';

document.addEventListener('DOMContentLoaded', async() => {
    
    document.getElementById('create-collection-btn').addEventListener('click', async() => {
        const name = prompt('Enter a Name for Collection:');
        if(!name) return;

        try {
            const res = await fetch(`${backendAPI}/collection/create-collection`, {
                method: 'POST',
                headers: {
                    authorization: localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name})
            });

            if(res.ok) {
                const newCollection = await res.json();
                console.log(newCollection);
                location.reload();
            } else {
                alert('Failed to create Collection');
            }
        } catch(err) {
            console.error(err);
            alert('An error occurred');
        }
    });
    
    
    const container = document.getElementById('collections-container');
    const res = await fetch(`${backendAPI}/collection/get-collection`, {
        headers: {
            authorization: localStorage.getItem('token')
        }
    });

    const data = await res.json();
    const collectionsData = data.CollectionData;

    data.CollectionData.forEach(collection => {
        const card = document.createElement('div');
        card.className = 'collection-card';

        const title = document.createElement('h3');
        title.textContent = collection.name;
        title.style.cursor = 'pointer';
        title.addEventListener('click', () => {
            console.log('Clicked a Collection: ' + collection.name);
            window.location.href=`${backendAPI}/collection/get-collection-details?id=${collection.id}`;
        })

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click',async() => {
            console.log('Delete this Collection ' + collection.name);
            await fetch(`${backendAPI}/collection/delete-collection/${collection.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: localStorage.getItem('token')
                }
            });
            alert('Collection has been deleted!');
            card.remove();
        });

        card.appendChild(title);
        card.appendChild(delBtn);
        console.log(card);
        container.appendChild(card);
    })

    console.log(collectionsData);
});

