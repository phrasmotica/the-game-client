import React, { Component } from "react"

import { CardView } from "./CardView"

import { Hand } from "../gameData/Hand"
import { RuleSet } from "../gameData/RuleSet"

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

interface HandState {

}

/**
 * Renders a hand.
 */
export class HandView extends Component<HandProps, HandState> {
    /**
     * Renders the hand.
     */
    render() {
        if (this.props.hand.isEmpty()) {
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
                    {this.props.hand.cards.map(c => {
                        return (
                            <div>
                                <CardView ruleSet={this.props.ruleSet} card={c} />

                                <div>
                                    <button
                                        disabled={this.props.isLost || this.props.cardToPlay !== undefined}
                                        onClick={() => this.setCardToPlay(c)}>
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

    /**
     * Sets the card to play.
     */
    setCardToPlay(card: number) {
        this.props.setCardToPlay(card)
    }
}
