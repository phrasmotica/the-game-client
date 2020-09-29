import React from "react"

import { CardView } from "./CardView"

import { Hand } from "../models/Hand"
import { RuleSet } from "../models/RuleSet"

interface HandProps {
    /**
     * The rule set.
     */
    ruleSet: RuleSet

    /**
     * The hand.
     */
    hand: Hand | undefined

    /**
     * The card to play.
     */
    cardToPlay: number | undefined

    /**
     * Whether it is the player's turn.
     */
    isMyTurn: boolean

    /**
     * Whether the game is lost.
     */
    isLost: boolean

    /**
     * Sets the card to be played.
     */
    setCardToPlay: (card: number | undefined) => void
}

/**
 * Renders a hand.
 */
export function HandView(props: HandProps) {
    if (props.hand === undefined) {
        return null
    }

    if (props.hand.isEmpty()) {
        return (
            <div className="hand">
                <div className="flex-center">
                    Your hand is empty!
                </div>
            </div>
        )
    }

    let buttonIsDisabled = props.isLost || !props.isMyTurn || props.cardToPlay !== undefined

    return (
        <div className="hand">
            <div className="flex-center">
                {props.hand.cards.map((c, i) => {
                    let isSelected = props.cardToPlay === c

                    return (
                        <div key={i} className="card-set">
                            <CardView ruleSet={props.ruleSet} card={c} isSelected={isSelected} />

                            <div>
                                <button
                                    className="card-button"
                                    disabled={buttonIsDisabled}
                                    onClick={() => props.setCardToPlay(c)}>
                                    Select
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}