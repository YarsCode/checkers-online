const passwordValidator = require("password-validator");

const schema = new passwordValidator();

schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password', 'Password123']);

const isValidPassword = (password) => {
    return schema.validate(password, { list: true })
}

// console.log(isValidPassword('ergiunWIEUH@123', { list: true }));

module.exports = isValidPassword;