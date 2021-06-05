import {userSignup, displayErrorMsg} from './utils/httpRequests.js'
import {isSignupFormValid} from './utils/signupFormValidator.js'

let avatarImg = document.getElementById("no-avatar");
const avatarSelection = document.getElementById("avatar-selection");
const signupForm = document.getElementById("signup-form");

let loggedUser;

loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
// sessionStorage.clear()
if (loggedUser) {
    location.href = "/"
} else {
    loggedUser = undefined
}

// Handles avatars

const displayAvatarSelection = (chosenAvatar) => {
    for (let i = 0; i < avatarSelection.children.length; i++) {
        if (chosenAvatar.id === avatarSelection.children[i].id) {
            const moveToTop = chosenAvatar;
            // moveToTop.style.transition = 'ease-in-out 0.6s'
            avatarSelection.children[i].remove;
            avatarSelection.prepend(moveToTop);
        }
        avatarSelection.children[i].removeAttribute("hidden");
    }
};

const hideAvatarSelection = (chosenAvatar) => {
    for (let i = 0; i < 9; i++) {
        if (avatarSelection.children[i].src !== chosenAvatar.src) {
            avatarSelection.children[i].setAttribute("hidden", "hidden");
        }
        if (avatarSelection.children[i].getAttribute("style")) {
            // avatar.style.marginRight = 'auto'
            avatarSelection.children[i].removeAttribute("style");
        }
    }
};

const isHidden = () => {
    let hiddenElements = 0;
    for (let i = 0; i < avatarSelection.children.length; i++) {
        if (avatarSelection.children[i].hasAttribute("hidden")) {
            hiddenElements++;
        }
        if (hiddenElements > 1) {
            return true;
        }
    }
    return false;
};

for (let i = 0; i < avatarSelection.children.length; i++) {
    avatarSelection.children[i].addEventListener("click", (e) => {
        const avatar = e.target;
        avatar.style.marginRight = "89.5%";
        avatarSelection.style.borderBottom = "1px #cccccc solid";
        avatarSelection.style.paddingBottom = "10px";
        // for (let i = 0; i < avatarSelection.children.length; i++) {

        //     avatar.style.transition = 'ease-in-out 0.6s'
        //     avatarSelection.children[i].style.justifyContent = 'center'
        // }
        if (isHidden()) {
            setTimeout(() => {
                displayAvatarSelection(avatar);
                avatar.style.marginRight = "0px";
            }, 500);
        } else {
            hideAvatarSelection(avatar);
            avatarSelection.style.transition = "ease 1s";
            avatarSelection.style.borderBottom = "0px";
            avatarSelection.style.paddingBottom = "0px";
        }
    });
}

// Post request



const getAvatar = () => {
    const avatarSelectionArray = Array.from(avatarSelection.children);
    const avatar = avatarSelectionArray.filter((element) => !element.hasAttribute("hidden"));
    return avatar[0].src;
};

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let avatar = "http://localhost:3000/img/avatars/no-image.png";
    if (isHidden()) {
        avatar = getAvatar();
    }
    const data = {
        avatar,
        nickname: signupForm.nickname.value,
        email: signupForm.email.value,
        password: signupForm.password.value,
    };
    // console.log(data);
    if (isSignupFormValid(signupForm, data.email, data.password, signupForm.passwordConfirmation.value)) {
        const user = await userSignup(data);
        if (user.name !== "MongoError" && user.code !== 11000) {
            loggedUser = user
            sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser))
            location.href = "/";            
        } else {
            displayErrorMsg(signupForm, "Nickname is already in use! Please pick another one.")
        }
    }
    // admin = await adminLogin(data);
    // if (user.status === 400)
    //     displayErrorMsg(signupForm, "Your email and/or password were incorrect.");
    // else {
        // loggedUser = user
        // sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser))
        // location.href = "/";
    // }
});
