import React, { useState, useRef } from "react"
import socketIOClient, { Socket } from "socket.io-client"

import { GameBoard } from "./components/GameBoard"
import { GameBrowser } from "./components/GameBrowser"
import { GameLobby } from "./components/GameLobby"
import { GameMenu } from "./components/GameMenu"

import { GameData } from "./models/GameData"
import { Message } from "./models/Message"
import { RoomData } from "./models/RoomData"
import { RoomWith } from "./models/RoomWith"
import { RuleSet } from "./models/RuleSet"

import "./App.css"

/**
 * The states the app can adopt.
 */
enum AppState {
    Menu,
    Browse,
    Lobby,
    Game
}

function App() {
    const [state, setState] = useState(AppState.Menu)
    const [allRoomData, setAllRoomData] = useState<RoomData[]>([])
    const [roomData, setRoomData] = useState<RoomData>(RoomData.empty())
    const [playerName, setPlayerName] = useState("")

    // Socket here is a property of socketIOClient. So we need typeof
    const socket = useRef<typeof Socket>(Socket)

    /**
     * Connects to the server and sets up event listeners for the socket.
     */
    const joinServer = (playerName: string) => {
        let endpoint = process.env.REACT_APP_SERVER_ENDPOINT
        if (endpoint === undefined) {
            throw new Error("No server endpoint found!")
        }

        socket.current = socketIOClient(endpoint)
        setPlayerName(playerName)

        socket.current.emit("joinServer", playerName)

        socket.current.on("joinServerReceived", (allRoomData: RoomData[]) => {
            setAllRoomData(allRoomData.map(RoomData.from))
            setState(AppState.Browse)
        })

        socket.current.on("lobbyData", (message: Message<RoomData>) => {
            let roomData = RoomData.from(message.content)

            let newAllRoomData = allRoomData

            let index = allRoomData.findIndex(r => r.name === roomData.name)
            if (index >= 0) {
                newAllRoomData[index] = roomData
            }
            else {
                // TODO: this is a workaround for allRoomData sometimes being an empty list,
                // even though it should never be once the player has joined the server
                newAllRoomData.push(roomData)
            }

            setAllRoomData(newAllRoomData)
        })

        socket.current.on("joinRoomReceived", () => {
            setState(AppState.Lobby)
        })

        socket.current.on("gameStarted", (message: Message<RoomData>) => {
            setState(AppState.Game)
            setRoomData(RoomData.from(message.content))
        })

        socket.current.on("roomData", (message: Message<RoomData>) => {
            setRoomData(RoomData.from(message.content))
        })
    }

    /**
     * Creates a room with the given name.
     */
    const createRoom = (roomName: string) => {
        socket.current.emit("createRoom", roomName)
    }

    /**
     * Joins the given room with the given player name.
     */
    const joinRoom = (roomName: string, playerName: string) => {
        socket.current.emit("joinRoom", new RoomWith(roomName, playerName))
    }

    /**
     * Joins the given room with the given player name as a spectator.
     */
    const spectateGame = (roomName: string, playerName: string) => {
        socket.current.emit("spectateRoom", new RoomWith(roomName, playerName))
    }

    /**
     * Starts a game with the given rule set.
     */
    const startGame = (roomName: string) => {
        socket.current.emit("startGame", roomName)
    }

    /**
     * Adds the given player's starting player vote in the given room.
     */
    const addVoteForStartingPlayer = (startingPlayer: string) => {
        let data: [string, string] = [playerName, startingPlayer]
        let req = new RoomWith(roomData.name, data)
        socket.current.emit("addVoteForStartingPlayer", req)
    }

    /**
     * Removes the given player's starting player vote in the given room.
     */
    const removeVoteForStartingPlayer = () => {
        let req = new RoomWith(roomData.name, playerName)
        socket.current.emit("removeVoteForStartingPlayer", req)
    }

    /**
     * Starts a new game.
     */
    const newGame = (ruleSet: RuleSet) => {
        let message = Message.info(ruleSet)
        socket.current.emit("newGame", message)
    }

    /**
     * Sets the game data and sends the new data to the server.
     */
    const setGameData = (gameData: GameData) => {
        let newRoomData = RoomData.from(roomData)
        newRoomData.gameData = gameData
        setRoomData(newRoomData)

        let message = Message.info(newRoomData)
        socket.current.emit("roomData", message)
    }

    /**
     * Sets the given rule set for the game.
     */
    const setRuleSet = (ruleSet: RuleSet) => {
        let body = new RoomWith(roomData.name, ruleSet)
        socket.current.emit("setRuleSet", body)
    }

    /**
     * Ends the turn.
     */
    const endTurn = () => {
        socket.current.emit("endTurn")
    }

    /**
     * Leaves the room.
     */
    const leaveRoom = () => {
        socket.current.emit("leaveRoom", new RoomWith(roomData.name, playerName))
        setRoomData(RoomData.empty())
        setState(AppState.Browse)
    }

    /**
     * Leaves the server.
     */
    const leaveServer = () => {
        socket.current.disconnect()
        setPlayerName("")
        setState(AppState.Menu)
    }

    let contents = null
    switch (state) {
        case AppState.Menu:
            contents = (
                <GameMenu
                    joinServer={joinServer} />
            )
            break
        case AppState.Browse:
            contents = (
                <GameBrowser
                    playerName={playerName}
                    games={allRoomData}
                    createGame={createRoom}
                    joinGame={joinRoom}
                    spectateGame={spectateGame}
                    leaveServer={leaveServer} />
            )
            break
        case AppState.Lobby:
            contents = (
                <GameLobby
                    playerName={playerName}
                    roomData={roomData}
                    startGame={startGame}
                    setRuleSet={setRuleSet}
                    leaveRoom={leaveRoom} />
            )
            break
        case AppState.Game:
            contents = (
                <GameBoard
                    playerName={playerName}
                    gameData={roomData.gameData}
                    addStartVote={addVoteForStartingPlayer}
                    removeStartVote={removeVoteForStartingPlayer}
                    newGame={newGame}
                    setGameData={setGameData}
                    endTurn={endTurn}
                    leaveGame={leaveRoom} />
            )
            break
        default:
            break
    }

    let gameLink = "https://boardgamegeek.com/boardgame/173090/game"

    return (
        <div className="App">
            <header className="App-header">
                <div className="elements">
                    {contents}

                    <div id="footer" className="flex-center space-around">
                        <div>
                            <span>
                                Version 1.0
                            </span>
                        </div>

                        <div>
                            <span>
                                Adapted from <a className="App-link" href={gameLink} target="_blank" rel="noopener noreferrer">The Game</a> by Steffen Benndorf
                            </span>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default App
