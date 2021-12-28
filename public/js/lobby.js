const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
import { setUserInfoUI } from "./utils/userInfoUI.js";
import { userLogout } from "./utils/httpRequests.js";
// import { Chat } from "./utils/sockets.js";
import { enableChat } from "./chat.js";
// import { displayUsers, setOptionToInvitePlayersToPlay } from "./utils/loadSidebarData.js";
// import { sendMessage } from "./utils/sockets.js";
// import { displayMessage } from "./chat.js";
// console.log(loggedUser);
// sessionStorage.clear()

if (!loggedUser) {
    location.href = "/login";
    // document.body.style.visibility = "visible"
} else {
    document.body.style.visibility = "visible"
    document.querySelector(".user-info").style.display = "flex";
    document.querySelector("#logout-button").style.display = "flex";
}
setUserInfoUI(loggedUser);
const logoutButton = document.getElementById("logout-button");
let room = window.location.href.split("/", 4)[3];

if (room === "") {
    room = "lobby"
}

logoutButton.addEventListener("click", async (e) => {
    userLogout(loggedUser);
    sessionStorage.clear();
    location.href = "/login";
});

enableChat();
const body = document.querySelector("body");
// body.addEventListener("click", (e) => {
//     console.log(e.target);
// });
// const a = document.getElementById("message-form-send-button");
// a.addEventListener("click", (e) => {
//     console.log("TESA!");
// });