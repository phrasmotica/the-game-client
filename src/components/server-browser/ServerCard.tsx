import React from "react"
import { Button } from "semantic-ui-react"

import { ServerInfo } from "../../App"

interface ServerCardProps {
    /**
     * The server info.
     */
    serverInfo: ServerInfo

    /**
     * The current player's name.
     */
    playerName: string

    /**
     * Whether we are already connecting to a server.
     */
    alreadyConnecting: boolean

    /**
     * Joins the given server with the given player name.
     */
    joinServer: (serverUrl: string) => void
}

export const ServerCard = (props: ServerCardProps) => {
    let canJoinServer = props.playerName.length > 0 && !props.alreadyConnecting

    return (
        <div className="server-card">
            <div className="flex-middle margin-right">
                <span className="server-name">
                    {props.serverInfo.name}
                </span>
            </div>

            <Button
                positive
                loading={props.alreadyConnecting}
                disabled={!canJoinServer}
                onClick={() => props.joinServer(props.serverInfo.url)}>
                Join
            </Button>
        </div>
    )
}
