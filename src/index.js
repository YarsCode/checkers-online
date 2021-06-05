const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const hbs = require("hbs");
require("./db/db");
const userRouter = require("./routers/usersRouter");
const { generateMessage } = require("../utils/messages.js");
const { addUser, removeUser, getUser, getUsersInRoom } = require("../utils/users.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
// const utilsDirectoryPath = path.join(__dirname, "../utils");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(express.static(publicDirectoryPath));
// app.use(express.static(utilsDirectoryPath));

app.get("", (req, res) => {
    res.render("index", {
        title: "Welcome to Checkers Online!",
        name: "Yars",
    });
});

app.get("/login", (req, res) => {
    res.render("login", {
        title: "Welcome to Checkers Online!",
        name: "Yars",
    });
});

app.get("/sign-up", (req, res) => {
    res.render("signup", {
        title: "Welcome to Checkers Online!",
        name: "Yars",
    });
});

app.get("/game-room", (req, res) => {
    res.render("game-room", {
        title: "Welcome to Checkers Online!",
        name: "Yars",
    });
});

// let count = 0

io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on("join", ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room})
        
        if (error) {
            return callback(error)
        }
        
        socket.join(user.room)
        console.log(error, user);

        socket.emit("message", generateMessage("Admin", "Welcome!"));
        socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} has joined the room!`));

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
        // console.log(username);
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id)
        console.log(socket.id);
        io.to(user.room).emit("message", generateMessage(user.username, message));
        callback();
    });

    socket.on("coordinates", (fromRow, fromCol, toRow, toCol) => {
        // console.log(`from: ${a},${b},  to: ${c},${d}`);
        socket.broadcast.emit("move", fromRow, fromCol, toRow, toCol);
        // io.emit('blu', a, b, c, d)
    });

    // socket.on('turnHandler', () => {
    socket.broadcast.emit("changeTurns");
    // })

    socket.on("isDoneMove", (isDoneMove) => {
        if (isDoneMove) {
            socket.broadcast.emit("proceedGame");
        }
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left the room!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        // io.emit('logout')
    });

    

    // socket.on('increment', (callback) => {
    //     count++
    //     callback
    //     io.emit('countUpdated', count)
    // })
});

const port = process.env.PORT;

server.listen(port, () => console.log("Server is running on port " + port));
