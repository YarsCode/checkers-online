import {userLogin, displayErrorMsg} from './utils/httpRequests.js'

let loggedUser;
document.body.style.visibility = "visible"

loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
// sessionStorage.clear()
if (loggedUser) {
    location.href = "/"
} else {
    loggedUser = undefined
}

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        email: loginForm.email.value,
        password: loginForm.password.value,
    };
    const user = await userLogin(data);
    // admin = await adminLogin(data);
    if (user.status === 400)
        displayErrorMsg(loginForm, "Your email and/or password were incorrect.");
    else {
        loggedUser = user
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser))
        location.href = "/";
        // loggedUser = {
            
        // }
        // console.log(loggedUser.user.nickname);
    }
});

// const user = {
//     name:'kai',
//     age: 18
// }
// console.log(user);
// console.log(JSON.stringify(user));

// sessionStorage.setItem('user', JSON.stringify(user))
// const user2 = sessionStorage.getItem('user')
// sessionStorage.clear()
// console.log(JSON.parse(user2));
// console.log(sessionStorage);