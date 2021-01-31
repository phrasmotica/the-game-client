import React from "react"

import { PlayerData } from "game-server-lib"

import { PlayerCard } from "./PlayerCard"

interface PlayerListProps {
    /**
     * The players data.
     */
    playersData: PlayerData[]

    /**
     * The name of the current player.
     */
    playerName: string

    /**
     * Whether to only display the players' names.
     */
    namesOnly: boolean

    /**
     * The number of placeholder slots to display if no player data is present.
     */
    placeholderCount?: number
}

/**
 * Renders the given players.
 */
export const PlayerList = (props: PlayerListProps) => {
    let playersData = props.playersData
    let numberOfPlayers = playersData.length

    // pad out list of players with placeholders
    for (let i = numberOfPlayers; i < (props.placeholderCount ?? 1); i++) {
        playersData.push({ name: "?" } as PlayerData)
    }

    return (
        <div className="player-list scroll-vert">
            <div>
                {playersData.map((playerData, index) => {
                    let className = ""
                    if (index < playersData.length - 1) {
                        className += "margin-bottom-small"
                    }

                    return (
                        <div
                            key={index}
                            className={className}>
                            <PlayerCard
                                playerData={playerData}
                                playerName={props.playerName}
                                nameOnly={props.namesOnly}
                                isPlaceholder={index >= numberOfPlayers} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
