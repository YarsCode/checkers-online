const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require('socket.io')
const cors = require("cors");
const hbs = require("hbs");
require("./db/db");
const userRouter = require("./routers/usersRouter");

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(express.static(publicDirectoryPath));

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

let count = 0

io.on('connection', (socket) => {
    console.log(('New WebSocket connection'));

    socket.emit('countUpdated', count)

    socket.on('increment', (callback) => {
        count++
        callback
        io.emit('countUpdated', count)
    })
})

const port = process.env.PORT;

server.listen(port, () => console.log("Server is running on port " + port));
