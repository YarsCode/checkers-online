async function userSignup(data) {
    const user = await fetch("/users", {
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
    const user = await fetch("/users/login", {
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
    fetch("/users/logout", {
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

function editUser (user, data) {
    fetch (`/users/me`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
    })
    .then((result) => {         
        return result.json()
    })
    .catch((err) => {
        console.log(err.message);
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

export { userSignup, userLogin, userLogout, editUser, displayErrorMsg };