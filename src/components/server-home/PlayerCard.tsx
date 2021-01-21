import React from "react"

import { PlayerData } from "game-server-lib"
import moment, { duration } from "moment"

interface PlayerCardProps {
    /**
     * The player data.
     */
    playerData: PlayerData

    /**
     * The player's name.
     */
    playerName: string
}

export function PlayerCard(props: PlayerCardProps) {
    let className = "player-card"

    let lastLoginTime = props.playerData.lastLoginTime
    let loginDuration = duration(moment().diff(lastLoginTime))
    let loginDurationStr = loginDuration.humanize()

    return (
        <div
            className={className}
            key={props.playerData.name}>
            <div className="grid-equal-rows text-center-right">
                <div className="grid">
                    <span className="truncate player-name">
                        {props.playerData.name} - online for {loginDurationStr}
                    </span>
                </div>
            </div>
        </div>
    )
}
