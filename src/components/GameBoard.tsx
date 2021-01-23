import React, { useState } from "react"

import { RoomData, RoomWith } from "game-server-lib"
import { Card, GameData } from "the-game-lib"

import { HandSummaryView } from "./HandSummaryView"
import { HandView } from "./HandView"
import { PileView } from "./PileView"
import { PlayersView } from "./PlayersView"
import { RuleSummary } from "./RuleSummary"
import { StartingPlayerSelector } from "./StartingPlayerSelector"

import { ClientMode } from "../models/ClientMode"

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
    roomData: RoomData<GameData>

    /**
     * The client mode.
     */
    clientMode: ClientMode
}

export function GameBoard(props: GameBoardProps) {
    const [showPileGaps, setShowPileGaps] = useState(false)
    const [autoSortHand, setAutoSortHand] = useState(false)

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
     * Sets the card to play.
     */
    const setCardToPlay = (card: Card | undefined) => {
        props.socket.emit("setCardToPlay", new RoomWith(props.roomData.name, card))
    }

    /**
     * Plays the given card from the player's hand.
     */
    const playCard = (card: Card, pileIndex: number) => {
        let data: [string, Card, number] = [props.playerName, card, pileIndex]
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
     * Takes a mulligan on the pile with the given index.
     */
    const mulligan = (pileIndex: number) => {
        let data: [number, string, boolean] = [pileIndex, props.playerName, autoSortHand]
        props.socket.emit("mulligan", new RoomWith(props.roomData.name, data))
    }

    /**
     * Returns the remaining number of mulligans.
     */
    const getMulligans = () => {
        return gameData.ruleSet.mulliganLimit - gameData.cardsMulliganed
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
        props.socket.emit("endTurn", new RoomWith(props.roomData.name, autoSortHand))
    }

    /**
     * Returns whether the client is in player mode.
     */
    const isPlayerClient = () => props.clientMode === ClientMode.Player

    /**
     * Renders the deck info.
     */
    const renderDeckInfo = (gameData: GameData) => {
        let deckInfo = `Cards left in deck: ${gameData.deck.size()}`
        return (
            <div className="half-width">
                <span className="game-info-text">{deckInfo}</span>
            </div>
        )
    }

    /**
     * Renders the hand info.
     */
    const renderHandInfo = () => {
        let handInfo = `Cards left to play this turn: ${getCardsLeftToPlayThisTurn()}`

        return (
            <div className="half-width">
                <span className="game-info-text">{handInfo}</span>
            </div>
        )
    }

    /**
     * Renders the mulligan count.
     */
    const renderMulliganCount = () => {
        let mulliganInfo = `Mulligans: ${getMulligans()}`

        return (
            <div className="half-width">
                <span className="game-info-text">{mulliganInfo}</span>
            </div>
        )
    }

    /**
     * Renders the piles.
     */
    const renderPiles = (gameData: GameData) => {
        let piles = []
        let ruleSet = gameData.ruleSet

        let isMyTurn = gameData.getCurrentPlayer() === props.playerName
        let isLost = gameData.isLost()

        for (let i = 0; i < ruleSet.pairsOfPiles; i++) {
            piles.push(
                <PileView
                    key={i}
                    index={i}
                    pile={gameData.piles[i]}
                    playerName={props.playerName}
                    ruleSet={ruleSet}
                    turnsPlayed={gameData.turnsPlayed}
                    isMyTurn={isMyTurn}
                    isWithinMulliganLimit={gameData.canMulligan()}
                    isLost={isLost}
                    cardToPlay={gameData.cardToPlay}
                    showPileGaps={showPileGaps}
                    setCardToPlay={card => setCardToPlay(card)}
                    playCard={card => playCard(card, i)}
                    mulligan={pileIndex => mulligan(pileIndex)} />
            )
        }

        for (let j = 0; j < ruleSet.pairsOfPiles; j++) {
            let index = ruleSet.pairsOfPiles + j

            piles.push(
                <PileView
                    key={index}
                    index={index}
                    pile={gameData.piles[index]}
                    playerName={props.playerName}
                    ruleSet={ruleSet}
                    turnsPlayed={gameData.turnsPlayed}
                    isMyTurn={isMyTurn}
                    isWithinMulliganLimit={gameData.canMulligan()}
                    isLost={isLost}
                    cardToPlay={gameData.cardToPlay}
                    showPileGaps={showPileGaps}
                    setCardToPlay={card => setCardToPlay(card)}
                    playCard={card => playCard(card, index)}
                    mulligan={pileIndex => mulligan(pileIndex)} />
            )
        }

        return piles
    }

    /**
     * Renders the players view.
     */
    const renderPlayersView = (gameData: GameData) => (
        <PlayersView
            gameData={gameData}
            player={props.playerName} />
    )

    /**
     * Renders the rule summary.
     */
    const renderRuleSummary = (gameData: GameData) => (
        <RuleSummary
            ruleSet={gameData.ruleSet} />
    )

    /**
     * Renders the pile options.
     */
    const renderClientOptions = () => (
        <div>
            <div>
                <span title="Show gap size when playing a card">
                    <label className="checkbox-label-small">
                        Show pile gaps
                        <input
                            type="checkbox"
                            onChange={e => setShowPileGaps(e.target.checked)} />
                    </label>
                </span>
            </div>

            <div>
                <span title="Sort hand automatically when drawing cards">
                    <label className="checkbox-label-small">
                        Auto-sort hand
                        <input
                            type="checkbox"
                            onChange={e => setAutoSortHand(e.target.checked)} />
                    </label>
                </span>
            </div>
        </div>
    )

    /**
     * Renders the starting player vote.
     */
    const renderStartingPlayerVote = (gameData: GameData) => {
        if (gameData.players.length > 1) {
            if (isPlayerClient()) {
                return (
                    <StartingPlayerSelector
                        socket={props.socket}
                        roomName={props.roomData.name}
                        playerName={props.playerName}
                        players={gameData.players}
                        hasVoted={gameData.startingPlayerVote.hasVoted(props.playerName)} />
                )
            }

            return (
                <span>
                    Starting player vote in progress...
                </span>
            )
        }

        return null
    }

    /**
     * Renders the hand.
     */
    const renderHandElement = (gameData: GameData) => {
        let hand = getHand()

        if (isPlayerClient()) {
            let isInProgress = gameData.isInProgress()
            let isMyTurn = gameData.getCurrentPlayer() === props.playerName
            let isLost = gameData.isLost()
            let hasCardToPlay = gameData.cardToPlay !== undefined

            let disableButtons = !isInProgress || isLost || !isMyTurn || hasCardToPlay

            return (
                <HandView
                    ruleSet={gameData.ruleSet}
                    hand={hand}
                    disableButtons={disableButtons}
                    cardToPlay={gameData.cardToPlay}
                    setCardToPlay={card => setCardToPlay(card)} />
            )
        }

        let player = gameData.getCurrentPlayer()
        if (player !== undefined) {
            hand = gameData.getHand(player)
        }

        return (
            <HandSummaryView
                player={player}
                hand={hand} />
        )
    }

    /**
     * Renders the action buttons.
     */
    const renderActionButtons = (gameData: GameData) => {
        if (isPlayerClient()) {
            let gameIsOver = gameData.isWon() || gameData.isLost()
            let isMyTurn = gameData.getCurrentPlayer() === props.playerName
            let noCardToPlay = gameData.cardToPlay === undefined

            return (
                <div className="flex-center margin-bottom">
                    <button
                        className="margin-right"
                        disabled={gameIsOver || !isMyTurn || noCardToPlay}
                        onClick={() => setCardToPlay(undefined)}>
                        Cancel
                    </button>

                    <button
                        className="margin-right"
                        disabled={gameIsOver || getHand()?.isEmpty()}
                        onClick={sortHand}>
                        Sort hand
                    </button>

                    <button
                        className="margin-right"
                        disabled={gameIsOver || !isMyTurn || !areEnoughCardsPlayed()}
                        onClick={endTurn}>
                        End turn
                    </button>

                    <button
                        disabled={gameIsOver || !isMyTurn || !noCardsCanBePlayed()}
                        onClick={endTurn}>
                        Pass
                    </button>
                </div>
            )
        }

        return null
    }

    /**
     * Renders the end message.
     */
    const renderEndMessage = (gameData: GameData) => {
        if (gameData.isWon()) {
            if (isPlayerClient()) {
                return (
                    <div className="end-message">
                        <span>You won!</span>
                    </div>
                )
            }

            return (
                <div className="end-message">
                    <span>Game won!</span>
                </div>
            )
        }

        if (gameData.isLost()) {
            if (isPlayerClient()) {
                return (
                    <div className="end-message">
                        <span>You lost!</span>
                    </div>
                )
            }

            return (
                <div className="end-message">
                    <span>Game lost!</span>
                </div>
            )
        }

        return <div></div>
    }

    /**
     * Renders the leave button.
     */
    const renderLeaveButton = () => {
        if (isPlayerClient()) {
            return (
                <button
                    onClick={() => leaveGame()}>
                    Leave Game
                </button>
            )
        }

        return (
            <button
                onClick={() => leaveGame()}>
                Stop Spectating
            </button>
        )
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

    let gameData = props.roomData.gameData

    return (
        <div className="game-board">
            <div className="flex-center margin-bottom">
                {renderDeckInfo(gameData)}
                {renderHandInfo()}
                {renderMulliganCount()}
            </div>

            <div className="flex-center space-around">
                {renderPiles(gameData)}
            </div>

            <div className="grid-equal-columns">
                {renderPlayersView(gameData)}
                {renderStartingPlayerVote(gameData)}
                {renderEndMessage(gameData)}
            </div>

            <div className="flex-center space-around">
                {renderRuleSummary(gameData)}
                {renderClientOptions()}
            </div>

            <div className="flex-center">
                {renderHandElement(gameData)}
            </div>

            {renderActionButtons(gameData)}

            <div className="flex-center margin-bottom">
                {renderLeaveButton()}
            </div>
        </div>
    )
}
