import React, { useState } from "react"

export interface StartingPlayerSelectorProps {
    /**
     * The players to select from.
     */
    players: string[]

    /**
     * Whether the player has voted for a starting player.
     */
    hasVoted: boolean

    /**
     * Confirms a vote for the selected player.
     */
    confirm: (startingPlayer: string) => void

    /**
     * Cancels a vote for the selected player.
     */
    cancel: () => void
}

/**
 * Renders a list of players, one of whom can be selected as the starting player.
 */
export function StartingPlayerSelector(props: StartingPlayerSelectorProps) {
    const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0)

    /**
     * Confirms a vote for the selected player.
     */
    const confirmVote = () => {
        let player = props.players[selectedPlayerIndex]
        props.confirm(player)
    }

    return (
        <div>
            <div className="flex-center margin-bottom">
                <div className="starting-player-selector-text margin-right">
                    <span>
                        Select which player will start:
                    </span>
                </div>

                <div>
                    <select onChange={e => setSelectedPlayerIndex(e.target.selectedIndex)}>
                        {props.players.map(p => (<option>{p}</option>))}
                    </select>
                </div>
            </div>

            <div className="flex-center margin-bottom">
                <div className="margin-right">
                    <button
                        disabled={props.hasVoted}
                        onClick={confirmVote}>
                        Confirm
                    </button>
                </div>

                <div>
                    <button
                        disabled={!props.hasVoted}
                        onClick={props.cancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
