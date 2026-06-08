const formLogin = document.getElementById('login-form');

formLogin.addEventListener('submit',async function(e){
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/user/login',{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json'
        },
        credentials : 'include',
        body: JSON.stringify({ username, password })
    })
    const data = await response.json();

    if(response.ok){
        window.location.href = 'index.html';
    }else{
        alert(data.message)
    }
})