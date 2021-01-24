import React, { useState, useRef } from "react"
import socketIOClient, { Socket } from "socket.io-client"

import { Message, RoomData } from "game-server-lib"
import { GameData } from "the-game-lib"

import { GameBoard } from "./components/GameBoard"
import { GameLobby } from "./components/GameLobby"
import { GameMenu } from "./components/GameMenu"

import { ServerHome } from "./components/server-home/ServerHome"

import { ClientMode } from "./models/ClientMode"

import { createRoomData } from "./util/Convert"

import "./App.css"

/**
 * The states the app can adopt.
 */
enum AppState {
    Menu,
    ServerHome,
    Lobby,
    Game
}

const defaultRoomData = () => new RoomData("", [], [], GameData.default())

function App() {
    const [state, setState] = useState(AppState.Menu)
    const [isConnecting, setIsConnecting] = useState(false)
    const [roomData, setRoomData] = useState(defaultRoomData())
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
        setIsConnecting(true)

        socket.current.on("joinServerResult", (success: boolean) => {
            if (success) {
                setState(AppState.ServerHome)
            }

            setIsConnecting(false)
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

        socket.current.on("gameStarted", (message: Message<RoomData<GameData>>) => {
            setState(AppState.Game)
            setRoomData(createRoomData(message.content))
        })

        socket.current.on("roomData", (message: Message<RoomData<GameData>>) => {
            // can we alleviate the need for all these static .from() functions?
            let roomData = createRoomData(message.content)
            setRoomData(roomData)
        })

        socket.current.on("kick", () => {
            setRoomData(defaultRoomData())
            setState(AppState.ServerHome)
        })

        socket.current.on("leaveGameResult", (success: boolean) => {
            if (success) {
                setRoomData(defaultRoomData())
                setState(AppState.ServerHome)
            }
        })

        socket.current.on("leaveRoomResult", (success: boolean) => {
            if (success) {
                setRoomData(defaultRoomData())
                setState(AppState.ServerHome)
            }
        })
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
                    alreadyConnecting={isConnecting}
                    joinServer={joinServer} />
            )
            break
        case AppState.ServerHome:
            contents = (
                <ServerHome
                    socket={socket.current}
                    playerName={playerName}
                    leaveServer={leaveServer} />
            )
            break
        case AppState.Lobby:
            contents = (
                <GameLobby
                    socket={socket.current}
                    playerName={playerName}
                    clientMode={clientMode}
                    roomData={roomData} />
            )
            break
        case AppState.Game:
            contents = (
                <GameBoard
                    socket={socket.current}
                    playerName={playerName}
                    roomData={roomData}
                    clientMode={clientMode} />
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
