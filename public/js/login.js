const loginForm = document.getElementById("login-form");

//   Http Requests
// _________________

async function userLogin(data) {
    const user = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((result) => {
        return result.json();
    });
    return user;
}

function displayErrorMsg (location, message) {
    const p = document.createElement('p');
    // if (isUp) {
        location.removeChild(location.childNodes[0]);
        location.prepend(p);
    // }
    // else {
        // if (location.childNodes[location.childNodes.length - 1].innerHTML === "Already in cart!")
        //     location.removeChild(location.childNodes[location.childNodes.length - 1]);
        // location.appendChild(p);
    // }
    p.innerHTML = message;
    p.style.color = "#9e3a33";
    p.style.fontWeight = "bold";
    p.style.fontSize = "1.2rem"
}

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
        location.href = "/";
    }
});
