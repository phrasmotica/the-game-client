import React, { Component } from "react"

import { Hand } from "../gameData/Hand"
import { GameMode, RuleSet } from "../gameData/RuleSet"

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
                                {this.renderCard(c)}

                                <div>
                                    <button
                                        disabled={this.props.cardToPlay !== undefined}
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
     * Renders the given card.
     */
    renderCard(card: number) {
        let gameIsOnFire = this.props.ruleSet.gameMode === GameMode.OnFire
        let cardIsOnFire = this.props.ruleSet.cardIsOnFire(card)
        let className = gameIsOnFire && cardIsOnFire ? "card-on-fire" : "card"

        return (
            <div className={className}>
                <span>{card}</span>
            </div>
        )
    }


    setCardToPlay(card: number) {
        this.props.setCardToPlay(card)
    }
}
