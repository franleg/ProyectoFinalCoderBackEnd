const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/login', {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => resp.json())
        .then(data => {
            console.log(data);
            if (data.status === "success") window.location.assign('/');
            else window.location.assign('/loginfail');
        })
})