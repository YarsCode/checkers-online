const { generateMessage } = require("../utils/messages.js");
const { addUser, removeUser, getUser, getUsersInRoom } = require("../utils/users.js");

const sockets = (io) => {
    io.on("connection", (socket) => {
        console.log("New WebSocket connection");
    
        socket.on("join", ({ username, room }, callback) => {
            const { error, user } = addUser({ id: socket.id, username, room})
            
            if (error) {
                return callback(error)
            }
            
            socket.join(user.room)
            socket.emit("message", generateMessage("Admin", "Welcome!"));
            socket.broadcast.to(user.room).emit("message", generateMessage("Admin", `${user.username} has joined the room!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room),
                thisUser: user
            })
            callback()
            // console.log(username);
        });
    
        socket.on("sendMessage", (message, callback) => {
            const user = getUser(socket.id)
            io.to(user.room).emit("message", generateMessage(user.username, message));
            callback();
        });

        // socket.on("getCurrentRoom", (room) => {
        //     const users = getUsersInRoom(room)
        //     io.to(room).emit("usersInRoom", users)
        // })

        socket.on("displayGameInvitationModal", ({ player1, player2 }) => {
            io.to(player2.id).emit("displayInvitation", { player1, player2}, `${player1.username} has invited you to play!`);
            io.to(player1.id).emit("displayPending", { player1, player2}, `Waiting for ${player2.username}'s response...`);
        })

        socket.on("response", ({player1, player2}, response) => {
            io.to(player1.id).to(player2.id).emit("isAccepted", { player1, player2}, response);
        })
    
        socket.on("SendPlayersToRoom", ({player1, player2}, choice) => {
            // io.to(player2.id).emit("gameInvitation", {player1, player2}, choice);
            // console.log(choice);
            io.to(player1.id).to(player2.id).emit("sendToRoom", {player1, player2}, choice);
        })
    
        socket.on("gameData", (fromRow, fromCol, toRow, toCol, isTryingToCapture, isCrownedThisTurn, piecesCapturedThisTurn) => {
            socket.broadcast.emit("move", fromRow, fromCol, toRow, toCol, isTryingToCapture, isCrownedThisTurn, piecesCapturedThisTurn);
        });

        socket.on("sendPlayer", (user, hasWon) => {
            io.emit("getPlayerExp", user, hasWon)
        })

        let hasUserLeftTheGame = false;

        // socket.on("hasUserLeft", (hasLeft) => {
        //     if
        // })
    
        socket.on("disconnect", () => {
            const user = removeUser(socket.id)
            if (user) {
                if (user.room !== "lobby") {
                    io.in(user.room).emit("returnPlayersToLobby", getUsersInRoom(socket.id))
                }
                io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left the room!`));
                io.to(user.room).emit('roomData', {
                    room: user.room,
                    users: getUsersInRoom(user.room),
                    thisUser: user
                })
            }
        });
    });
}

module.exports = {
    sockets
};