import React from "react"

import { RoomList } from "./RoomList"

interface GameBrowserProps {
    /**
     * The socket for server communication.
     */
    socket: SocketIOClient.Socket

    /**
     * The player name.
     */
    playerName: string

    /**
     * Leaves the server.
     */
    leaveServer: () => void
}

/**
 * Renders the game browser.
 */
export function GameBrowser(props: GameBrowserProps) {
    return (
        <div className="game-menu">
            <div className="flex-center margin-bottom">
                Welcome to the server!
            </div>

            <div className="flex-center margin-bottom">
                <button
                    onClick={props.leaveServer}>
                    Leave Server
                </button>
            </div>

            <div className="flex-center">
                <RoomList
                    socket={props.socket}
                    playerName={props.playerName} />
            </div>
        </div>
    )
}
