import React, { useState } from "react"

interface ServerBrowserProps {
    /**
     * Whether we are already connecting to the server.
     */
    alreadyConnecting: boolean

    /**
     * Joins the server with the given player name.
     */
    joinServer: (playerName: string) => void
}

/**
 * Renders the server browser.
 */
export const ServerBrowser = (props: ServerBrowserProps) => {
    const [playerName, setPlayerName] = useState("")

    let canJoinServer = playerName.length > 0 && !props.alreadyConnecting

    return (
        <div className="game-menu">
            <div className="flex-center margin-bottom">
                Welcome!
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
                    disabled={!canJoinServer}
                    onClick={() => props.joinServer(playerName)}>
                    Join Server
                </button>
            </div>
        </div>
    )
}
