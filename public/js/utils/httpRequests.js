async function userSignup(data) {
    const user = await fetch("http://localhost:3000/users", {
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

function userLogout(user) {
    fetch("http://localhost:3000/users/logout", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    })
        .then((result) => {
            return result.json();
        })
        .then((response) => {
            if (response.message === "Not authenticated") throw new Error();
            location.reload();
        });
}

function displayErrorMsg(location, message) {
    const p = document.createElement("p");
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
    p.style.fontSize = "1.2rem";
}

export { userSignup, userLogin, userLogout, displayErrorMsg };