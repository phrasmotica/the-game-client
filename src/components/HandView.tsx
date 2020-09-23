import React from "react"

import { CardView } from "./CardView"

import { Hand } from "../gameData/Hand"
import { RuleSet } from "../gameData/RuleSet"

interface HandProps {
    /**
     * The rule set.
     */
    ruleSet: RuleSet

    /**
     * The hand.
     */
    hand: Hand

    /**
     * The card to play.
     */
    cardToPlay: number | undefined

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
    if (props.hand.isEmpty()) {
        return (
            <div className="hand">
                <div className="flex-center">
                    Your hand is empty!
                </div>
            </div>
        )
    }

    return (
        <div className="hand">
            <div className="flex-center">
                {props.hand.cards.map((c, i) => {
                    return (
                        <div key={i}>
                            <CardView ruleSet={props.ruleSet} card={c} />

                            <div>
                                <button
                                    disabled={props.isLost || props.cardToPlay !== undefined}
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
