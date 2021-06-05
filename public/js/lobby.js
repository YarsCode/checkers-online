const socket = io();

const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
import { setUserInfoUI } from "./utils/userInfoUI.js";
import { userLogout } from "./utils/httpRequests.js";
// import { sendMessage } from "./utils/sockets.js";
// import { displayMessage } from "./chat.js";
// console.log(loggedUser);
// sessionStorage.clear()

if (!loggedUser) {
    location.href = "/login";
} else {
    document.querySelector(".user-info").style.display = "flex";
    document.querySelector("#logout-button").style.display = "flex";
}
setUserInfoUI(loggedUser);
const logoutButton = document.getElementById("logout-button");
const sidebar = document.getElementById("sidebar");
const $messageForm = document.getElementById("message-form");
const $messageFormInput = document.getElementById("message-form-input");
const $messageFormButton = document.getElementById("message-form-send-button");
const $messages = document.getElementById("messages");

const messageTemplate = document.getElementById("message-template").innerHTML;
let room = window.location.href.split("/", 4)[3];

if (room === "") {
    room = "lobby"
}

// const $messageForm = document.getElementById("message-form");

// const userAvatar = document.getElementById("user-avatar");
// const userNickname = document.getElementById("user-nickname");
// const filledProgressBar = document.getElementById("filled-bar");
// const emptyProgressBar = document.getElementById("empty-bar");
// userAvatar.src = loggedUser.user.avatar
// userNickname .innerHTML = loggedUser.user.nickname
// socket.emit("join", { username: loggedUser.user.nickname, room }, (error) => {
    
// });

logoutButton.addEventListener("click", async (e) => {
    userLogout(loggedUser);
    sessionStorage.clear();
    location.href = "/login";
});

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};

socket.emit("join", { username: loggedUser.user.nickname, room }, (error) => {
    
});

socket.on("message", (message) => {
    console.log(message);
    // const html = Mustache.render(messageTemplate)
    // console.log(messageTemplate);
    // console.log(html);
    $messages.insertAdjacentHTML("beforeend", messageTemplate);
    autoscroll();
    const text = moment(message.createdAt).format("H:mm") + ": " + message.username + " - " + message.text;
    $messages.children[$messages.children.length - 1].lastElementChild.innerHTML = text;
});

socket.on('roomData', ({ room, users }) => {
    // console.log(room);
    // console.log(users);
})

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

// socket.on("message", (message) => {
//     console.log("🚀 ~ file: lobby.js ~ line 46 ~ socket.on ~ message", message)
//     displayMessage(message)
// });


// socket.on('logout', async () => {
//     await userLogout(loggedUser)    
//     console.log('done');
// })

// $messageForm.addEventListener("submit", (e) => {
//     e.preventDefault()
//     const message = e.target.elements.message.value

//     socket.emit('sendMessage', message, (error) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message delivered!');
//     })
// });

// socket.on('message', (message) => {
//     console.log(message);
// })
