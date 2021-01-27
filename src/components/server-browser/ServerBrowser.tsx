import React, { useState } from "react"
import { Input } from "semantic-ui-react"

import { ServerInfo } from "../../App"
import { ServerList } from "./ServerList"

interface ServerBrowserProps {
    /**
     * The list of servers.
     */
    servers: ServerInfo[]

    /**
     * Whether we are already connecting to a server.
     */
    alreadyConnecting: boolean

    /**
     * Joins the given server with the given player name.
     */
    joinServer: (serverUrl: string, playerName: string) => void
}

/**
 * Renders the server browser.
 */
export const ServerBrowser = (props: ServerBrowserProps) => {
    const [playerName, setPlayerName] = useState("")

    return (
        <div className="game-menu">
            <div className="flex-center margin-bottom">
                Welcome!
            </div>

            <div className="flex-center margin-bottom">
                <Input
                    className="name-field"
                    placeholder="enter your name"
                    onChange={e => setPlayerName(e.target.value)} />
            </div>

            <ServerList
                servers={props.servers}
                playerName={playerName}
                alreadyConnecting={props.alreadyConnecting}
                joinServer={url => props.joinServer(url, playerName)} />
        </div>
    )
}
