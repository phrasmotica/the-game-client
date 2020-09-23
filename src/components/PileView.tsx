import React, { Component } from "react"

import { CardView } from "./CardView"

import { Direction, Pile, PileState } from "../gameData/Pile"
import { RuleSet } from "../gameData/RuleSet"

interface PileViewProps {
    /**
     * The index of the pile.
     */
    index: number

    /**
     * The pile.
     */
    pile: Pile

    /**
     * The rule set.
     */
    ruleSet: RuleSet

    /**
     * The number of turns played.
     */
    turnsPlayed: number

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

    /**
     * Removes the given card from the player's hand.
     */
    playCard: (card: number) => void

    /**
     * Loses the game.
     */
    loseGame: () => void
}

interface PileViewState {

}

/**
 * Renders a pile.
 */
export class PileView extends Component<PileViewProps, PileViewState> {
    /**
     * Renders the pile.
     */
    render() {
        let pile = this.props.pile

        let directionElement = <span className="direction-text">(UP)</span>
        if (pile.direction === Direction.Descending) {
            directionElement = <span className="direction-text">(DOWN)</span>
        }

        let top = pile.top()
        let topElement = <CardView ruleSet={this.props.ruleSet} card={top} />
        if (top === pile.start) {
            topElement = <CardView ruleSet={this.props.ruleSet} />
        }

        let pileClassName = "pile"
        let pileState = pile.getState(this.props.ruleSet)
        switch (pileState) {
            case PileState.Destroyed:
                pileClassName = "pile-destroyed"
                break;
            case PileState.OnFire:
                pileClassName = "pile-on-fire"
                break;
            default:
                break;
        }

        let cardToPlay = this.props.cardToPlay

        return (
            <div className="pile-set">
                <div className={pileClassName}>
                    <div>
                        <span className="start-text">{pile.start}</span>
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
                        disabled={this.props.isLost || cardToPlay === undefined || !this.canPlayCard(cardToPlay)}
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
            this.props.playCard(card)
        }

        this.props.setCardToPlay(undefined)
    }

    /**
     * Returns whether the given card can be played on this pile.
     */
    canPlayCard(card: number) {
        return this.props.pile.canBePlayed(card, this.props.ruleSet)
    }
}
