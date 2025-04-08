const backendAPI = 'http://localhost:3030/user'
async function checkForget(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    //console.log(email);

    const response = await fetch(`${backendAPI}/forgotPassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    });
    if(response.ok) {
        alert('Link Sent!');
    } else if(response.status === 404) {
        alert('User does not exist in system! Please sign-up');
    } else {
        alert('Something went Wrong!');
    }
}