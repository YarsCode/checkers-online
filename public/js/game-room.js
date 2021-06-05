const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
import { setUserInfoUI } from "./utils/userInfoUI.js";
import { userLogout } from "./utils/httpRequests.js";

if (!loggedUser) {
    location.href = "/login";
} else {
    document.querySelector(".user-info").style.display = "flex";
    document.querySelector("#logout-button").style.display = "flex";
}
setUserInfoUI(loggedUser);
const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", async (e) => {
    userLogout(loggedUser.user);
    localStorage.clear();
    location.href = "/login";
});