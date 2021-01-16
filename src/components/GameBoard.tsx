import React from "react"

import { HandSummaryView } from "./HandSummaryView"
import { HandView } from "./HandView"
import { PileView } from "./PileView"
import { RuleSummary } from "./RuleSummary"
import { StartingPlayerSelector } from "./StartingPlayerSelector"

import { ClientMode } from "../models/ClientMode"

import { RoomData } from "the-game-lib/dist/models/RoomData"
import { RoomWith } from "the-game-lib/dist/models/RoomWith"

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
     * The room data.
     */
    roomData: RoomData

    /**
     * The client mode.
     */
    clientMode: ClientMode
}

export function GameBoard(props: GameBoardProps) {
    /**
     * Returns whether the game is in progress.
     */
    const isInProgress = () => {
        return props.roomData.gameData.isInProgress()
    }

    /**
     * Returns whether the game has been won.
     */
    const isWon = () => {
        return props.roomData.gameData.isWon
    }

    /**
     * Returns whether the game has been lost.
     */
    const isLost = () => {
        return props.roomData.gameData.isLost
    }

    /**
     * Returns whether no cards can be played on any piles.
     */
    const noCardsCanBePlayed = () => {
        let gameData = props.roomData.gameData
        let hand = getHand()

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
     * Returns whether it's the player's turn.
     */
    const isMyTurn = () => {
        return props.roomData.gameData.getCurrentPlayer() === props.playerName
    }

    /**
     * Sets the card to play.
     */
    const setCardToPlay = (card: number | undefined) => {
        props.socket.emit("setCardToPlay", new RoomWith(props.roomData.name, card))
    }

    /**
     * Plays the given card from the player's hand.
     */
    const playCard = (card: number, pileIndex: number) => {
        let data: [string, number, number] = [props.playerName, card, pileIndex]
        props.socket.emit("playCard", new RoomWith(props.roomData.name, data))
    }

    /**
     * Returns the number of cards that must be played this turn.
     */
    const getCardsToPlay = () => {
        let gameData = props.roomData.gameData

        if (gameData.deck.isEmpty()) {
            return gameData.ruleSet.cardsPerTurnInEndgame
        }

        return gameData.ruleSet.cardsPerTurn
    }

    /**
     * Returns whether enough cards have been played.
     */
    const areEnoughCardsPlayed = () => {
        return props.roomData.gameData.cardsPlayedThisTurn >= getCardsToPlay()
    }

    /**
     * Returns the remaining number of cards that must be played this turn.
     */
    const getCardsLeftToPlayThisTurn = () => {
        return Math.max(getCardsToPlay() - props.roomData.gameData.cardsPlayedThisTurn, 0)
    }

    /**
     * Returns the player's hand.
     */
    const getHand = () => {
        return props.roomData.gameData.getHand(props.playerName)
    }

    /**
     * Sorts the hand into ascending order.
     */
    const sortHand = () => {
        props.socket.emit("sortHand", new RoomWith(props.roomData.name, props.playerName))
    }

    /**
     * Ends the turn.
     */
    const endTurn = () => {
        props.socket.emit("endTurn", props.roomData.name)
    }

    /**
     * Returns whether the client is in player mode.
     */
    const isPlayerClient = () => {
        return props.clientMode === ClientMode.Player
    }

    /**
     * Leaves the game.
     */
    const leaveGame = () => {
        let event = ""
        switch (props.clientMode) {
            case ClientMode.Player:
                event = "leaveGame"
                break;

            case ClientMode.Spectator:
                event = "stopSpectating"
                break;

            default:
                throw new Error(`Unrecognised client mode '${props.clientMode}'!`)
        }

        props.socket.emit(event, new RoomWith(props.roomData.name, props.playerName))
    }

    let roomData = props.roomData
    let gameData = roomData.gameData

    let deckInfo = `Cards left in deck: ${gameData.deck.size()}`
    let deckInfoElement = (
        <div className="half-width">
            <span className="game-info-text">{deckInfo}</span>
        </div>
    )

    let handInfo = `Cards left to play this turn: ${getCardsLeftToPlayThisTurn()}`
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
                isMyTurn={isMyTurn()}
                isLost={isLost()}
                cardToPlay={gameData.cardToPlay}
                setCardToPlay={card => setCardToPlay(card)}
                playCard={card => playCard(card, i)} />
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
                isMyTurn={isMyTurn()}
                isLost={isLost()}
                cardToPlay={gameData.cardToPlay}
                setCardToPlay={card => setCardToPlay(card)}
                playCard={card => playCard(card, index)} />
        )
    }

    let ruleSummary = <RuleSummary ruleSet={ruleSet} />

    let turnIndicator = <span>It's your turn!</span>
    if (!isInProgress()) {
        if (isPlayerClient()) {
            turnIndicator = (
                <StartingPlayerSelector
                    socket={props.socket}
                    roomName={roomData.name}
                    playerName={props.playerName}
                    players={gameData.players}
                    hasVoted={gameData.startingPlayerVote.hasVoted(props.playerName)} />
            )
        }
        else {
            turnIndicator = <span>Starting player vote in progress...</span>
        }
    }
    else if (isWon()) {
        if (isPlayerClient()) {
            turnIndicator = <span>You won!</span>
        }
        else {
            turnIndicator = <span>Game won!</span>
        }
    }
    else if (isLost()) {
        if (isPlayerClient()) {
            turnIndicator = <span>You lost!</span>
        }
        else {
            turnIndicator = <span>Game lost!</span>
        }
    }
    else if (!isMyTurn()) {
        turnIndicator = (
            <span>
                It's {gameData.getCurrentPlayer()}'s turn.
            </span>
        )
    }

    let gameIsOver = isLost() || isWon()

    let hand = getHand()

    let handElement = null
    if (isPlayerClient()) {
        let disableButtons = !isInProgress() || isLost() || !isMyTurn() || gameData.cardToPlay !== undefined
        handElement = (
            <HandView
                ruleSet={ruleSet}
                hand={hand}
                disableButtons={disableButtons}
                cardToPlay={gameData.cardToPlay}
                setCardToPlay={card => setCardToPlay(card)} />
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
    if (isPlayerClient()) {
        actionButtonsElement = (
            <div className="flex-center margin-bottom">
                <button
                    className="margin-right"
                    disabled={gameIsOver || !isMyTurn() || gameData.cardToPlay === undefined}
                    onClick={() => setCardToPlay(undefined)}>
                    Cancel
                </button>

                <button
                    className="margin-right"
                    disabled={gameIsOver || hand?.isEmpty()}
                    onClick={sortHand}>
                    Sort hand
                </button>

                <button
                    className="margin-right"
                    disabled={gameIsOver || !isMyTurn() || !areEnoughCardsPlayed()}
                    onClick={endTurn}>
                    End turn
                </button>

                <button
                    disabled={gameIsOver || !isMyTurn() || !noCardsCanBePlayed()}
                    onClick={endTurn}>
                    Pass
                </button>
            </div>
        )
    }

    let leaveButtonElement = null
    if (isPlayerClient()) {
        leaveButtonElement = (
            <button
                onClick={() => leaveGame()}>
                Leave Game
            </button>
        )
    }
    else {
        leaveButtonElement = (
            <button
                onClick={() => leaveGame()}>
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
