const socket = io();

import { autoscroll } from "../chat.js";
import { calculateExpForPlayers, setVersusHeader } from "../game-room.js";
import { createLoader, createCountdown, displayGameInvitationModal, displayUsers, setOptionToInvitePlayersToPlay, hideGameInvitationModal, showResponseButtons, hideResponseButtons } from "./loadSidebarData.js";
import { calculateLevelDetails } from "./progressBarBehavior.js";

const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
let room = window.location.href.split("/", 4)[3];

if (room === "") {
    room = "lobby";
}

socket.emit("join", { username: loggedUser.user.nickname, room }, (error) => {});

let usersInRoom, hasAllPlayersEnteredTheGame = false;

// const versusHeader = document.getElementById("versus-header");
socket.on("roomData", ({ room, users, thisUser }) => {
    // sessionStorage.removeItem('usersInRoom');
    usersInRoom = users;
    if (room === "lobby") {
        displayUsers(users, socket.id, room);
        setOptionToInvitePlayersToPlay(users);
    }
    setVersusHeader(room, users, socket);
    // if (room.split("?")[0] === "game-room") {
    //     if (users.length === 2) {
    //         hasAllPlayersEnteredTheGame = true
    //     } else if (hasAllPlayersEnteredTheGame) {
    //         setTimeout(() => {
    //             console.log("BYE BYE");
                
    //         }, 3000);
    //     }
    // //     calculateExpForPlayers(users, loggedUser)
    // }
    // setColorsToPlayers(thisUser, socket.id)
});

const Chat = ($messages, $messageForm, $messageFormButton, $messageFormInput, messageTemplate) => {
    socket.on("message", (message) => {
        $messages.insertAdjacentHTML("beforeend", messageTemplate);
        autoscroll();
        const text = moment(message.createdAt).format("H:mm") + ": " + message.username + " - " + message.text;
        $messages.children[$messages.children.length - 1].lastElementChild.innerHTML = text;
    });

    // Sends the message to the server which then sends it to all the other users
    $messageForm.addEventListener("submit", (e) => {
        e.preventDefault();

        $messageFormButton.setAttribute("disabled", "disabled");

        const message = e.target.elements.message.value;

        socket.emit("sendMessage", message, () => {
            // console.log(message);
            $messageFormButton.removeAttribute("disabled");
            $messageFormInput.value = "";
            $messageFormInput.focus();
            console.log("Message delivered!");
        });
    });
};

const SendPlayersToRoom = (player1, player2) => {
    // console.log(socket.id);
    socket.emit("SendPlayersToRoom", { player1, player2 });
};

const displayGameInvitationModalSocket = (player1, player2) => {
    // console.log(socket.id);
    socket.emit("displayGameInvitationModal", { player1, player2 });
    // handleInvitationResponse(player1, player2)
};

socket.on("displayInvitation", ({ player1, player2}, text) => {
    handleInvitationResponse(player1, player2)
    displayGameInvitationModal(text, "#4a4e69")
    showResponseButtons()    
})
socket.on("displayPending", ({ player1, player2}, text) => {
    hideResponseButtons()
    createLoader(text);
    createCountdown(30);
})

// const accept = document.getElementById("accept-invitation");
// accept.addEventListener("mouseover", (e) => {
//     console.log("WORKS");
// });

const handleInvitationResponse = (player1, player2) => {
    const accept = document.getElementById("accept-invitation");
    const decline = document.getElementById("decline-invitation");
    accept.addEventListener("click", (e) => {
        // console.log(true);
        socket.emit("response", {player1, player2}, true);
    });
    decline.addEventListener("click", (e) => {
        socket.emit("response", {player1, player2}, false);
    });
}

socket.on("isAccepted", ({ player1, player2 }, response) => {
    // const gameInvitationModal = document.getElementById("game-invitation-modal")
    if (response) {
        setColorsToPlayers(player1, player2)
        location.href = `/game-room?p1=${player1.username}&p2=${player2.username}`;
    } else {
        hideGameInvitationModal()
    }
})

socket.on("returnPlayersToLobby", (users) => {
    // console.log(room);
    console.log(users);
    if (users.length === 2) {

    } else {
        location.href = "/"
    }
})

// socket.emit("getCurrentRoom", room)

const setColorsToPlayers = (player1, player2) => {
    // console.log(loggedUser.user.nickname);
    // console.log(player2);
    // const { p1, p2 } = Qs.parse(location.search, { ignoreQueryPrefix: true });
    if (player1.username === loggedUser.user.nickname) {
        loggedUser.isWhite = true;
    } else if (player2.username === loggedUser.user.nickname) {
        loggedUser.isWhite = false;
    }
    sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser))
    
    // if (room !== 'lobby') {
    //     if (loggedUser.user.nickname === p1) {
    //         loggedUser.isWhite = true
    //     } else {
    //         loggedUser.isWhite = false
    //     }
    //     sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser))
    // }
}
let playerDetails = [];

socket.on("getPlayerExp", (user, hasWon) => {
    playerDetails.push({token: user.token, name: user.user.nickname, totalExp: user.user.exp, level: calculateLevelDetails(user.user.exp), hasWon})
    calculateExpForPlayers(playerDetails)
})


// console.log(expOfPlayers);

export { Chat, SendPlayersToRoom, displayGameInvitationModalSocket };