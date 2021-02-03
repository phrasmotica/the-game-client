import React from "react"

import { PlayerData } from "game-server-lib"
import { Hand, RuleSet } from "the-game-lib"
import { CardView } from "../game-screen/CardView"

import "./PlayerHandView.css"

interface PlayerHandViewProps {
    /**
     * The player data.
     */
    playerData: PlayerData

    /**
     * The name of the current player.
     */
    playerName: string

    /**
     * Whether this represents the current player.
     */
    isCurrent: boolean

    /**
     * The player's hand.
     */
    hand: Hand

    /**
     * The rule set.
     */
    ruleSet: RuleSet

    /**
     * Whether to show the cards' values.
     */
    showCardValues?: boolean
}

export const PlayerHandView = (props: PlayerHandViewProps) => {
    let className = "player-hand-view"
    if (props.playerName === props.playerData.name) {
        className += " you"
    }

    if (props.isCurrent) {
        className += " current"
    }

    let text = props.playerData.name

    return (
        <div
            className={className}
            key={props.playerData.name}>
            <div className="player-name">
                <span>
                    {text}
                </span>
            </div>

            <div className="player-hand-cards">
                {props.hand.cards.map(c => (
                    <CardView
                        ruleSet={props.ruleSet}
                        card={c}
                        showCardValue={props.showCardValues} />
                ))}
            </div>
        </div>
    )
}
