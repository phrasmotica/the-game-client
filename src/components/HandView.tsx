import React from "react"

import { Card, Hand, RuleSet } from "the-game-lib"

import { CardView } from "./CardView"

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
    cardToPlay: Card | undefined

    /**
     * Whether the buttons should be disabled.
     */
    disableButtons: boolean

    /**
     * Sets the card to be played.
     */
    setCardToPlay: (card: Card | undefined) => void
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
                                    disabled={props.disableButtons}
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
