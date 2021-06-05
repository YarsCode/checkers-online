import {displayErrorMsg} from './httpRequests.js'

function isValidPassword(password) {
    if (password.length < 8)
        return false;
    let uppercase = 0, lowercase = 0, digit = 0, symbol = 0;
    let symbols = "!@#$%^&*()"
    for (let i = 0; i < password.length; i++) {
        if (password[i] >= 0 && password[i] <= 9) {
            digit++;
            continue;
        }
        if (password[i] === password[i].toUpperCase())
            uppercase++;
        if (password[i] === password[i].toLowerCase())
            lowercase++;
        for (let j = 0; j < password.length && symbol === 0; j++) {
            if (password[i] === symbols[j]) {
                symbol++;
            }
        }
    }
    if (uppercase >= 1 && lowercase >= 1 && digit >= 1 && symbol >= 1)
        return true;
    else
        return false;
}

function isSignupFormValid (location, email, pass, passConfirmation) {
    if (pass !== passConfirmation) {
        displayErrorMsg(location, "Passwords doesn't match.");
        return false;
    }
    if (!isValidPassword(pass)) {
        displayErrorMsg(location, "Password must contain at least 8 characters, digits, uppercase & lowercase and symbols.")
        return false;
    }
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!mailRegex.test(email)) {
        displayErrorMsg(location, "Invalid email!")
        return false;
    }
    return true;
}

export {isSignupFormValid}