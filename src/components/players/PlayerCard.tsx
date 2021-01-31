import React from "react"

import { PlayerData } from "game-server-lib"
import moment, { duration } from "moment"

interface PlayerCardProps {
    /**
     * The player data.
     */
    playerData: PlayerData

    /**
     * The name of the current player.
     */
    playerName: string

    /**
     * Whether to only display the player's name.
     */
    nameOnly: boolean

    /**
     * Whether to display the player as a placeholder.
     */
    isPlaceholder: boolean
}

export function PlayerCard(props: PlayerCardProps) {
    let className = "player-card"
    if (props.isPlaceholder) {
        className += " placeholder"
    }
    else if (props.playerName === props.playerData.name) {
        className += " you"
    }

    let text = props.playerData.name

    if (!props.nameOnly) {
        let lastLoginTime = props.playerData.lastLoginTime
        let loginDuration = duration(moment().diff(lastLoginTime))
        let loginDurationStr = loginDuration.humanize()

        text += ` - online for ${loginDurationStr}`
    }

    return (
        <div
            className={className}
            key={props.playerData.name}>
            <div className="grid-equal-rows text-center-right">
                <div className="grid">
                    <span className="truncate player-name">
                        {text}
                    </span>
                </div>
            </div>
        </div>
    )
}
