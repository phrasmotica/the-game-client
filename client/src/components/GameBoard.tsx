import React, { Component } from "react"

import { HandView } from "./HandView"
import { PileView } from "./PileView"

import { GameData } from "../models/GameData"
import { Direction, Pile } from "../models/Pile"
import { RuleSet } from "../models/RuleSet"

interface GameBoardProps {
    /**
     * The player's name.
     */
    playerName: string

    /**
     * The rule set.
     */
    gameData: GameData

    /**
     * Starts a new game.
     */
    newGame: (ruleSet: RuleSet) => void

    /**
     * Sets the game data.
     */
    setGameData: (gameData: GameData) => void

    /**
     * Ends the turn.
     */
    endTurn: () => void

    /**
     * Leaves the game.
     */
    leaveGame: () => void
}

interface GameBoardState {

}

export class GameBoard extends Component<GameBoardProps, GameBoardState> {
    /**
     * Renders the game board.
     */
    render() {
        let deckInfo = `Cards left in deck: ${this.props.gameData.deck.size()}`
        let deckInfoElement = (
            <div className="half-width">
                <span className="game-info-text">{deckInfo}</span>
            </div>
        )

        let handInfo = `Cards left to play this turn: ${this.getCardsLeftToPlayThisTurn()}`
        let handInfoElement = (
            <div className="half-width">
                <span className="game-info-text">{handInfo}</span>
            </div>
        )

        let ruleSet = this.props.gameData.ruleSet
        let piles = this.props.gameData.piles

        let ascendingPiles = []
        for (let i = 0; i < ruleSet.pairsOfPiles; i++) {
            ascendingPiles.push(
                <PileView
                    key={i}
                    index={i}
                    pile={piles[i]}
                    ruleSet={ruleSet}
                    turnsPlayed={this.props.gameData.turnsPlayed}
                    isMyTurn={this.isMyTurn()}
                    isLost={this.isLost()}
                    cardToPlay={this.props.gameData.cardToPlay}
                    setCardToPlay={(card) => this.setCardToPlay(card)}
                    playCard={(card) => this.playCard(card, i)} />
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
                    turnsPlayed={this.props.gameData.turnsPlayed}
                    isMyTurn={this.isMyTurn()}
                    isLost={this.isLost()}
                    cardToPlay={this.props.gameData.cardToPlay}
                    setCardToPlay={(card) => this.setCardToPlay(card)}
                    playCard={(card) => this.playCard(card, index)} />
            )
        }

        let turnIndicatorText = "It's your turn!"
        if (this.isWon()) {
            turnIndicatorText = "You won!"
        }
        else if (this.isLost()) {
            turnIndicatorText = "You lost!"
        }
        else if (!this.isMyTurn()) {
            turnIndicatorText = `It's ${this.props.gameData.getCurrentPlayer()}'s turn.`
        }

        let gameIsOver = this.isLost() || this.isWon()

        let hand = this.getHand()

        return (
            <div className="game-board">
                <div className="flex-center margin-bottom">
                    {deckInfoElement}
                    {handInfoElement}
                </div>

                <div className="flex-center space-around">
                    {ascendingPiles}
                    {descendingPiles}
                </div>

                <div>
                    <span>{turnIndicatorText}</span>
                </div>

                <div>
                    <HandView
                        ruleSet={ruleSet}
                        hand={hand}
                        cardToPlay={this.props.gameData.cardToPlay}
                        isMyTurn={this.isMyTurn()}
                        isLost={this.isLost()}
                        setCardToPlay={(card) => this.setCardToPlay(card)} />
                </div>

                <div className="flex-center margin-bottom">
                    <button
                        className="margin-right"
                        disabled={gameIsOver || !this.isMyTurn() || this.props.gameData.cardToPlay === undefined}
                        onClick={() => this.setCardToPlay(undefined)}>
                        Cancel
                    </button>

                    <button
                        className="margin-right"
                        disabled={gameIsOver || hand?.isEmpty()}
                        onClick={() => this.sortHand()}>
                        Sort hand
                    </button>

                    <button
                        className="margin-right"
                        disabled={gameIsOver || !this.isMyTurn() || !this.areEnoughCardsPlayed()}
                        onClick={() => this.endTurn()}>
                        End turn
                    </button>

                    <button
                        disabled={gameIsOver || !this.isMyTurn() || !this.noCardsCanBePlayed()}
                        onClick={() => this.endTurn()}>
                        Pass
                    </button>
                </div>

                <div className="flex-center margin-bottom">
                    <button
                        onClick={() => this.props.leaveGame()}>
                        Leave Game
                    </button>
                </div>
            </div>
        )
    }

    /**
     * Returns whether the game has been won.
     */
    isWon() {
        return this.props.gameData.isWon
    }

    /**
     * Returns whether the game has been ;lost.
     */
    isLost() {
        return this.props.gameData.isLost
    }

    /**
     * Returns whether no cards can be played on any piles.
     */
    noCardsCanBePlayed() {
        let gameData = this.props.gameData
        let hand = this.getHand()

        if (hand === undefined || hand.isEmpty()) {
            return false
        }

        for (let card of hand.cards) {
            for (let pile of gameData.piles) {
                if (pile.canBePlayed(card, gameData.ruleSet)) {
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
        this.props.newGame(ruleSet)
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
     * Returns whether it's the player's turn.
     */
    isMyTurn() {
        return this.props.gameData.getCurrentPlayer() === this.props.playerName
    }

    /**
     * Sets the card to play.
     */
    setCardToPlay(card: number | undefined) {
        let newGameData = this.props.gameData
        newGameData.cardToPlay = card
        this.props.setGameData(newGameData)
    }

    /**
     * Plays the given card from the player's hand.
     */
    playCard(card: number, pileIndex: number) {
        let newGameData = this.props.gameData

        let pile = newGameData.piles[pileIndex]
        pile.push(card, this.props.gameData.ruleSet)

        let hand = this.getHand()
        hand!.remove(card)

        newGameData.cardsPlayedThisTurn++

        this.props.setGameData(newGameData)
    }

    /**
     * Returns the number of cards that must be played this turn.
     */
    getCardsToPlay() {
        let gameData = this.props.gameData

        if (gameData.deck.isEmpty()) {
            return gameData.ruleSet.cardsPerTurnInEndgame
        }

        return gameData.ruleSet.cardsPerTurn
    }

    /**
     * Returns whether enough cards have been played.
     */
    areEnoughCardsPlayed() {
        return this.props.gameData.cardsPlayedThisTurn >= this.getCardsToPlay()
    }

    /**
     * Returns the remaining number of cards that must be played this turn.
     */
    getCardsLeftToPlayThisTurn() {
        return Math.max(this.getCardsToPlay() - this.props.gameData.cardsPlayedThisTurn, 0)
    }

    /**
     * Returns the player's hand.
     */
    getHand() {
        return this.props.gameData.getHand(this.props.playerName)
    }

    /**
     * Sorts the hand into ascending order.
     */
    sortHand() {
        let newGameData = this.props.gameData
        let hand = this.getHand()
        if (hand !== undefined) {
            newGameData.hands[this.props.playerName] = hand.sort()
            this.props.setGameData(newGameData)
        }
    }

    /**
     * Ends the turn.
     */
    endTurn() {
        this.props.endTurn()
    }
}