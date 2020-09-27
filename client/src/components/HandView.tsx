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

    // TODO: show which card is selected when cardToPlay is defined
    return (
        <div className="hand">
            <div className="flex-center">
                {props.hand.cards.map((c, i) => {
                    return (
                        <div key={i} className="card-set">
                            <CardView ruleSet={props.ruleSet} card={c} />

                            <div>
                                <button
                                    className="card-button"
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
