import React, { Component } from "react"

import { Direction, Pile } from "../gameData/Pile"
import { RuleSet } from "../gameData/RuleSet"

interface PileProps {
    /**
     * The rule set.
     */
    ruleSet: RuleSet

    /**
     * The pile's starting number.
     */
    start: number

    /**
     * The pile's direction.
     */
    direction: Direction

    /**
     * The card to play.
     */
    cardToPlay: number | undefined

    /**
     * Sets the card to be played.
     */
    setCardToPlay: (card: number | undefined) => void

    /**
     * Removes the given card from the player's hand.
     */
    removeCardFromHand: (card: number) => void
}

interface PileState {
    /**
     * The pile.
     */
    pile: Pile
}

/**
 * Renders a pile.
 */
export class PileView extends Component<PileProps, PileState> {
    /**
     * Constructor.
     */
    constructor(props: PileProps) {
        super(props)

        this.state = {
            pile: new Pile(props.start, props.direction)
        }
    }

    /**
     * Renders the pile.
     */
    render() {
        let directionElement = <span className="direction-text">(UP)</span>
        if (this.state.pile.direction === Direction.Descending) {
            directionElement = <span className="direction-text">(DOWN)</span>
        }

        let top = this.state.pile.top()
        let topElement = <span>{top}</span>
        if (top === this.state.pile.start) {
            topElement = <span>-</span>
        }

        let cardToPlay = this.props.cardToPlay

        return (
            <div className="pile-set">
                <div className="pile">
                    <div>
                        <span className="start-text">{this.state.pile.start}</span>
                    </div>

                    <div>
                        {directionElement}
                    </div>

                    <div>
                        {topElement}
                    </div>
                </div>

                <div className="pile-button">
                    <button
                        disabled={cardToPlay === undefined || !this.canPlayCard(cardToPlay)}
                        onClick={() => this.playCard(cardToPlay)}>
                        Play
                    </button>
                </div>
            </div>
        )
    }

    /**
     * Plays the given card on this pile.
     */
    playCard(card: number | undefined) {
        if (card) {
            this.state.pile.push(card, this.props.ruleSet)
            this.props.removeCardFromHand(card)
        }

        this.props.setCardToPlay(undefined)
    }

    /**
     * Returns whether the given card can be played on this pile.
     */
    canPlayCard(card: number) {
        return this.state.pile.canBePlayed(card, this.props.ruleSet)
    }
}
