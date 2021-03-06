import React from "react"

import { PlayerList } from "./PlayerList"
import { RoomList } from "./RoomList"

interface ServerHomeProps {
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
 * Renders the server home page.
 */
export function ServerHome(props: ServerHomeProps) {
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

            <div className="flex-top">
                <div className="margin-right-large">
                    <PlayerList
                        socket={props.socket}
                        playerName={props.playerName} />
                </div>

                <div>
                    <RoomList
                        socket={props.socket}
                        playerName={props.playerName} />
                </div>
            </div>
        </div>
    )
}
