import React, { Component } from "react"

import { HandSummaryView } from "./HandSummaryView"
import { HandView } from "./HandView"
import { PileView } from "./PileView"
import { RuleSummary } from "./RuleSummary"
import { StartingPlayerSelector } from "./StartingPlayerSelector"

import { ClientMode } from "../models/ClientMode"
import { GameData } from "../models/GameData"
import { Message } from "../models/Message"
import { Direction, Pile } from "../models/Pile"
import { RoomData } from "../models/RoomData"
import { RuleSet } from "../models/RuleSet"
import { RoomWith } from "../models/RoomWith"

interface GameBoardProps {
    /**
     * The socket for server communication.
     */
    socket: SocketIOClient.Socket

    /**
     * The player's name.
     */
    playerName: string

    /**
     * The rule set.
     */
    roomData: RoomData

    /**
     * The client mode.
     */
    clientMode: ClientMode
}

interface GameBoardState {

}

export class GameBoard extends Component<GameBoardProps, GameBoardState> {
    /**
     * Renders the game board.
     */
    render() {
        let roomData = this.props.roomData
        let gameData = roomData.gameData

        let deckInfo = `Cards left in deck: ${gameData.deck.size()}`
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

        let ruleSet = gameData.ruleSet
        let piles = gameData.piles

        let ascendingPiles = []
        for (let i = 0; i < ruleSet.pairsOfPiles; i++) {
            ascendingPiles.push(
                <PileView
                    key={i}
                    index={i}
                    pile={piles[i]}
                    ruleSet={ruleSet}
                    turnsPlayed={gameData.turnsPlayed}
                    isMyTurn={this.isMyTurn()}
                    isLost={this.isLost()}
                    cardToPlay={gameData.cardToPlay}
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
                    turnsPlayed={gameData.turnsPlayed}
                    isMyTurn={this.isMyTurn()}
                    isLost={this.isLost()}
                    cardToPlay={gameData.cardToPlay}
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
                        socket={this.props.socket}
                        roomName={roomData.name}
                        playerName={this.props.playerName}
                        players={gameData.players}
                        hasVoted={gameData.startingPlayerVote.hasVoted(this.props.playerName)} />
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
                    It's {gameData.getCurrentPlayer()}'s turn.
                </span>
            )
        }

        let gameIsOver = this.isLost() || this.isWon()

        let hand = this.getHand()

        let handElement = null
        if (this.isPlayerClient()) {
            let disableButtons = !this.isInProgress() || this.isLost() || !this.isMyTurn() || gameData.cardToPlay !== undefined
            handElement = (
                <HandView
                    ruleSet={ruleSet}
                    hand={hand}
                    disableButtons={disableButtons}
                    cardToPlay={gameData.cardToPlay}
                    setCardToPlay={card => this.setCardToPlay(card)} />
            )
        }
        else {
            let player = gameData.getCurrentPlayer()

            let hand = undefined
            if (player !== undefined) {
                hand = gameData.getHand(player)
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
                        disabled={gameIsOver || !this.isMyTurn() || gameData.cardToPlay === undefined}
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
                    onClick={() => this.leaveGame()}>
                    Leave Game
                </button>
            )
        }
        else {
            leaveButtonElement = (
                <button
                    onClick={() => this.leaveGame()}>
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
        return this.props.roomData.gameData.isInProgress()
    }

    /**
     * Returns whether the game has been won.
     */
    isWon() {
        return this.props.roomData.gameData.isWon
    }

    /**
     * Returns whether the game has been lost.
     */
    isLost() {
        return this.props.roomData.gameData.isLost
    }

    /**
     * Returns whether no cards can be played on any piles.
     */
    noCardsCanBePlayed() {
        let gameData = this.props.roomData.gameData
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
        return this.props.roomData.gameData.getCurrentPlayer() === this.props.playerName
    }

    /**
     * Sets the game data and sends the new data to the server.
     */
    setGameData(gameData: GameData) {
        let newRoomData = RoomData.from(this.props.roomData)
        newRoomData.gameData = gameData

        let message = Message.info(newRoomData)
        this.props.socket.emit("roomData", message)
    }

    /**
     * Sets the card to play.
     */
    setCardToPlay(card: number | undefined) {
        let newGameData = this.props.roomData.gameData
        newGameData.cardToPlay = card
        this.setGameData(newGameData)
    }

    /**
     * Plays the given card from the player's hand.
     */
    playCard(card: number, pileIndex: number) {
        let newGameData = this.props.roomData.gameData

        let pile = newGameData.piles[pileIndex]
        pile.push(card, this.props.roomData.gameData.ruleSet)

        let hand = this.getHand()
        hand!.remove(card)

        newGameData.cardsPlayedThisTurn++

        let newRoomData = RoomData.from(this.props.roomData)
        newRoomData.gameData = newGameData

        let message = Message.info(newRoomData)
        this.props.socket.emit("playCard", message)
    }

    /**
     * Returns the number of cards that must be played this turn.
     */
    getCardsToPlay() {
        let gameData = this.props.roomData.gameData

        if (gameData.deck.isEmpty()) {
            return gameData.ruleSet.cardsPerTurnInEndgame
        }

        return gameData.ruleSet.cardsPerTurn
    }

    /**
     * Returns whether enough cards have been played.
     */
    areEnoughCardsPlayed() {
        return this.props.roomData.gameData.cardsPlayedThisTurn >= this.getCardsToPlay()
    }

    /**
     * Returns the remaining number of cards that must be played this turn.
     */
    getCardsLeftToPlayThisTurn() {
        return Math.max(this.getCardsToPlay() - this.props.roomData.gameData.cardsPlayedThisTurn, 0)
    }

    /**
     * Returns the player's hand.
     */
    getHand() {
        return this.props.roomData.gameData.getHand(this.props.playerName)
    }

    /**
     * Returns the current player's hand.
     */
    getCurrentHand() {
        let currentPlayer = this.props.roomData.gameData.getCurrentPlayer()
        if (currentPlayer === undefined) {
            return null
        }

        return this.props.roomData.gameData.getHand(currentPlayer)
    }

    /**
     * Sorts the hand into ascending order.
     */
    sortHand() {
        let newGameData = this.props.roomData.gameData
        let hand = this.getHand()
        if (hand !== undefined) {
            newGameData.hands[this.props.playerName] = hand.sort()
            this.setGameData(newGameData)
        }
    }

    /**
     * Ends the turn.
     */
    endTurn() {
        this.props.socket.emit("endTurn", this.props.roomData.name)
    }

    /**
     * Returns whether the client is in player mode.
     */
    isPlayerClient() {
        return this.props.clientMode === ClientMode.Player
    }

    /**
     * Leaves the game.
     */
    leaveGame() {
        let event = ""
        switch (this.props.clientMode) {
            case ClientMode.Player:
                event = "leaveGame"
                break;

            case ClientMode.Spectator:
                event = "stopSpectating"
                break;

            default:
                throw new Error(`Unrecognised client mode '${this.props.clientMode}'!`)
        }

        this.props.socket.emit(event, new RoomWith(this.props.roomData.name, this.props.playerName))
    }
}
