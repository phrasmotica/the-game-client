import React, { useCallback, useEffect, useState } from "react"
import { FaRedo } from "react-icons/fa"

import { PlayerData } from "game-server-lib"
import { Button } from "semantic-ui-react"

import { PlayerList } from "../players/PlayerList"

interface ServerPlayerListProps {
    /**
     * The socket for server communication.
     */
    socket: SocketIOClient.Socket

    /**
     * The player's name.
     */
    playerName: string
}

/**
 * Renders the players on the server.
 */
export const ServerPlayerList = (props: ServerPlayerListProps) => {
    const [allPlayerData, setAllPlayerData] = useState<PlayerData[]>([])

    props.socket.on("allPlayersData", (newAllPlayerData: PlayerData[]) => {
        setAllPlayerData(newAllPlayerData)
    })

    /**
     * Refreshes the players.
     */
    const refreshPlayers = useCallback(() => {
        props.socket.emit("allPlayersData", props.playerName)
    }, [props.playerName, props.socket])

    // effect for refreshing after first render
    useEffect(() => {
        refreshPlayers()
        return () => setAllPlayerData([])
    }, [refreshPlayers])

    return (
        <div>
            <div className="grid-equal-columns margin-bottom">
                <div className="grid margin-right-small">
                    <span className="players-header">
                        Players ({allPlayerData.length})
                    </span>
                </div>

                <div className="grid">
                    <div className="flex-end">
                        <div>
                            <Button
                                className="no-margin"
                                onClick={refreshPlayers}>
                                <FaRedo />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <PlayerList
                playersData={allPlayerData}
                playerName={props.playerName}
                namesOnly={false} />
        </div>
    )
}
