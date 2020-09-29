import React, { useState } from "react"
import { RoomData } from "../models/RoomData"

interface GameBrowserProps {
    /**
     * The player name.
     */
    playerName: string

    /**
     * The available games.
     */
    games: RoomData[]

    /**
     * Creates a game with the given name.
     */
    createGame: (roomName: string) => void

    /**
     * Joins the given game with the given player name.
     */
    joinGame: (roomName: string, playerName: string) => void

    /**
     * Leaves the server.
     */
    leaveServer: () => void
}

/**
 * Renders the game browser.
 */
export function GameBrowser(props: GameBrowserProps) {
    const [createGameName, setCreateGameName] = useState("")

    return (
        <div className="game-menu">
            <div className="flex-center margin-bottom">
                Welcome to the server!
            </div>

            <div className="flex-center margin-bottom">
                <div className="margin-right">
                    <button
                        disabled={true}
                        onClick={() => props.createGame(createGameName)}>
                        Create Game
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => props.leaveServer()}>
                        Leave Server
                    </button>
                </div>
            </div>

            <div className="flex-center margin-bottom">
                Games List
            </div>

            <div>
                {props.games.map(g => {
                    return (
                        <div className="flex-center margin-bottom">
                            <div className="margin-right">
                                <span>{g.name}</span>
                            </div>

                            <div>
                                <button
                                    onClick={() => props.joinGame(g.name, props.playerName)}>
                                    Join
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
