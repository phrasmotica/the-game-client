import express from "express"
import http from "http"
import socketIo, { Socket } from "socket.io"

import { RoomDataManager } from "./data/RoomDataManager"
import { SocketManager } from "./data/SocketManager"

import { GameData } from "./models/GameData"
import { Message } from "./models/Message"
import { RoomData } from "./models/RoomData"
import { RoomWith } from "./models/RoomWith"
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
const roomDataManager = new RoomDataManager()

/**
 * The name of the only room on the server.
 */
// TODO: allow players to create and join rooms
const roomName = "polysomn"
const roomRetentionList = [roomName]
roomDataManager.ensureRoomExists(roomName)

/**
 * Returns the number of clients in the given room.
 */
const getNumberOfClientsInRoom = (namespace: string, roomName: string) => {
    var clients = io.nsps[namespace].adapter.rooms[roomName]?.sockets
    if (clients === undefined) {
        return 0
    }

    return Object.keys(clients).length
}

/**
 * Cleans up the given room.
 */
const cleanRoom = (roomName: string) => {
    let roomIsEmpty = getNumberOfClientsInRoom("/", roomName) <= 0
    if (roomIsEmpty) {
        roomDataManager.setRuleSet(roomName, RuleSet.default())

        let shouldRemoveRoom = !roomRetentionList.includes(roomName)
        if (shouldRemoveRoom) {
            console.log(`Removing room ${roomName}`)
            roomDataManager.removeRoom(roomName)
        }
    }
}

/**
 * Creates a room data message.
 */
const createRoomDataMessage = (roomName: string) => {
    return Message.info(roomDataManager.getRoomData(roomName))
}

io.on("connection", (socket: Socket) => {
    socket.on("joinServer", (playerName: string) => {
        socketManager.setPlayerName(socket.id, playerName)
        console.log(`Player ${playerName} joined the server!`)

        socket.emit("joinServerReceived", roomDataManager.getAllRoomData())
    })

    socket.on("joinRoom", (req: RoomWith<string>) => {
        let roomName = req.roomName
        socket.join(roomName)

        let playerName = req.data
        console.log(`Player ${playerName} joined room ${roomName}.`)

        // create game data for the room if necessary
        roomDataManager.ensureRoomExists(roomName)

        // add the new player to the room
        roomDataManager.addPlayerToRoom(playerName, roomName)

        socket.emit("joinRoomReceived")

        // send room data to all clients
        io.in(roomName).emit("roomData", createRoomDataMessage(roomName))
    })

    socket.on("setRuleSet", (req: RoomWith<RuleSet>) => {
        let roomName = req.roomName
        let ruleSet = RuleSet.from(req.data)
        roomDataManager.setRuleSet(roomName, ruleSet)

        io.in(roomName).emit("roomData", createRoomDataMessage(roomName))
    })

    // TODO: allow players to join game as a spectator

    socket.on("startGame", () => {
        roomDataManager.startGame(roomName)

        io.in(roomName).emit("gameStarted", createRoomDataMessage(roomName))
    })

    socket.on("roomData", (message: Message<RoomData>) => {
        let gameData = GameData.from(message.content.gameData)
        roomDataManager.setGameData(roomName, gameData)
        roomDataManager.processGameData(roomName)

        io.in(roomName).emit("roomData", createRoomDataMessage(roomName))
    })

    socket.on("endTurn", () => {
        roomDataManager.replenish(roomName)
        roomDataManager.nextPlayer(roomName)

        io.in(roomName).emit("roomData", createRoomDataMessage(roomName))
    })

    socket.on("leaveRoom", (req: RoomWith<string>) => {
        let roomName = req.roomName
        let playerName = req.data

        roomDataManager.removeFromRoom(playerName, roomName)
        socket.leave(roomName)

        socket.to(roomName).emit("roomData", createRoomDataMessage(roomName))

        console.log(`Player ${playerName} left room ${roomName}`)

        cleanRoom(roomName)
    })

    socket.on("disconnect", () => {
        let playerName = socketManager.getPlayerName(socket.id)
        if (playerName !== undefined) {
            let roomsEvicted = roomDataManager.removePlayer(playerName)
            for (let roomName of roomsEvicted) {
                cleanRoom(roomName)
            }

            socketManager.removePlayerName(socket.id)

            console.log(`Player ${playerName} left the server.`)
        }
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
