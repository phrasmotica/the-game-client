import React from "react"
import { Button } from "semantic-ui-react"

import { Card, RuleSet } from "the-game-lib"

import { CardView } from "./CardView"

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
     * Whether the button should be disabled.
     */
    isDisabled?: boolean

    /**
     * Sets the card to be played.
     */
    setCardToPlay: () => void
}

/**
 * Renders a card.
 */
export const CardButton = (props: CardButtonProps) => {
    return (
        <div className="card-button">
            <Button
                className="no-margin"
                disabled={props.isDisabled}
                onClick={props.setCardToPlay}>
                <CardView
                    card={props.card}
                    ruleSet={props.ruleSet}
                    isSelected={props.isSelected} />
            </Button>
        </div>
    )
}
