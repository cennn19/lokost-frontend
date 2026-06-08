const formRegis = document.getElementById('register-form');

formRegis.addEventListener('submit',async function(e){
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(password.length < 8){
        alert("Password minimal 8 karakter")
        return;
    }

    const response = await fetch('https://lokost-backend-production.up.railway.app/api/user/register',{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    const data = await response.json();

    if(response.ok){
        window.location.href = 'login.html';
    }else{
        alert(data.message)
    }
})