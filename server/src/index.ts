import express from "express"
import http from "http"
import socketIo, { Socket } from "socket.io"

import { RoomDataManager } from "./data/RoomDataManager"
import { SocketManager } from "./data/SocketManager"

import { GameData } from "./models/GameData"
import { Message } from "./models/Message"
import { RoomData } from "./models/RoomData"
import { RuleSet } from "./models/RuleSet"

require("dotenv").config({ path: `.env.${process.env.NODE_ENV || "local"}`})

const port = process.env.PORT || 4001

const app = express()

app.get("/", (req, res) => {
    res.send("<h1>Welcome to the server!</h1>")
})

const server = http.createServer(app)

const io = socketIo(server)

const socketManager = new SocketManager()
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
    // TODO: allow players to create and join rooms
    let roomName = "polysomn"

    socket.on("playerJoined", (playerName: string) => {
        socketManager.setPlayerName(socket.id, playerName)
        socket.emit("playerReceived")

        socket.join(roomName)

        // create game data for the room if necessary
        gameDataManager.ensureRoomExists(roomName)

        // add the new player to the game
        gameDataManager.addToRoom(playerName, roomName)
        gameDataManager.dealHand(playerName, roomName)

        // send room data to all clients
        let roomData = createRoomDataMessage(roomName)
        io.in(roomName).emit("roomData", roomData)
    })

    socket.on("newGame", (message: Message<RuleSet>) => {
        gameDataManager.newGame(roomName, message.content)

        io.in(roomName).emit("roomData", createRoomDataMessage(roomName))
    })

    socket.on("roomData", (message: Message<RoomData>) => {
        gameDataManager.setGameData(roomName, GameData.from(message.content.gameData))
        gameDataManager.processGameData(roomName)

        io.in(roomName).emit("roomData", createRoomDataMessage(roomName))
    })

    socket.on("endTurn", () => {
        gameDataManager.replenish(roomName)
        gameDataManager.nextPlayer(roomName)

        io.in(roomName).emit("roomData", createRoomDataMessage(roomName))
    })

    socket.on("disconnect", () => {
        let playerName = socketManager.getPlayerName(socket.id)
        console.log(`Player ${playerName} left room ${roomName}`)

        gameDataManager.removeFromGame(playerName, roomName)
        socketManager.removePlayerName(socket.id)

        socket.to(roomName).emit("roomData", createRoomDataMessage(roomName))

        // clean up room if it's now empty
        if (getNumberOfClientsInRoom("/", roomName) <= 0) {
            console.log(`Room ${roomName} is now empty`)
            gameDataManager.removeRoom(roomName)
        }
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
