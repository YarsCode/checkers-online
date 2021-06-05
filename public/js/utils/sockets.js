// const socket = io();

// const sendMessage = (message, $messageFormButton, $messageFormInput) => {
//     // socket.emit("sendMessage", message, () => {
//         console.log(message);
//         $messageFormButton.removeAttribute("disabled");
//         $messageFormInput.value = "";
//         $messageFormInput.focus();
//         console.log("Message delivered!");
//     // });
// }

// const join = (username, room) => {
//     console.log('wevwev');
//     socket.emit("join", { username, room }, (error) => {
    
//     });
// }

// const roomData = () => {
//     socket.on('roomData', ({ room, users }) => {
//         console.log(room);
//         console.log(users);
//     })
// }

// const displayMessage = (message, $messages) => {
//     socket.on("message", (message) => {
//         // console.log(message);
//         // const html = Mustache.render(messageTemplate)
//         // console.log(messageTemplate);
//         // console.log(html);
//         $messages.insertAdjacentHTML("beforeend", messageTemplate);
//         // autoscroll();
//         const text = moment(message.createdAt).format("H:mm") + ": " + message.username + " - " + message.text;
//         $messages.children[$messages.children.length - 1].lastElementChild.innerHTML = text;
//     });
// }

// const lad = () => {
//     console.log('wmoo');
// }

// export { sendMessage, join, lad }