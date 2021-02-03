import React from "react"

import { Card, RuleSet } from "the-game-lib"

interface CardViewProps {
    /**
     * The rule set.
     */
    ruleSet?: RuleSet

    /**
     * The card to render.
     */
    card?: Card

    /**
     * Whether to show the card's value.
     */
    showCardValue?: boolean

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
    let ruleSet = props.ruleSet

    let cardIsOnFire = card !== undefined
                    && ruleSet !== undefined
                    && ruleSet.isOnFire()
                    && ruleSet.cardIsOnFire(card)

    let className = "card"

    if (cardIsOnFire) {
        className += " on-fire"
    }

    if (props.isSelected) {
        className += " selected"
    }

    if (props.isJustPlayed) {
        className += " just-played"
    }

    let text = "-"
    if (card !== undefined) {
        text = (props.showCardValue ?? true) || card.revealed ? `${card.value}` : "?"
    }

    return (
        <div className={className}>
            <span>{text}</span>
        </div>
    )
}
