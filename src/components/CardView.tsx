import React from "react"

import { GameMode, RuleSet } from "../gameData/RuleSet"

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

    let gameIsOnFire = props.ruleSet.gameMode === GameMode.OnFire
    let cardIsOnFire = card !== undefined && props.ruleSet.cardIsOnFire(card)
    let className = gameIsOnFire && cardIsOnFire ? "card-on-fire" : "card"

    return (
        <div className={className}>
            <span>{card ?? "-"}</span>
        </div>
    )
}
