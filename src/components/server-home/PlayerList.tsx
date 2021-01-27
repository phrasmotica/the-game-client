import React, { useCallback, useEffect, useState } from "react"
import { FaRedo } from "react-icons/fa"

import { PlayerData } from "game-server-lib"

import { PlayerCard } from "./PlayerCard"

interface PlayerListProps {
    /**
     * The socket for server communication.
     */
    socket: SocketIOClient.Socket

    /**
     * The player's name.
     */
    playerName: string
}

export function PlayerList(props: PlayerListProps) {
    const [allPlayerData, setAllPlayerData] = useState<PlayerData[]>([])

    props.socket.on("allPlayersData", (newAllPlayerData: PlayerData[]) => {
        setAllPlayerData(newAllPlayerData)
    })

    /**
     * Refreshes the player list.
     */
    const refreshPlayerList = useCallback(() => {
        props.socket.emit("allPlayersData", props.playerName)
    }, [props.playerName, props.socket])

    // effect for refreshing the room list after first render
    useEffect(() => {
        refreshPlayerList()
        return () => setAllPlayerData([])
    }, [refreshPlayerList])

    return (
        <div>
            <div className="grid-equal-columns margin-bottom">
                <div className="grid margin-right-small">
                    <span className="text-align-left">
                        Players ({allPlayerData.length})
                    </span>
                </div>

                <div className="grid">
                    <div className="flex-end">
                        <div>
                            <button
                                onClick={refreshPlayerList}>
                                <FaRedo />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="player-list scroll-vert">
                <div>
                    {allPlayerData.map((playerData, index) => {
                        let className = ""
                        if (index < allPlayerData.length - 1) {
                            className += "margin-bottom-small"
                        }

                        return (
                            <div
                                key={playerData.name}
                                className={className}>
                                <PlayerCard playerData={playerData} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
