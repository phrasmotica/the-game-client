import React from "react"

import { Card, Hand, RuleSet } from "the-game-lib"

import { CardButton } from "./CardButton"

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
export const HandView = (props: HandProps) => {
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
                    return (
                        <div key={i} className="card-button-container">
                            <CardButton
                                ruleSet={props.ruleSet}
                                card={c}
                                isSelected={props.cardToPlay?.value === c.value}
                                setCardToPlay={() => props.setCardToPlay(c)} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
