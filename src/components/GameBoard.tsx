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
     * The number of turns played.
     */
    turnsPlayed: number

    /**
     * The card to play.
     */
    cardToPlay: number | undefined

    /**
     * The number of cards played this turn.
     */
    cardsPlayedThisTurn: number

    /**
     * Whether the game is lost.
     */
    isLost: boolean
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
            turnsPlayed: 0,
            cardToPlay: undefined,
            cardsPlayedThisTurn: 0,
            isLost: false,
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
        else if (this.state.isLost) {
            deckInfo = <span>You lost!</span>
        }

        let ruleSet = this.state.ruleSet

        let ascendingPiles = []
        for (let p = 0; p < ruleSet.pairsOfPiles; p++) {
            ascendingPiles.push(
                <PileView
                    index={p}
                    ruleSet={ruleSet}
                    start={1}
                    direction={Direction.Ascending}
                    turnsPlayed={this.state.turnsPlayed}
                    isLost={this.state.isLost}
                    cardToPlay={this.state.cardToPlay}
                    setCardToPlay={(card) => this.setCardToPlay(card)}
                    removeCardFromHand={(card) => this.playCard(card)}
                    loseGame={() => this.loseGame()} />
            )
        }

        let descendingPiles = []
        for (let q = 0; q < ruleSet.pairsOfPiles; q++) {
            descendingPiles.push(
                <PileView
                    index={ruleSet.pairsOfPiles + q}
                    ruleSet={ruleSet}
                    start={ruleSet.topLimit}
                    direction={Direction.Descending}
                    turnsPlayed={this.state.turnsPlayed}
                    isLost={this.state.isLost}
                    cardToPlay={this.state.cardToPlay}
                    setCardToPlay={(card) => this.setCardToPlay(card)}
                    removeCardFromHand={(card) => this.playCard(card)}
                    loseGame={() => this.loseGame()} />
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
                        isLost={this.state.isLost}
                        setCardToPlay={(card) => this.setCardToPlay(card)} />
                </div>

                <div className="flex-center">
                    <button
                        className="cancel-button"
                        disabled={this.state.isLost || this.state.cardToPlay === undefined}
                        onClick={() => this.setCardToPlay(undefined)}>
                        Cancel
                    </button>

                    <button
                        className="end-turn-button"
                        disabled={this.state.cardsPlayedThisTurn < ruleSet.cardsPerTurn}
                        onClick={() => this.endTurn()}>
                        End Turn
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
            turnsPlayed: 0,
            cardToPlay: undefined,
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

        this.setState((prevState => ({
            cardsPlayedThisTurn: prevState.cardsPlayedThisTurn + 1
        })))
    }

    /**
     * Ends the turn according to the given rule set.
     */
    endTurn() {
        console.log(`Turns played: ${this.state.turnsPlayed + 1}`)

        for (let i = 0; i < this.state.cardsPlayedThisTurn; i++) {
            if (!this.state.deck.isEmpty()) {
                let newCard = this.state.deck.drawOne()
                this.state.hand.add(newCard)
            }
        }

        this.setState((prevState => ({
            turnsPlayed: prevState.turnsPlayed + 1,
            cardsPlayedThisTurn: 0
        })))
    }

    /**
     * Loses the game.
     */
    loseGame() {
        this.setState({
            isLost: true
        })
    }
}