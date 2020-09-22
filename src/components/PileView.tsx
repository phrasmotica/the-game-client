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
    removeCardFromHand: (card: number) => void

    /**
     * Loses the game.
     */
    loseGame: () => void
}

interface PileViewState {
    /**
     * The pile.
     */
    pile: Pile
}

/**
 * Renders a pile.
 */
export class PileView extends Component<PileViewProps, PileViewState> {
    /**
     * Constructor.
     */
    constructor(props: PileViewProps) {
        super(props)

        this.state = {
            pile: this.createPile()
        }
    }

    /**
     * Checks for rule set changes and creates a new pile if necessary.
     */
    componentDidUpdate(prevProps: PileViewProps) {
        if (this.props.ruleSet !== prevProps.ruleSet) {
            this.setState({
                pile: this.createPile()
            })
        }

        if (this.props.turnsPlayed === prevProps.turnsPlayed + 1) {
            this.state.pile.endTurn(this.props.ruleSet)
            if (this.state.pile.isDestroyed(this.props.ruleSet)) {
                console.log(`Pile ${this.props.index} is destroyed! You lose!`)
                this.props.loseGame()
            }

            this.setState({
                // hacky way of ensuring a re-render
                pile: this.state.pile
            })
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
        let topElement = <CardView ruleSet={this.props.ruleSet} card={top} />
        if (top === this.state.pile.start) {
            topElement = <CardView ruleSet={this.props.ruleSet} />
        }

        let pileClassName = "pile"
        let pileState = this.state.pile.getState(this.props.ruleSet)
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
                        disabled={this.props.isLost || cardToPlay === undefined || !this.canPlayCard(cardToPlay)}
                        onClick={() => this.playCard(cardToPlay)}>
                        Play
                    </button>
                </div>
            </div>
        )
    }

    /**
     * Creates a new pile from the props.
     */
    createPile() {
        return new Pile(this.props.index, this.props.start, this.props.direction)
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
