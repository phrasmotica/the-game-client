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
     * Whether the card should be rendered as selected.
     */
    isSelected?: boolean
}

/**
 * Renders a card.
 */
export function CardView(props: CardViewProps) {
    let card = props.card

    let cardIsOnFire = card !== undefined && props.ruleSet.cardIsOnFire(card)
    let className = props.ruleSet.isOnFire() && cardIsOnFire ? "card-on-fire" : "card"

    if (props.isSelected) {
        className += " card-selected"
    }

    return (
        <div className={className}>
            <span>{card?.value ?? "-"}</span>
        </div>
    )
}
