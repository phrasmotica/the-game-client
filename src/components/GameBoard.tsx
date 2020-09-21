import React, { Component } from "react"

import { HandView } from "./HandView"
import { PileView } from "./PileView"

import { Deck } from "../gameData/Deck"
import { Hand } from "../gameData/Hand"
import { Direction } from "../gameData/Pile"
import { Settings } from "../gameData/Settings"

interface GameBoardProps {

}

interface GameBoardState {
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

        let deck = Deck.create(2, Settings.TopLimit)
        let hand = new Hand(deck.draw(Settings.HandSize))

        this.state = {
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

        let piles = []
        for (let p = 0; p < Settings.PairsOfPiles; p++) {
            piles.push(
                <PileView
                    start={1}
                    direction={Direction.Ascending}
                    cardToPlay={this.state.cardToPlay}
                    setCardToPlay={(card) => this.setCardToPlay(card)}
                    removeCardFromHand={(card) => this.playCard(card)} />
            )
        }

        for (let p = 0; p < Settings.PairsOfPiles; p++) {
            piles.push(
                <PileView
                    start={Settings.TopLimit}
                    direction={Direction.Descending}
                    cardToPlay={this.state.cardToPlay}
                    setCardToPlay={(card) => this.setCardToPlay(card)}
                    removeCardFromHand={(card) => this.playCard(card)} />
            )
        }

        return (
            <div className="game-board">
                <div className="game-options">
                    <button
                        onClick={() => this.newGame()}>
                        New Game
                    </button>
                </div>

                <div className="deck-info">
                    {deckInfo}
                </div>

                <div className="flex-center">
                    {piles}
                </div>

                <div>
                    <HandView
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
    newGame() {
        let deck = Deck.create(2, Settings.TopLimit)
        let hand = new Hand(deck.draw(Settings.HandSize))

        this.setState({
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