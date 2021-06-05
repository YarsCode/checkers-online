const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isValidPassword = require("../../utils/passwordValidator");

const userSchema = new mongoose.Schema(
    {
        nickname: {
            type: String,
            unique: true,
            require: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid Email");
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: 8,
            validate(value) {
                if (!isValidPassword(value)) {
                    throw new Error(
                        "Password must contain at least 8 characters, digits, uppercase & lowercase and symbols."
                    );
                }
            },
        },
        exp: {
            type: Number,
            default: 0,
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
        avatar: {
            type: String,
            default: './img/avatars/no-image.png'
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.token;
    // delete userObj.avatar;
    
    return userObj;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "6h" });
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return user;
};

userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
