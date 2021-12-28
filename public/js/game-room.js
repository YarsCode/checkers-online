const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
import { setUserInfoUI } from "./utils/userInfoUI.js";
import { editUser, userLogout } from "./utils/httpRequests.js";

if (!loggedUser) {
    location.href = "/login";
} else {
    document.body.style.visibility = "visible"
    document.querySelector(".user-info").style.display = "flex";
    document.querySelector("#logout-button").style.display = "flex";
}

let room = window.location.href.split("/", 4)[3];

if (room === "") {
    room = "lobby"
}

setUserInfoUI(loggedUser);
const logoutButton = document.getElementById("logout-button");
const versusHeader = document.getElementById("versus-header");

logoutButton.addEventListener("click", async (e) => {
    userLogout(loggedUser.user);
    localStorage.clear();
    location.href = "/login";
});

const preventUnwantedUsers = () => {
    if (room !== "lobby") {
        const users = Object.values(Qs.parse(location.search, { ignoreQueryPrefix: true }));
        if (users) {
            const unwantedUser = users.find(user => loggedUser.user.nickname === user)
            if (!unwantedUser) { // This is a little bit confusing - if the user hasn't been found, the unwantedUser variable will be undefined, so it actually means that he IS an unwanted user.
                location.href = "/"
            }
        }
    }
}
preventUnwantedUsers()

const setVersusHeader = (room, players, socket) => {
    if (room !== "lobby" && players.length == 2) {
        const player1 = players.filter((player) => player.id === socket.id)[0];
        const player2 = players.filter((player) => player.id !== socket.id)[0];
        versusHeader.innerHTML = `${player1.username} VS. ${player2.username}`;
    }
};

const calculateExpForPlayers = (players) => {
    if (players.length == 2) {
        const winner = players[0].hasWon ? players[0] : players[1]
        const loser = !players[0].hasWon ? players[0] : players[1]
        console.log(loser.level.currentExp);
        let expForWinner = 30, expForLoser = 10, difference;
        if (winner.level.level >= loser.level.level) {
            difference = winner.level.level - loser.level.level;
        } else {
            difference = loser.level.level - winner.level.level;
            expForWinner += difference * 10
            expForLoser -= difference * 2
            if (expForLoser < 0) expForLoser = 0
        }
        editUser(winner, { exp: winner.totalExp + expForWinner })
        editUser(loser, { exp: loser.totalExp + expForLoser })
        loser.level.currentExp
        delete loggedUser.hasWon
        if (winner.name === loggedUser.user.nickname) {
            loggedUser.user.exp = winner.totalExp + expForWinner
        } else if (loser.name === loggedUser.user.nickname) {
            console.log(loser.level.currentExp);
            loggedUser.user.exp = loser.totalExp + expForLoser
        }
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser))
    }
};
export { setVersusHeader, calculateExpForPlayers };
