import React from "react"

import { ServerInfo } from "../../App"
import { ServerCard } from "./ServerCard"

interface ServerListProps {
    /**
     * The list of servers.
     */
    servers: ServerInfo[]

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

export const ServerList = (props: ServerListProps) => {
    return (
        <div>
            <div className="grid-equal-columns margin-bottom">
                <div className="grid margin-right-small">
                    <span className="servers-header">
                        Servers ({props.servers.length})
                    </span>
                </div>
            </div>

            <div className="server-list scroll-vert">
                <div>
                    {props.servers.map((serverInfo, index) => {
                        let className = ""
                        if (index < props.servers.length - 1) {
                            className += "margin-bottom-small"
                        }

                        return (
                            <div
                                key={serverInfo.url}
                                className={className}>
                                <ServerCard
                                    serverInfo={serverInfo}
                                    playerName={props.playerName}
                                    alreadyConnecting={props.alreadyConnecting}
                                    joinServer={props.joinServer} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
