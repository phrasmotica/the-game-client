import React, { useState } from "react"
import { FaArrowRight } from "react-icons/fa"
import { Button, Checkbox } from "semantic-ui-react"

import { PlayerData, RoomData, RoomWith } from "game-server-lib"
import { Card, GameData } from "the-game-lib"

import { CardView } from "./CardView"
import { HandView } from "./HandView"
import { PileView } from "./PileView"
import { RuleSummary } from "./RuleSummary"
import { StartingPlayerSelector } from "./StartingPlayerSelector"
import { TurnSummary } from "./TurnSummary"

import { ClientMode } from "../../models/ClientMode"
import { PlayerHandView } from "../players/PlayerHandView"

import "./GameBoard.css"

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

export const GameBoard = (props: GameBoardProps) => {
    const [pileHistoryIndex, setPileHistoryIndex] = useState<number | undefined>()
    const [showPlayerOptions, setShowPlayerOptions] = useState(false)
    const [showRuleSummary, setShowRuleSummary] = useState(false)
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
        let newCardToPlay = card
        if (card?.value === gameData.cardToPlay?.value) {
            newCardToPlay = undefined
        }

        props.socket.emit("setCardToPlay", new RoomWith(props.roomData.name, newCardToPlay))
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
     * Takes a mulligan on the pile with the given index.
     */
    const mulligan = (pileIndex: number) => {
        let data: [number, string, boolean] = [pileIndex, props.playerName, autoSortHand]
        props.socket.emit("mulligan", new RoomWith(props.roomData.name, data))
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
    const endTurn = (passTurn: boolean) => {
        props.socket.emit("endTurn", new RoomWith(props.roomData.name, [passTurn, autoSortHand]))
    }

    /**
     * Returns whether the client is in player mode.
     */
    const isPlayerClient = () => props.clientMode === ClientMode.Player

    /**
     * Returns whether the client is in spectator mode.
     */
    const isSpectatorClient = () => props.clientMode === ClientMode.Spectator

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
                    turnCounter={gameData.turnCounter}
                    isMyTurn={isMyTurn}
                    isWithinMulliganLimit={gameData.canMulligan()}
                    isLost={isLost}
                    cardToPlay={gameData.cardToPlay}
                    showPileGaps={showPileGaps}
                    setCardToPlay={card => setCardToPlay(card)}
                    playCard={card => playCard(card, i)}
                    mulligan={pileIndex => mulligan(pileIndex)}
                    showingHistory={pileHistoryIndex === i}
                    setPileHistoryIndex={pileIndex => setPileHistoryIndex(pileIndex)} />
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
                    turnCounter={gameData.turnCounter}
                    isMyTurn={isMyTurn}
                    isWithinMulliganLimit={gameData.canMulligan()}
                    isLost={isLost}
                    cardToPlay={gameData.cardToPlay}
                    showPileGaps={showPileGaps}
                    setCardToPlay={card => setCardToPlay(card)}
                    playCard={card => playCard(card, index)}
                    mulligan={pileIndex => mulligan(pileIndex)}
                    showingHistory={pileHistoryIndex === index}
                    setPileHistoryIndex={pileIndex => setPileHistoryIndex(pileIndex)} />
            )
        }

        return piles
    }

    /**
     * Renders the pile history.
     */
    const renderPileHistory = (gameData: GameData) => {
        if (!gameData.ruleSet.canViewPileHistory) {
            return null
        }

        let cards: (Card | undefined)[] = [undefined]

        if (pileHistoryIndex !== undefined) {
            let pile = gameData.piles[pileHistoryIndex]

            if (pile.cards.length > 0) {
                cards = pile.cards.map(c => c[0])
            }
        }

        return (
            <div className="history-container">
                <div className="history-cards">
                    {cards.map((c, i) => {
                        let mainClassName = "history-card-container"
                        let className = ""
                        let arrow = null
                        if (i < cards.length - 1) {
                            mainClassName += " margin-right-small"
                            className = "margin-right-small"
                            arrow = (
                                <FaArrowRight />
                            )
                        }

                        return (
                            <div className={mainClassName}>
                                <div className={className}>
                                    <CardView
                                        ruleSet={gameData.ruleSet}
                                        card={c} />
                                </div>

                                {arrow}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    /**
     * Renders the rule summary.
     */
    const renderRuleSummary = (gameData: GameData) => {
        let summaryElement = null
        if (showRuleSummary) {
            summaryElement = (
                <div className="margin-top-small">
                    <RuleSummary
                        ruleSet={gameData.ruleSet} />
                </div>
            )
        }

        return (
            <div className="rule-summary-panel">
                <div>
                    <Button
                        className="sidebar-button no-margin"
                        onClick={() => setShowRuleSummary(!showRuleSummary)}>
                        {showRuleSummary ? "Hide" : "Show"} rule summary
                    </Button>
                </div>

                {summaryElement}
            </div>
        )
    }

    /**
     * Renders the turn summary.
     */
    const renderTurnSummary = (gameData: GameData) => {
        return (
            <div className="turn-summary-panel">
                <TurnSummary gameData={gameData} />
            </div>
        )
    }

    /**
     * Renders the player options.
     */
    const renderPlayerOptions = () => {
        if (isSpectatorClient()) {
            return null
        }

        let optionsElement = null
        if (showPlayerOptions) {
            optionsElement = (
                <div className="margin-top-small">
                    <div>
                        <span title="Show gap size when playing a card">
                            <Checkbox
                                className="player-option-checkbox"
                                label="Show pile gaps"
                                lab
                                onChange={(_, data) => setShowPileGaps(data.checked ?? false)} />
                        </span>
                    </div>

                    <div>
                        <span title="Sort hand automatically when drawing cards">
                            <Checkbox
                                className="player-option-checkbox"
                                label="Auto-sort hand"
                                onChange={(_, data) => setAutoSortHand(data.checked ?? false)} />
                        </span>
                    </div>
                </div>
            )
        }

        return (
            <div className="player-options-panel">
                <div>
                    <Button
                        className="sidebar-button no-margin"
                        onClick={() => setShowPlayerOptions(!showPlayerOptions)}>
                        {showPlayerOptions ? "Hide" : "Show"} options
                    </Button>
                </div>

                {optionsElement}
            </div>
        )
    }

    /**
     * Renders the players.
     */
    const renderPlayers = (gameData: GameData) => {
        return (
            <div className="players-panel">
                {gameData.players.map((p, i) => {
                    let className = ""
                    if (i > 0) {
                        className = "margin-top-small"
                    }

                    let isCurrent = gameData.isInProgress()
                                 && p === gameData.getCurrentPlayer()
                    let showCardValues = gameData.isWon() || gameData.isLost()

                    return (
                        <div className={className}>
                            <PlayerHandView
                                key={i}
                                playerData={{ name: p } as PlayerData}
                                playerName={props.playerName}
                                isCurrent={isCurrent}
                                hand={gameData.getHand(p)!}
                                ruleSet={gameData.ruleSet}
                                showCardValues={showCardValues} />
                        </div>
                    )
                })}
            </div>
        )
    }

    /**
     * Renders the starting player vote.
     */
    const renderStartingPlayerVote = (gameData: GameData) => {
        if (gameData.isInProgress()) {
            return null
        }

        let playersData = gameData.players.map(p => ({ name: p } as PlayerData))
        if (playersData.length <= 0) {
            return null
        }

        let content = null
        if (isSpectatorClient()) {
            content = (
                <span>
                    Starting player vote in progress...
                </span>
            )
        }

        if (isPlayerClient()) {
            content = (
                <StartingPlayerSelector
                    socket={props.socket}
                    roomName={props.roomData.name}
                    playersData={playersData}
                    playerName={props.playerName}
                    hasVoted={gameData.startingPlayerVote.hasVoted(props.playerName)} />
            )
        }

        return (
            <div className="starting-player-selector-panel">
                {content}
            </div>
        )
    }

    /**
     * Renders the hand.
     */
    const renderHandElement = (gameData: GameData) => {
        if (isSpectatorClient()) {
            return null
        }

        let isInProgress = gameData.isInProgress()
        let isLost = gameData.isLost()
        let isMyTurn = gameData.getCurrentPlayer() === props.playerName

        let disableButtons = !isInProgress || isLost || !isMyTurn

        return (
            <div className="flex-center margin-bottom">
                <HandView
                    ruleSet={gameData.ruleSet}
                    hand={getHand()}
                    disableButtons={disableButtons}
                    cardToPlay={gameData.cardToPlay}
                    setCardToPlay={card => setCardToPlay(card)} />
            </div>
        )
    }

    /**
     * Renders the action buttons.
     */
    const renderActionButtons = (gameData: GameData) => {
        if (isSpectatorClient()) {
            return null
        }

        let gameIsOver = gameData.isWon() || gameData.isLost()
        let isMyTurn = gameData.getCurrentPlayer() === props.playerName
        let noCardToPlay = gameData.cardToPlay === undefined

        return (
            <div className="flex-center margin-bottom">
                <Button
                    className="margin-right"
                    disabled={gameIsOver || !isMyTurn || noCardToPlay}
                    onClick={() => setCardToPlay(undefined)}>
                    Cancel
                </Button>

                <Button
                    className="margin-right"
                    disabled={gameIsOver || getHand()?.isEmpty()}
                    onClick={sortHand}>
                    Sort hand
                </Button>

                <Button
                    className="margin-right"
                    disabled={gameIsOver || !isMyTurn || !areEnoughCardsPlayed()}
                    onClick={() => endTurn(false)}>
                    End turn
                </Button>

                <Button
                    disabled={gameIsOver || !isMyTurn || !noCardsCanBePlayed()}
                    onClick={() => endTurn(true)}>
                    Pass
                </Button>
            </div>
        )
    }

    /**
     * Renders the end message.
     */
    const renderEndMessage = (gameData: GameData) => {
        console.log(gameData.isLost())

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
                <Button
                    negative
                    onClick={() => leaveGame()}>
                    Leave Game
                </Button>
            )
        }

        return (
            <Button
                negative
                onClick={() => leaveGame()}>
                Stop Spectating
            </Button>
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
    let playersData = gameData.players.map(p => ({ name: p } as PlayerData))

    return (
        <div className="game-board">
            <div className="main-board margin-right">
                <div className="margin-bottom">
                    <div className="piles-container margin-bottom">
                        {renderPiles(gameData)}
                    </div>

                    <div className="flex-center">
                        {renderPileHistory(gameData)}
                    </div>
                </div>

                {renderHandElement(gameData)}

                {renderActionButtons(gameData)}

                <div className="flex-center">
                    {renderLeaveButton()}
                </div>
            </div>

            <div className="sidebar">
                <div>
                    {renderPlayers(gameData)}
                </div>

                <div className="margin-top-small">
                    {renderStartingPlayerVote(gameData)}
                </div>

                <div className="margin-top-small">
                    {renderEndMessage(gameData)}
                </div>

                <div className="margin-top-small">
                    {renderTurnSummary(gameData)}
                </div>

                <div className="margin-top-small">
                    {renderPlayerOptions()}
                </div>

                <div className="margin-top-small">
                    {renderRuleSummary(gameData)}
                </div>
            </div>
        </div>
    )
}
