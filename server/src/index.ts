import express from "express"
import http from "http"
import socketIo, { Socket } from "socket.io"

import { Message } from "./models/Message"

const port = process.env.PORT || 4001

const app = express()

app.get("/", (req, res) => {
    res.send("<h1>Welcome to the server!</h1>")
})

const server = http.createServer(app)

const io = socketIo(server)

/**
 * Returns the number of clients in the given room.
 */
function getNumberOfClientsInRoom(namespace: string, roomName: string) {
    var clients = io.nsps[namespace].adapter.rooms[roomName]?.sockets
    if (clients === undefined) {
        return 0
    }

    return Object.keys(clients).length
}

/**
 * Creates a room data message.
 */
function createRoomDataMessage(roomName: string) {
    return Message.info({
        name: roomName,
        numberOfPlayers: getNumberOfClientsInRoom("/", roomName)
    })
}

io.on("connection", (socket: Socket) => {
    console.log(`Player ${socket.id} joined`)

    let roomName = "game room"
    socket.join(roomName)

    io.in(roomName).emit("roomData", createRoomDataMessage(roomName))

    socket.on("disconnect", () => {
        console.log(`Player ${socket.id} left`)
        socket.to(roomName).emit("roomData", createRoomDataMessage(roomName))
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
