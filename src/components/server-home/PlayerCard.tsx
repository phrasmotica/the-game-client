import React from "react"

interface PlayerCardProps {
    /**
     * The player data.
     */
    playerData: string

    /**
     * The player's name.
     */
    playerName: string
}

export function PlayerCard(props: PlayerCardProps) {
    let className = "player-card"

    return (
        <div
            className={className}
            key={props.playerData}>
            <div className="grid-equal-rows text-center-right margin-right">
                <div className="grid">
                    <span className="truncate player-name">
                        {props.playerData}
                    </span>
                </div>
            </div>
        </div>
    )
}
