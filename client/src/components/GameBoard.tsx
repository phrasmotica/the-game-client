import React, { Component } from "react"

import { HandSummaryView } from "./HandSummaryView"
import { HandView } from "./HandView"
import { PileView } from "./PileView"
import { RuleSummary } from "./RuleSummary"
import { StartingPlayerSelector } from "./StartingPlayerSelector"

import { ClientMode } from "../models/ClientMode"
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
     * The client mode.
     */
    clientMode: ClientMode

    /**
     * Adds the given player's starting player vote.
     */
    addStartVote: (startingPlayer: string) => void

    /**
     * Removes the given player's starting player vote.
     */
    removeStartVote: () => void

    /**
     * Starts a new game.
     */
    newGame: (ruleSet: RuleSet) => void

    /**
     * Sets the game data.
     */
    setGameData: (gameData: GameData) => void

    /**
     * Plays a card.
     */
    playCard: (gameData: GameData) => void

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

        let ruleSummary = <RuleSummary ruleSet={ruleSet} />

        let turnIndicator = <span>It's your turn!</span>
        if (!this.isInProgress()) {
            if (this.isPlayerClient()) {
                turnIndicator = (
                    <StartingPlayerSelector
                        players={this.props.gameData.players}
                        hasVoted={this.props.gameData.startingPlayerVote.hasVoted(this.props.playerName)}
                        confirm={this.props.addStartVote}
                        cancel={this.props.removeStartVote} />
                )
            }
            else {
                turnIndicator = <span>Starting player vote in progress...</span>
            }
        }
        else if (this.isWon()) {
            if (this.isPlayerClient()) {
                turnIndicator = <span>You won!</span>
            }
            else {
                turnIndicator = <span>Game won!</span>
            }
        }
        else if (this.isLost()) {
            if (this.isPlayerClient()) {
                turnIndicator = <span>You lost!</span>
            }
            else {
                turnIndicator = <span>Game lost!</span>
            }
        }
        else if (!this.isMyTurn()) {
            turnIndicator = (
                <span>
                    It's {this.props.gameData.getCurrentPlayer()}'s turn.
                </span>
            )
        }

        let gameIsOver = this.isLost() || this.isWon()

        let hand = this.getHand()

        let handElement = null
        if (this.isPlayerClient()) {
            let disableButtons = !this.isInProgress() || this.isLost() || !this.isMyTurn() || this.props.gameData.cardToPlay !== undefined
            handElement = (
                <HandView
                    ruleSet={ruleSet}
                    hand={hand}
                    disableButtons={disableButtons}
                    cardToPlay={this.props.gameData.cardToPlay}
                    setCardToPlay={card => this.setCardToPlay(card)} />
            )
        }
        else {
            let player = this.props.gameData.getCurrentPlayer()

            let hand = undefined
            if (player !== undefined) {
                hand = this.props.gameData.getHand(player)
            }

            handElement = (
                <HandSummaryView
                    player={player}
                    hand={hand} />
            )
        }

        let actionButtonsElement = null
        if (this.isPlayerClient()) {
            actionButtonsElement = (
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
            )
        }

        let leaveButtonElement = null
        if (this.isPlayerClient()) {
            leaveButtonElement = (
                <button
                    onClick={() => this.props.leaveGame()}>
                    Leave Game
                </button>
            )
        }
        else {
            leaveButtonElement = (
                <button
                    onClick={() => this.props.leaveGame()}>
                    Stop Spectating
                </button>
            )
        }

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

                <div className="flex-center space-around">
                    {ruleSummary}
                    {turnIndicator}
                </div>

                <div className="flex-center">
                    {handElement}
                </div>

                {actionButtonsElement}

                <div className="flex-center margin-bottom">
                    {leaveButtonElement}
                </div>
            </div>
        )
    }

    /**
     * Returns whether the game is in progress.
     */
    isInProgress() {
        return this.props.gameData.isInProgress()
    }

    /**
     * Returns whether the game has been won.
     */
    isWon() {
        return this.props.gameData.isWon
    }

    /**
     * Returns whether the game has been lost.
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

        this.props.playCard(newGameData)
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
     * Returns the current player's hand.
     */
    getCurrentHand() {
        let currentPlayer = this.props.gameData.getCurrentPlayer()
        if (currentPlayer === undefined) {
            return null
        }

        return this.props.gameData.getHand(currentPlayer)
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

    /**
     * Returns whether the client is in player mode.
     */
    isPlayerClient() {
        return this.props.clientMode === ClientMode.Player
    }
}