import express from "express"
import http from "http"
import socketIo, { Socket } from "socket.io"

import { RoomDataManager } from "./data/RoomDataManager"
import { SocketManager } from "./data/SocketManager"

import { GameData, GameStartResult } from "./models/GameData"
import { Message } from "./models/Message"
import { RoomData } from "./models/RoomData"
import { RoomWith } from "./models/RoomWith"
import { RuleSet } from "./models/RuleSet"
import { VoteResult } from "./models/voting/Vote"

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
 * Returns the clients in the given room.
 */
const getClientsInRoom = (namespace: string, roomName: string) => {
    var clients = io.nsps[namespace].adapter.rooms[roomName]?.sockets
    if (clients === undefined) {
        return []
    }

    return Object.keys(clients)
}

/**
 * Returns the players in the given room.
 */
const getPlayersInRoom = (roomName: string) => {
    var roomData = roomDataManager.getRoomData(roomName)
    return roomData.players
}

/**
 * Returns the spectators in the given room.
 */
const getSpectatorsInRoom = (roomName: string) => {
    var roomData = roomDataManager.getRoomData(roomName)
    return roomData.spectators
}

/**
 * Cleans up the given room.
 */
const cleanRoom = (roomName: string) => {
    let clientsInRoom = getPlayersInRoom(roomName)
    let roomIsEmpty = clientsInRoom.length <= 0

    if (roomIsEmpty) {
        let spectatorsInRoom = getSpectatorsInRoom(roomName)
        for (let spectator of spectatorsInRoom) {
            console.log(`Kicking spectator ${spectator} from room ${roomName}`)
            socketManager.sockets[spectator].emit("kick")
        }

        roomDataManager.clear(roomName)
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

/**
 * Sends the data for the given room to the clients.
 */
const sendRoomData = (roomName: string) => {
    let message = createRoomDataMessage(roomName)
    io.in(roomName).emit("roomData", message)
    io.emit("lobbyData", message)
}

io.on("connection", (socket: Socket) => {
    socket.on("joinServer", (playerName: string) => {
        socketManager.setPlayerName(socket.id, playerName)
        socketManager.setSocket(playerName, socket)
        console.log(`Player ${playerName} joined the server!`)

        socket.emit("joinServerReceived", roomDataManager.getAllRoomData())
    })

    socket.on("joinRoom", (req: RoomWith<string>) => {
        let roomName = req.roomName
        let playerName = req.data

        if (roomDataManager.roomExists(roomName)) {
            let roomData = roomDataManager.getRoomData(roomName)
            if (!roomData.gameData.isInProgress()) {
                socket.join(roomName)

                console.log(`Player ${playerName} joined room ${roomName}.`)

                // add the new player to the room
                roomDataManager.addPlayerToRoom(playerName, roomName)

                socket.emit("joinRoomReceived")

                // send room data to all clients
                sendRoomData(roomName)
            }
            else {
                console.warn(`Player ${playerName} could not join room ${roomName} because a game is in progress!`)
            }
        }
        else {
            console.warn(`Player ${playerName} could not join non-existent room ${roomName}!`)
        }
    })

    socket.on("allLobbyData", (playerName: string) => {
        console.log(`Player ${playerName} refreshed lobby data.`)

        socket.emit("allLobbyData", roomDataManager.getAllRoomData())
    })

    // TODO: allow players to join game as a spectator
    socket.on("spectateRoom", (req: RoomWith<string>) => {
        let roomName = req.roomName
        let playerName = req.data

        if (roomDataManager.roomExists(roomName)) {
            let roomData = roomDataManager.getRoomData(roomName)
            if (!roomData.gameData.isInProgress()) {
                socket.join(roomName)

                console.log(`Player ${playerName} joined room ${roomName} as a spectator.`)

                roomDataManager.addSpectatorToRoom(playerName, roomName)
                socket.emit("spectateRoomReceived")

                // send room data to all clients
                sendRoomData(roomName)
            }
            else {
                console.warn(`Player ${playerName} could not spectate room ${roomName} because a game is in progress!`)
            }
        }
        else {
            console.warn(`Player ${playerName} could not spectate non-existent room ${roomName}!`)
        }
    })

    socket.on("setRuleSet", (req: RoomWith<RuleSet>) => {
        let roomName = req.roomName
        let ruleSet = RuleSet.from(req.data)
        roomDataManager.setRuleSet(roomName, ruleSet)

        sendRoomData(roomName)
    })

    socket.on("startGame", (roomName: string) => {
        roomDataManager.startGame(roomName)

        io.in(roomName).emit("gameStarted", createRoomDataMessage(roomName))
        sendRoomData(roomName)
    })

    socket.on("addVoteForStartingPlayer", (req: RoomWith<[string, string]>) => {
        let roomName = req.roomName
        let playerName = req.data[0]
        let startingPlayerName = req.data[1]

        let voteResult = roomDataManager.addStartingPlayerVote(roomName, playerName, startingPlayerName)
        switch (voteResult) {
            case VoteResult.Success:
                console.log(`Player ${playerName} voted for ${startingPlayerName} to start game in room ${roomName}.`)
                break;

            case VoteResult.Denied:
                console.log(`Player ${playerName} was not allowed to vote for a starting player in room ${roomName}.`)
                break;

            case VoteResult.Closed:
                console.log(`Player ${playerName} could not cast their starting player vote in room ${roomName} because the vote is closed!`)
                break;

            case VoteResult.NonExistent:
                console.log(`Player ${playerName} could not cast their starting player vote in non-existent room ${roomName}!`)
                break;
        }

        let voteComplete = roomDataManager.isStartingPlayerVoteComplete(roomName)
        if (voteComplete) {
            let gameStartResult = roomDataManager.setStartingPlayer(roomName)
            switch (gameStartResult) {
                case GameStartResult.Success:
                    let startingPlayer = roomDataManager.getStartingPlayer(roomName)
                    console.log(`Player ${startingPlayer} has been voted to start the game in room ${roomName}.`)
                    break;

                case GameStartResult.NoStartingPlayer:
                    console.log(`Could not set starting player in room ${roomName} as no player has won the vote!`)
                    break;

                case GameStartResult.NonExistent:
                    console.log(`Could not set starting player in non-existent room ${roomName}!`)
                    break;
            }
        }

        sendRoomData(roomName)
    })

    socket.on("removeVoteForStartingPlayer", (req: RoomWith<string>) => {
        let roomName = req.roomName
        let playerName = req.data

        let voteResult = roomDataManager.removeStartingPlayerVote(roomName, playerName)
        switch (voteResult) {
            case VoteResult.Success:
                console.log(`Player ${playerName} removed their starting player vote in room ${roomName}.`)
                break;

            case VoteResult.Denied:
                console.log(`Player ${playerName} was not allowed to remove a vote for a starting player in room ${roomName}.`)
                break;

            case VoteResult.Closed:
                console.log(`Player ${playerName} could not remove their starting player vote in room ${roomName} because the vote is closed!`)
                break;

            case VoteResult.NonExistent:
                console.log(`Player ${playerName} could not cast their starting player vote in non-existent room ${roomName}!`)
                break;
        }

        sendRoomData(roomName)
    })

    socket.on("roomData", (message: Message<RoomData>) => {
        let gameData = GameData.from(message.content.gameData)
        roomDataManager.setGameData(roomName, gameData)

        sendRoomData(roomName)
    })

    socket.on("playCard", (message: Message<RoomData>) => {
        let gameData = GameData.from(message.content.gameData)
        roomDataManager.setGameData(roomName, gameData)
        roomDataManager.onPlayCard(roomName)

        sendRoomData(roomName)
    })

    socket.on("endTurn", (roomName: string) => {
        roomDataManager.onTurnEnd(roomName)

        sendRoomData(roomName)
    })

    socket.on("leaveRoom", (req: RoomWith<string>) => {
        let roomName = req.roomName
        let playerName = req.data

        roomDataManager.removeFromRoom(playerName, roomName)
        socket.leave(roomName)
        cleanRoom(roomName)

        console.log(`Player ${playerName} left room ${roomName}.`)

        sendRoomData(roomName)

        // TODO: when they leave a single player game in progress, a player's browser still
        // shows the game as in progress
    })

    socket.on("stopSpectating", (req: RoomWith<string>) => {
        let roomName = req.roomName
        let playerName = req.data

        roomDataManager.removeSpectatorFromRoom(playerName, roomName)
        socket.leave(roomName)
        cleanRoom(roomName)

        console.log(`Spectator ${playerName} left room ${roomName}.`)

        sendRoomData(roomName)
    })

    socket.on("disconnect", () => {
        let playerName = socketManager.getPlayerName(socket.id)
        if (playerName !== undefined) {
            let roomsEvicted = roomDataManager.removePlayer(playerName)
            for (let roomName of roomsEvicted) {
                cleanRoom(roomName)
                sendRoomData(roomName)
            }

            socketManager.removeSocket(playerName)
            socketManager.removePlayerName(socket.id)

            console.log(`Player ${playerName} left the server.`)
        }
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
