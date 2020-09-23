import React, { Component } from "react"

import { HandView } from "./HandView"
import { GameOptions } from "./GameOptions"
import { PileView } from "./PileView"

import { Deck } from "../gameData/Deck"
import { Hand } from "../gameData/Hand"
import { Direction, Pile } from "../gameData/Pile"
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
     * The piles.
     */
    piles: Pile[]

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
        let piles = this.createPiles(ruleSet)

        this.state = {
            ruleSet: ruleSet,
            deck: deck,
            hand: hand,
            piles: piles,
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
        let deckInfo = `Cards left in deck: ${this.state.deck.size()}`
        if (this.isWon()) {
            deckInfo = "You won!"
        }
        else if (this.state.isLost) {
            deckInfo = "You lost!"
        }

        let deckInfoElement = (
            <div className="half-width">
                <span>{deckInfo}</span>
            </div>
        )

        let handInfo = `Cards left to play this turn: ${this.getCardsLeftToPlayThisTurn()}`
        let handInfoElement = (
            <div className="half-width">
                <span>{handInfo}</span>
            </div>
        )

        let ruleSet = this.state.ruleSet
        let piles = this.state.piles

        let ascendingPiles = []
        for (let i = 0; i < ruleSet.pairsOfPiles; i++) {
            ascendingPiles.push(
                <PileView
                    key={i}
                    index={i}
                    pile={piles[i]}
                    ruleSet={ruleSet}
                    turnsPlayed={this.state.turnsPlayed}
                    isLost={this.state.isLost}
                    cardToPlay={this.state.cardToPlay}
                    setCardToPlay={(card) => this.setCardToPlay(card)}
                    playCard={(card) => this.playCard(card, i)}
                    loseGame={() => this.loseGame()} />
            )
        }

        let descendingPiles = []
        for (let j = 0; j < ruleSet.pairsOfPiles; j++) {
            let index = ruleSet.pairsOfPiles + j
            descendingPiles.push(
                <PileView
                    key={index}
                    index={index}
                    pile={piles[index]}
                    ruleSet={ruleSet}
                    turnsPlayed={this.state.turnsPlayed}
                    isLost={this.state.isLost}
                    cardToPlay={this.state.cardToPlay}
                    setCardToPlay={(card) => this.setCardToPlay(card)}
                    playCard={(card) => this.playCard(card, index)}
                    loseGame={() => this.loseGame()} />
            )
        }

        return (
            <div className="game-board">
                <div className="flex-center margin-bottom">
                    {deckInfoElement}
                    {handInfoElement}
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

                <div className="flex-center margin-bottom">
                    <button
                        className="cancel-button"
                        disabled={this.state.isLost || this.state.cardToPlay === undefined}
                        onClick={() => this.setCardToPlay(undefined)}>
                        Cancel
                    </button>

                    <button
                        className="end-turn-button"
                        disabled={this.state.isLost || !this.areEnoughCardsPlayed()}
                        onClick={() => this.endTurn()}>
                        End turn
                    </button>

                    <button
                        className="pass-button"
                        disabled={this.state.isLost || !this.noCardsCanBePlayed()}
                        onClick={() => this.loseGame()}>
                        Pass
                    </button>
                </div>

                <GameOptions newGame={(ruleSet) => this.newGame(ruleSet)} />
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
     * Returns whether no cards can be played on any piles.
     */
    noCardsCanBePlayed() {
        for (let card of this.state.hand.cards) {
            for (let pile of this.state.piles) {
                if (pile.canBePlayed(card, this.state.ruleSet)) {
                    return false
                }
            }
        }

        return true
    }

    /**
     * Starts a new game.
     */
    newGame(ruleSet: RuleSet) {
        let deck = Deck.create(2, ruleSet.topLimit)
        let hand = new Hand(deck.draw(ruleSet.handSize))
        let piles = this.createPiles(ruleSet)

        this.setState({
            ruleSet: ruleSet,
            deck: deck,
            hand: hand,
            piles: piles,
            turnsPlayed: 0,
            cardToPlay: undefined,
            cardsPlayedThisTurn: 0,
            isLost: false,
        })
    }

    /**
     * Creates piles for the rule set.
     */
    createPiles(ruleSet: RuleSet) {
        let piles = []

        for (let i = 0; i < ruleSet.pairsOfPiles; i++) {
            let pile = new Pile(i, 1, Direction.Ascending)
            piles.push(pile)
        }

        for (let j = 0; j < ruleSet.pairsOfPiles; j++) {
            let index = ruleSet.pairsOfPiles + j
            let pile = new Pile(index, ruleSet.topLimit, Direction.Descending)
            piles.push(pile)
        }

        return piles
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
    playCard(card: number, pileIndex: number) {
        let pile = this.state.piles[pileIndex]
        pile.push(card, this.state.ruleSet)
        this.state.hand.remove(card)

        this.setState((prevState => ({
            cardsPlayedThisTurn: prevState.cardsPlayedThisTurn + 1
        })))
    }

    /**
     * Returns the number of cards that must be played this turn.
     */
    getCardsToPlay() {
        if (this.state.deck.isEmpty()) {
            return this.state.ruleSet.cardsPerTurnInEndgame
        }

        return this.state.ruleSet.cardsPerTurn
    }

    /**
     * Returns whether enough cards have been played.
     */
    areEnoughCardsPlayed() {
        return this.state.cardsPlayedThisTurn >= this.getCardsToPlay()
    }

    /**
     * Returns the remaining number of cards that must be played this turn.
     */
    getCardsLeftToPlayThisTurn() {
        return Math.max(this.getCardsToPlay() - this.state.cardsPlayedThisTurn, 0)
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

        for (let pile of this.state.piles) {
            pile.endTurn(this.state.ruleSet)

            if (pile.isDestroyed(this.state.ruleSet)) {
                console.log(`Pile ${pile.index} is destroyed! You lose!`)
                this.loseGame()
                return
            }
        }

        this.setState((prevState => ({
            turnsPlayed: prevState.turnsPlayed + 1,
            cardsPlayedThisTurn: 0,
            isLost: this.noCardsCanBePlayed(),
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