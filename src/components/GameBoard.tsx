import React, { Component } from "react"

import { HandView } from "./HandView"
import { GameOptions } from "./GameOptions"
import { PileView } from "./PileView"

import { Deck } from "../gameData/Deck"
import { Hand } from "../gameData/Hand"
import { Direction } from "../gameData/Pile"
import { RuleSet } from "../gameData/RuleSet"

interface GameBoardProps {

}

interface GameBoardState {
    /**
     * The rule set.
     */
    ruleSet: RuleSet

    /**
     * The deck of cards.
     */
    deck: Deck

    /**
     * The player's hand.
     */
    hand: Hand

    /**
     * The card to play.
     */
    cardToPlay: number | undefined
}

export class GameBoard extends Component<GameBoardProps, GameBoardState> {
    /**
     * Constructor.
     */
    constructor(props: GameBoardProps) {
        super(props)

        let ruleSet = RuleSet.default()
        let deck = Deck.create(2, ruleSet.topLimit)
        let hand = new Hand(deck.draw(ruleSet.handSize))

        this.state = {
            ruleSet: ruleSet,
            deck: deck,
            hand: hand,
            cardToPlay: undefined
        }
    }

    /**
     * Renders the game board.
     */
    render() {
        let deckInfo = <span>Cards left: {this.state.deck.size()}</span>
        if (this.isWon()) {
            deckInfo = <span>You won!</span>
        }

        let ruleSet = this.state.ruleSet

        let ascendingPiles = []
        for (let p = 0; p < ruleSet.pairsOfPiles; p++) {
            ascendingPiles.push(
                <PileView
                    ruleSet={ruleSet}
                    start={1}
                    direction={Direction.Ascending}
                    cardToPlay={this.state.cardToPlay}
                    setCardToPlay={(card) => this.setCardToPlay(card)}
                    removeCardFromHand={(card) => this.playCard(card)} />
            )
        }

        let descendingPiles = []
        for (let q = 0; q < ruleSet.pairsOfPiles; q++) {
            descendingPiles.push(
                <PileView
                    ruleSet={ruleSet}
                    start={ruleSet.topLimit}
                    direction={Direction.Descending}
                    cardToPlay={this.state.cardToPlay}
                    setCardToPlay={(card) => this.setCardToPlay(card)}
                    removeCardFromHand={(card) => this.playCard(card)} />
            )
        }

        return (
            <div className="game-board">
                <GameOptions newGame={(ruleSet) => this.newGame(ruleSet)} />

                <div className="deck-info">
                    {deckInfo}
                </div>

                <div className="flex-center">
                    {ascendingPiles}
                    {descendingPiles}
                </div>

                <div>
                    <HandView
                        ruleSet={ruleSet}
                        hand={this.state.hand}
                        cardToPlay={this.state.cardToPlay}
                        setCardToPlay={(card) => this.setCardToPlay(card)} />
                </div>

                <div>
                    <button
                        disabled={this.state.cardToPlay === undefined}
                        onClick={() => this.setCardToPlay(undefined)}>
                        Cancel
                    </button>
                </div>
            </div>
        )
    }

    /**
     * Returns whether the game has been won.
     */
    isWon() {
        return this.state.deck.isEmpty() && this.state.hand.isEmpty()
    }

    /**
     * Starts a new game.
     */
    newGame(ruleSet: RuleSet) {
        let deck = Deck.create(2, ruleSet.topLimit)
        let hand = new Hand(deck.draw(ruleSet.handSize))

        this.setState({
            ruleSet: ruleSet,
            deck: deck,
            hand: hand,
            cardToPlay: undefined
        })
    }

    /**
     * Sets the card to play.
     */
    setCardToPlay(card: number | undefined) {
        this.setState({ cardToPlay: card })
    }

    /**
     * Plays the given card from the player's hand.
     */
    playCard(card: number) {
        this.state.hand.remove(card)

        if (!this.state.deck.isEmpty()) {
            let newCard = this.state.deck.drawOne()
            this.state.hand.add(newCard)
        }
    }
}