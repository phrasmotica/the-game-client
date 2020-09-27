import React, { useState, useEffect, useRef } from "react"
import socketIOClient, { Socket } from "socket.io-client"

import { GameBoard } from "./components/GameBoard"

import { GameData } from "./models/GameData"
import { Message } from "./models/Message"
import { RoomData } from "./models/RoomData"

import "./App.css"

/**
 * The socket.io endpoint.
 */
const ENDPOINT = "http://127.0.0.1:4001"

function App() {
    const [roomData, setRoomData] = useState<RoomData>(RoomData.default())

    // Socket here is a property of socketIOClient. So we need typeof
    const socket = useRef<typeof Socket>(Socket)

    useEffect(() => {
        socket.current = socketIOClient(ENDPOINT)

        socket.current.on("roomData", (message: Message<RoomData>) => {
            console.log(message)
            setRoomData(RoomData.from(message.content))
        })
    }, [])

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

    let gameLink = "https://boardgamegeek.com/boardgame/173090/game"

    return (
        <div className="App">
            <header className="App-header">
                <div className="elements">
                    <GameBoard gameData={roomData.gameData} setGameData={setGameData} />

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
