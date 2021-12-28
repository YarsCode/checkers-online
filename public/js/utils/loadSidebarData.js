import { SendPlayersToRoom, displayGameInvitationModalSocket } from "./sockets.js";

// const socket = io();

const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
const sidebar = document.getElementById("sidebar");
// const modal = document.getElementById("invite-to-play-button-modal-container");
const dropdown = document.getElementById("game-invitation-dropdown");
const gameInvitationModal = document.getElementById("game-invitation-modal")
const gameInvitationModalContent = document.getElementById("game-invitation-modal-content");
let invitationMessageDiv = document.getElementById("invitation-message")

// if (!loggedUser) {
//     location.href = "/login";
// } else {
//     document.querySelector(".user-info").style.display = "flex";
//     document.querySelector("#logout-button").style.display = "flex";
// }

let room = window.location.href.split("/", 4)[3];

if (room === "") {
    room = "lobby";
}

// socket.emit("join", { username: loggedUser.user.nickname, room }, (error) => {

// });

const displayUsers = (users, thisUser, room) => {
    for (let i = sidebar.children.length - 1; i > 0; i--) {
        sidebar.children[i].remove();
    }
    const usersExceptThisUser = users.filter((user) => user.id !== thisUser);

    usersExceptThisUser.forEach((user) => {
        // debugger
        const div = document.createElement("div");
        div.innerHTML = user.username;
        div.className = "name-and-dropdown-container"
        sidebar.appendChild(div);
        if (room === "lobby") {
            const div2 = document.createElement("div");
            const button = document.createElement("button");
            div2.className = "game-invitation-dropdown-container";
            button.innerHTML = "Invite to Game";
            button.className = "game-invitation-dropdown";
            div.appendChild(div2);
            div2.appendChild(button);
            button.addEventListener("click", (e) => {
                const player1 = users.filter((user) => user.id === thisUser)[0];
                displayGameInvitationModalSocket(player1, user)
                SendPlayersToRoom(player1, user);
            });
        }
    });
};

const displayGameInvitationDropdown = (user) => {
    // modal.style.display = "flex"
    // dropdown.style.display = "flex"
    // if (user.children.length > 0) {
    if (room === "lobby") {
        user.children[0].children[0].style.display = "flex";
    }
    // }
};

const hideGameInvitationDropdown = (user) => {
    // modal.style.display = "none"
    // dropdown.style.display = "none"
    if (room === "lobby") {
        user.children[0].children[0].style.display = "none";
    }
};

const setOptionToInvitePlayersToPlay = (users) => {
    for (let i = sidebar.children.length - 1; i > 0; i--) {
        sidebar.children[i].addEventListener("mouseenter", (e) => {
            displayGameInvitationDropdown(e.target);
            // e.target.style.marginRight = "50px"
        });
        sidebar.children[i].addEventListener("mouseleave", (e) => {
            // e.target.style.marginRight = "0px"
            hideGameInvitationDropdown(e.target);
        });
    }
};
// const butt = document.getElementById("butt");
// butt.addEventListener("click", (e) => {
//     console.log("WORKS");
// });
// window.addEventListener("click", (e) => {
//     console.log(e.target);
// });

const hideResponseButtons = () => {
    const accept = document.getElementById("accept-invitation");
    const decline = document.getElementById("decline-invitation");
    accept.style.visibility = "hidden"
    decline.style.visibility = "hidden"
}

const showResponseButtons = () => {
    setTimeout(() => {
        const accept = document.getElementById("accept-invitation");
        const decline = document.getElementById("decline-invitation");
        accept.style.visibility = "visible"
        decline.style.visibility = "visible"        
    }, 500);
}

const hideGameInvitationModal = () => {
    invitationMessageDiv.innerHTML = "";
    hideResponseButtons()
    const timer = document.getElementById("timer");
    if (timer) timer.innerHTML = ""
    gameInvitationModal.style.visibility = "hidden"
    setTimeout(() => {
        gameInvitationModalContent.style.visibility = "hidden"
        gameInvitationModal.style.opacity = "0"    
        // gameInvitationModalContent.style.width = "0%"
    }, 100);
}

const displayGameInvitationModal = (text, color) => {
    gameInvitationModal.style.visibility = "visible"
    gameInvitationModalContent.style.visibility = "visible"
    hideResponseButtons()
    gameInvitationModal.style.opacity = "1"
    setTimeout(() => {
        // gameInvitationModalContent.style.width = "45%"
        invitationMessageDiv.innerHTML = "";
    }, 200);
    setTimeout(() => {
        invitationMessageDiv.innerHTML = text;
        invitationMessageDiv.style.color = color;
        
    }, 300);
    setTimeout(() => {
        hideGameInvitationModal()
    }, 30000);
}

const createLoader = (text) => {
    let len = text.length
    let dots = text.slice(len - 3)
    displayGameInvitationModal(text, "#4a4e69")
    let counter = 0;
    const loader = setInterval(() => {
        if (dots.length === 3) {
            invitationMessageDiv.innerHTML = text
            text = text.slice(0, length - 1)
            dots = '..'
        } else {
            invitationMessageDiv.innerHTML = text
            text = text + "."
            dots = '...'
        }
        counter++;
        if (counter === 30 || gameInvitationModal.style.visibility === "hidden") {
            invitationMessageDiv.innerHTML = ""
            clearInterval(loader)
        }
    }, 1000);
}

const createCountdown = (time = 0) => {
    const timer = document.createElement('div');
    timer.setAttribute('id', 'timer')
    timer.className = 'timer'
    timer.innerHTML = time;
    gameInvitationModalContent.append(timer)
    time--;
    const countdown = setInterval(() => {
        timer.innerHTML = time
        gameInvitationModalContent.append(timer)
        time--;
        if (time < 0 || gameInvitationModal.style.visibility === "hidden") {
            timer.innerHTML = ""
            timer.remove()
            clearInterval(countdown)
        }
    }, 1000);
}

export { displayUsers, setOptionToInvitePlayersToPlay, displayGameInvitationModal, hideGameInvitationModal, showResponseButtons, hideResponseButtons, createCountdown, createLoader };