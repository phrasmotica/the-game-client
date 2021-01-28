import React from "react"

import { PlayerData } from "game-server-lib"
import { PlayerCard } from "./PlayerCard"

interface PlayerListProps {
    /**
     * The players data.
     */
    playersData: PlayerData[]

    /**
     * Whether to only display the players' names.
     */
    namesOnly: boolean
}

/**
 * Renders the given players.
 */
export const PlayerList = (props: PlayerListProps) => {
    return (
        <div className="player-list scroll-vert">
            <div>
                {props.playersData.map((playerData, index) => {
                    let className = ""
                    if (index < props.playersData.length - 1) {
                        className += "margin-bottom-small"
                    }

                    return (
                        <div
                            key={playerData.name}
                            className={className}>
                            <PlayerCard
                                playerData={playerData}
                                nameOnly={props.namesOnly} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
