import React, { useState, useRef } from "react"
import socketIOClient, { Socket } from "socket.io-client"

import { GameBoard } from "./components/GameBoard"
import { GameLobby } from "./components/GameLobby"
import { GameMenu } from "./components/GameMenu"

import { ServerHome } from "./components/server-home/ServerHome"

import { ClientMode } from "./models/ClientMode"

import { Message } from "the-game-lib/dist/models/Message"
import { RoomData } from "the-game-lib/dist/models/RoomData"

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
                setState(AppState.ServerHome)
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
             // can we alleviate the need for all these static .from() functions?
            let roomData = RoomData.from(message.content)
            setRoomData(roomData)
        })

        socket.current.on("kick", () => {
            let roomData = RoomData.empty()
            setRoomData(roomData)
            setState(AppState.ServerHome)
        })

        socket.current.on("leaveGameResult", (success: boolean) => {
            if (success) {
                setRoomData(RoomData.empty())
                setState(AppState.ServerHome)
            }
        })

        socket.current.on("leaveRoomResult", (success: boolean) => {
            if (success) {
                setRoomData(RoomData.empty())
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
