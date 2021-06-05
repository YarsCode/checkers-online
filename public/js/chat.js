const socket = io();

const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
const $messageForm = document.getElementById("message-form");
const $messageFormInput = document.getElementById("message-form-input");
const $messageFormButton = document.getElementById("message-form-send-button");
const $messages = document.getElementById("messages");
// import { sendMessage, join, lad } from "./utils/sockets.js";

const messageTemplate = document.getElementById("message-template").innerHTML;
let room = window.location.href.split("/", 4)[3];
// let room = Qs.parse(location.search, { ignoreQueryPrefix: true });
// console.log("🚀 ~ file: chat.js ~ line 12 ~ room", room)

if (room === "") {
    room = "lobby"
}
// lad()
// join(loggedUser.user.nickname, room)
// socket.emit("join", { username: loggedUser.user.nickname, room }, (error) => {
    
// });

// const autoscroll = () => {
//     // New message element
//     const $newMessage = $messages.lastElementChild;

//     // Height of the new message
//     const newMessageStyles = getComputedStyle($newMessage);
//     const newMessageMargin = parseInt(newMessageStyles.marginBottom);
//     const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

//     // Visible height
//     const visibleHeight = $messages.offsetHeight;

//     // Height of messages container
//     const containerHeight = $messages.scrollHeight;

//     // How far have I scrolled?
//     const scrollOffset = $messages.scrollTop + visibleHeight;

//     if (containerHeight - newMessageHeight <= scrollOffset) {
//         $messages.scrollTop = $messages.scrollHeight;
//     }
// };

// displayMessage(message, $messages)

// socket.on("message", (message) => {
//     // console.log(message);
//     // const html = Mustache.render(messageTemplate)
//     // console.log(messageTemplate);
//     // console.log(html);
//     $messages.insertAdjacentHTML("beforeend", messageTemplate);
//     autoscroll();
//     const text = moment(message.createdAt).format("H:mm") + ": " + message.username + " - " + message.text;
//     $messages.children[$messages.children.length - 1].lastElementChild.innerHTML = text;
// });

// socket.on("message", (message) => {
//     // console.log(message);
//     // const html = Mustache.render(messageTemplate)
//     // console.log(messageTemplate);
//     // console.log(html);
//     $messages.insertAdjacentHTML("beforeend", messageTemplate);
//     autoscroll();
//     const text = moment(message.createdAt).format("H:mm") + ": " + message.username + " - " + message.text;
//     $messages.children[$messages.children.length - 1].lastElementChild.innerHTML = text;
// });

// $messageForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     $messageFormButton.setAttribute("disabled", "disabled");

//     const message = e.target.elements.message.value;

//         socket.emit("sendMessage", message, () => {
//         sendMessage(message, $messageFormButton, $messageFormInput)
//     });
// });

// const displayMessage = (message) => {
// // console.log("🚀 ~ file: chat.js ~ line 57 ~ displayMessage ~ message", message)
//     $messages.insertAdjacentHTML("beforeend", messageTemplate);
//     autoscroll();
//     const text = moment(message.createdAt).format("H:mm") + ": " + message.username + " - " + message.text;
//     $messages.children[$messages.children.length - 1].lastElementChild.innerHTML = text;
// }

// roomData()
// socket.on('roomData', ({ room, users }) => {
//     console.log(room);
//     console.log(users);
// })

// socket.on('roomData', ({ room, users }) => {
//     console.log(room);
//     console.log(users);
// })

// $messageForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     $messageFormButton.setAttribute("disabled", "disabled");

//     const message = e.target.elements.message.value;

//     socket.emit("sendMessage", message, () => {
//         console.log(message);
//         $messageFormButton.removeAttribute("disabled");
//         $messageFormInput.value = "";
//         $messageFormInput.focus();
//         console.log("Message delivered!");
//     });
// });

// export {displayMessage}