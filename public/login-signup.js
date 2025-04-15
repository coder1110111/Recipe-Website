const backendAPI='http://localhost:3030'

async function checklogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${backendAPI}/userCheck/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });
        console.log('Login Request Sent!');
        if(response.ok) {
            const result = await response.json();
            if(result.message === 'Login Successful!') {
                localStorage.setItem("token", result.token);
                window.location.href = `${backendAPI}/home/page`;
            }
            console.log(result);
        }
        else if(!response.ok) {
            const error = await response.json();
            alert(error.message);
        }
    } catch(err) {
        console.log(err);
    }
}

async function checkSignUp(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('passwrd').value;
    const rePass = document.getElementById('repeat_passwrd').value;
    const adminCheck = document.getElementById('admin');
    let is_admin;
    if(adminCheck.checked == true) {
        is_admin=true;
    }
    else {
        is_admin=false;
    }

    const errSpan = document.getElementById('error');
    if(rePass !== password) {
        console.log('Incorrect Password Detected!');
        errSpan.innerHTML = "<span style='color: red;'>" + "Password does not match!</span>"
    } else {
        errSpan.innerHTML=``;
        console.log('Proceeding!');
        console.log(username,' ', email, ' ', password, ' ', is_admin);

        try {

            const response = await fetch(`${backendAPI}/userCheck/create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, email, password, is_admin})
            });

            console.log('Request Sent!');
            if(response.ok) {
                alert('User Created!');
                window.location.href=`${backendAPI}/userCheck/login`;
            } else {
                if(response.status === 409) {
                    alert('Email already in Use!');
                } else if(response.status === 500) {
                    alert("Server Down!");
                }
            }

        } catch {
            alert("Server Unavailable!");
        }
    }
}