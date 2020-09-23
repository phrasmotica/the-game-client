import React from "react"

import { RuleSet } from "../gameData/RuleSet"

interface CardViewProps {
    /**
     * The rule set.
     */
    ruleSet: RuleSet

    /**
     * The card to render.
     */
    card?: number
}

/**
 * Renders a card.
 */
export function CardView(props: CardViewProps) {
    let card = props.card

    let cardIsOnFire = card !== undefined && props.ruleSet.cardIsOnFire(card)
    let className = props.ruleSet.isOnFire() && cardIsOnFire ? "card-on-fire" : "card"

    return (
        <div className={className}>
            <span>{card ?? "-"}</span>
        </div>
    )
}
