import React, { Component } from "react"

import { Hand } from "../gameData/Hand"

interface HandProps {
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
                                <div className="card">
                                    <span>{c}</span>
                                </div>

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


    setCardToPlay(card: number) {
        this.props.setCardToPlay(card)
    }
}
