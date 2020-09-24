import React, { useState, useEffect} from "react"
import socketIOClient from "socket.io-client"

import { GameBoard } from "./components/GameBoard"

import { RuleSet } from "./gameData/RuleSet"

import { Message } from "./models/Message"
import { RoomData } from "./models/RoomData"

import "./App.css"

/**
 * The socket.io endpoint.
 */
const ENDPOINT = "http://127.0.0.1:4001"

function App() {
    const [roomData, setRoomData] = useState<RoomData>()
    const [ruleSet, setRuleSet] = useState(RuleSet.default())

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT)

        socket.on("roomData", (message: Message<RoomData>) => {
            setRoomData(message.content)
        })

        // TODO: make it so that when one client starts a new game with a given rule set, that propagates to the other clients
        // socket.on("ruleSet", (ruleSet: RuleSet) => {
        //     setRuleSet(ruleSet)
        // })
    }, [])

    let gameLink = "https://boardgamegeek.com/boardgame/173090/game"

    return (
        <div className="App">
            <header className="App-header">
                <div className="elements">
                    <GameBoard ruleSet={ruleSet} setRuleSet={setRuleSet} />

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
