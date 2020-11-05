import React, { useState, useRef } from "react"
import socketIOClient, { Socket } from "socket.io-client"

import { GameBoard } from "./components/GameBoard"
import { GameBrowser } from "./components/GameBrowser"
import { GameLobby } from "./components/GameLobby"
import { GameMenu } from "./components/GameMenu"

import { ClientMode } from "./models/ClientMode"
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
    const [roomData, setRoomData] = useState(RoomData.empty())
    const [playerName, setPlayerName] = useState("")
    const [clientMode, setClientMode] = useState(ClientMode.Player)

    const socket = useRef(Socket)

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

        socket.current.on("joinServerResult", (success: boolean) => {
            if (success) {
                setState(AppState.Browse)
            }
        })

        socket.current.on("joinRoomResult", (success: boolean) => {
            if (success) {
                setClientMode(ClientMode.Player)
                setState(AppState.Lobby)
            }
        })

        socket.current.on("spectateRoomResult", (success: boolean) => {
            if (success) {
                setClientMode(ClientMode.Spectator)
                setState(AppState.Lobby)
            }
        })

        socket.current.on("gameStarted", (message: Message<RoomData>) => {
            setState(AppState.Game)
            setRoomData(RoomData.from(message.content))
        })

        socket.current.on("roomData", (message: Message<RoomData>) => {
            let roomData = RoomData.from(message.content)
            setRoomData(roomData)
        })

        socket.current.on("kick", () => {
            let roomData = RoomData.empty()
            setRoomData(roomData)
            setState(AppState.Browse)
        })
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
     * Plays a card and sends the new game data to the server.
     */
    const playCard = (gameData: GameData) => {
        let newRoomData = RoomData.from(roomData)
        newRoomData.gameData = gameData
        setRoomData(newRoomData)

        let message = Message.info(newRoomData)
        socket.current.emit("playCard", message)
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
        socket.current.emit("endTurn", roomData.name)
    }

    /**
     * Leaves the room.
     */
    const leaveRoom = () => {
        let event = ""
        switch (clientMode) {
            case ClientMode.Player:
                event = "leaveRoom"
                break;

            case ClientMode.Spectator:
                event = "stopSpectating"
                break;

            default:
                throw new Error(`Unrecognised client mode '${clientMode}'!`)
        }

        socket.current.emit(event, new RoomWith(roomData.name, playerName))
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
                    socket={socket.current}
                    playerName={playerName}
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
                    clientMode={clientMode}
                    addStartVote={addVoteForStartingPlayer}
                    removeStartVote={removeVoteForStartingPlayer}
                    newGame={newGame}
                    setGameData={setGameData}
                    playCard={playCard}
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
