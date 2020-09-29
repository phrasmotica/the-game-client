import React, { useState, useRef } from "react"
import socketIOClient, { Socket } from "socket.io-client"

import { GameBoard } from "./components/GameBoard"
import { GameBrowser } from "./components/GameBrowser"
import { GameMenu } from "./components/GameMenu"

import { GameData } from "./models/GameData"
import { Message } from "./models/Message"
import { RoomData } from "./models/RoomData"
import { RuleSet } from "./models/RuleSet"

import "./App.css"
import { JoinGameRequest } from "./models/JoinGameRequest"

/**
 * The states the app can adopt.
 */
enum AppState {
    Menu,
    Browse,
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

        socket.current.emit("playerJoined", playerName)

        socket.current.on("playerReceived", (allRoomData: RoomData[]) => {
            setAllRoomData(allRoomData)
            setState(AppState.Browse)
        })

        socket.current.on("joinGameReceived", (message: Message<RoomData>) => {
            setState(AppState.Game)
            setRoomData(RoomData.from(message.content))
        })

        socket.current.on("roomData", (message: Message<RoomData>) => {
            setRoomData(RoomData.from(message.content))
        })
    }

    /**
     * Creates a game with the given name.
     */
    const createGame = (gameName: string) => {

    }

    /**
     * Joins the given game with the given player name.
     */
    const joinGame = (roomName: string, playerName: string) => {
        socket.current.emit("joinGame", new JoinGameRequest(roomName, playerName))
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
     * Ends the turn.
     */
    const endTurn = () => {
        socket.current.emit("endTurn")
    }

    /**
     * Leaves the game.
     */
    const leaveGame = () => {
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

    console.log(roomData.gameData.hands)

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
                    createGame={createGame}
                    joinGame={joinGame}
                    leaveServer={leaveServer} />
            )
            break
        case AppState.Game:
            contents = (
                <GameBoard
                    playerName={playerName}
                    gameData={roomData.gameData}
                    newGame={newGame}
                    setGameData={setGameData}
                    endTurn={endTurn}
                    leaveGame={leaveGame} />
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
                            <div>
                                <span>
                                    Room ID: {roomData?.name ?? "-"}
                                </span>
                            </div>

                            <div>
                                <span>
                                    Players: {roomData?.gameData.players.join(", ")}
                                </span>
                            </div>
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
