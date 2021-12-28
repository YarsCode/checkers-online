import { Chat } from "./utils/sockets.js";

// const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
const $messageForm = document.getElementById("message-form");
const $messageFormInput = document.getElementById("message-form-input");
const $messageFormButton = document.getElementById("message-form-send-button");
const $messages = document.getElementById("messages");

const messageTemplate = document.getElementById("message-template").innerHTML;
let room = window.location.href.split("/", 4)[3];

if (room === "") {
    room = "lobby"
}

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
const enableChat = () => {
    Chat($messages, $messageForm, $messageFormButton, $messageFormInput, messageTemplate);    
}

export {enableChat, autoscroll}