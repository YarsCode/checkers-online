// import { userLogout } from './httpRequests.js'
import { calculateLevelDetails, CalculateProgressBarPercents } from "./progressBarBehavior.js"

const userAvatar = document.getElementById("user-avatar");
const userNickname = document.getElementById("user-nickname");
const filledProgressBar = document.getElementById("filled-bar");
const emptyProgressBar = document.getElementById("empty-bar");
const currentLevel = document.getElementById("level");
// const logoutButton = document.getElementById("logout-button");

const setUserInfoUI = (loggedUser) => {
    userAvatar.src = loggedUser.user.avatar;
    userNickname.innerHTML = loggedUser.user.nickname;

    // logoutButton.addEventListener("click", async (e) => {
    //     userLogout(loggedUser.user);
    //     localStorage.clear();
    //     location.href = "/login";
    // });
    // filledProgressBar.innerHTML = "30%"
    currentLevel.innerHTML = calculateLevelDetails(loggedUser.user.exp).level
    filledProgressBar.style.width = `${CalculateProgressBarPercents(loggedUser.user.exp).filledBarPercent}%`;
    emptyProgressBar.style.width = `${CalculateProgressBarPercents(loggedUser.user.exp).emptyBarPercent}%`;
};

export {setUserInfoUI}
