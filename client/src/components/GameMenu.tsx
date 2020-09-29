import React, { useState } from "react"

interface GameMenuProps {
    /**
     * Joins the game with the given name.
     */
    joinGame: (playerName: string) => void
}

/**
 * Renders the game menu.
 */
export function GameMenu(props: GameMenuProps) {
    const [playerName, setPlayerName] = useState("")

    return (
        <div className="game-menu">
            <div className="flex-center margin-bottom">
                Welcome to The Game!
            </div>

            <div className="flex-center margin-bottom">
                <input
                    type="text"
                    className="name-field"
                    placeholder="enter your name"
                    onChange={e => setPlayerName(e.target.value)} />
            </div>

            <div className="flex-center margin-bottom">
                <button
                    disabled={playerName.length <= 0}
                    onClick={() => props.joinGame(playerName)}>
                    Join Game
                </button>
            </div>
        </div>
    )
}
