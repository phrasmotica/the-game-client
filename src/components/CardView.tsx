import React from "react"

import { Card, RuleSet } from "the-game-lib"

interface CardViewProps {
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
     * Whether the card was just played.
     */
    isJustPlayed?: boolean
}

/**
 * Renders a card.
 */
export function CardView(props: CardViewProps) {
    let card = props.card

    let cardIsOnFire = card !== undefined
                    && props.ruleSet.isOnFire()
                    && props.ruleSet.cardIsOnFire(card)

    let className = cardIsOnFire ? "card-on-fire" : "card"

    if (props.isSelected) {
        className += " card-selected"
    }

    if (props.isJustPlayed) {
        className += "-just-played"
    }

    return (
        <div className={className}>
            <span>{card?.value ?? "-"}</span>
        </div>
    )
}
