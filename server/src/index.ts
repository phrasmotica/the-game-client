import express from "express"
import http from "http"
import socketIo, { Socket } from "socket.io"

import { RoomDataManager } from "./data/RoomDataManager"

import { GameData } from "./models/GameData"
import { Message } from "./models/Message"
import { RoomData } from "./models/RoomData"

const port = process.env.PORT || 4001

const app = express()

app.get("/", (req, res) => {
    res.send("<h1>Welcome to the server!</h1>")
})

const server = http.createServer(app)

const io = socketIo(server)

const gameDataManager = new RoomDataManager()

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
    return Message.info(gameDataManager.getRoomData(roomName))
}

io.on("connection", (socket: Socket) => {
    let roomName = "polysomn"
    socket.join(roomName)
    console.log(`Player ${socket.id} joined room ${roomName}`)

    // TODO: we can't incrementally add game data propagation until it's determined by the server.
    // So move all of that to the server and then look into emitting it to the clients

    // create game data for the room if necessary
    gameDataManager.ensureRoomExists(roomName)

    // add the new player to the game
    gameDataManager.addToGame(socket.id, roomName)

    // send room data to all clients
    io.in(roomName).emit("roomData", createRoomDataMessage(roomName))

    socket.on("roomData", (message: Message<RoomData>) => {
        console.log(`Player ${socket.id} data for room ${roomName}:`)
        console.log(message.content)
        gameDataManager.setGameData(roomName, GameData.from(message.content.gameData))
        socket.to(roomName).emit("roomData", createRoomDataMessage(roomName))
    })

    socket.on("disconnect", () => {
        console.log(`Player ${socket.id} left room ${roomName}`)
        socket.to(roomName).emit("roomData", createRoomDataMessage(roomName))

        // clean up room if it's now empty
        if (getNumberOfClientsInRoom("/", roomName) <= 0) {
            console.log(`Room ${roomName} is now empty`)
            gameDataManager.removeRoom(roomName)
        }
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
