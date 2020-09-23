import React, { useState, useEffect} from "react"
import socketIOClient from "socket.io-client"

import { GameBoard } from "./components/GameBoard"

import { RoomData } from "./models/RoomData"

import "./App.css"

/**
 * The socket.io endpoint.
 */
const ENDPOINT = "http://127.0.0.1:4001"

function App() {
    const [roomData, setRoomData] = useState<RoomData>()

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT)

        socket.on("roomData", (roomData: RoomData) => {
            setRoomData(roomData)
        })
    }, [])

    let gameLink = "https://boardgamegeek.com/boardgame/173090/game"

    return (
        <div className="App">
            <header className="App-header">
                <div className="elements">
                    <GameBoard />

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
                                    Players: {roomData?.numberOfPlayers ?? "-"}
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
