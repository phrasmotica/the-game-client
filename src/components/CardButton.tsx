import React from "react"
import { Button } from "semantic-ui-react"

import { Card, RuleSet } from "the-game-lib"

interface CardButtonProps {
    /**
     * The rule set.
     */
    ruleSet: RuleSet

    /**
     * The card to render.
     */
    card?: Card

    /**
     * Whether the card is selected.
     */
    isSelected?: boolean

    /**
     * Sets the card to be played.
     */
    setCardToPlay: () => void
}

/**
 * Renders a card.
 */
export function CardButton(props: CardButtonProps) {
    let card = props.card

    let cardIsOnFire = card !== undefined
                    && props.ruleSet.isOnFire()
                    && props.ruleSet.cardIsOnFire(card)

    let className = "card-button"
    if (cardIsOnFire) {
        className += " on-fire"
    }

    return (
        <div className={className}>
            <Button
                className="no-margin"
                color={props.isSelected ? "yellow" : undefined}
                onClick={props.setCardToPlay}>
                {card?.value ?? "-"}
            </Button>
        </div>
    )
}
