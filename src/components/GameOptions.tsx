import React from "react"

import { RoomWith } from "game-server-lib"
import { GameMode, RuleSet } from "the-game-lib"

import { ClientMode } from "../models/ClientMode"

interface GameOptionsProps {
    /**
     * The socket for server communication.
     */
    socket: SocketIOClient.Socket

    /**
     * The client mode.
     */
    clientMode: ClientMode

    /**
     * The room name.
     */
    roomName: string

    /**
     * The rule set.
     */
    ruleSet: RuleSet
}

/**
 * Renders the game options.
 */
export function GameOptions(props: GameOptionsProps) {
    /**
     * Resets the options to those of a default game.
     */
    const resetOptions = () => {
        setRuleSet(RuleSet.default())
    }

    /**
     * Sets the given rule set for the game.
     */
    const setRuleSet = (ruleSet: RuleSet) => {
        let body = new RoomWith(props.roomName, ruleSet)
        props.socket.emit("setRuleSet", body)
    }

    /**
     * Sets the rule set to the given game mode.
     */
    const setGameMode = (gameMode: GameMode) => {
        let newRuleSet = props.ruleSet
        newRuleSet.gameMode = gameMode
        setRuleSet(newRuleSet)
    }

    /**
     * Sets the given number of pairs of piles in the rule set.
     */
    const setPairsOfPiles = (pairsOfPiles: number) => {
        let newRuleSet = props.ruleSet
        newRuleSet.pairsOfPiles = pairsOfPiles
        setRuleSet(newRuleSet)
    }

    /**
     * Sets the given jump back size in the rule set.
     */
    const setJumpBackSize = (jumpBackSize: number) => {
        let newRuleSet = props.ruleSet
        newRuleSet.jumpBackSize = jumpBackSize
        setRuleSet(newRuleSet)
    }

    /**
     * Sets the given top limit in the rule set.
     */
    const setTopLimit = (topLimit: number) => {
        let newRuleSet = props.ruleSet
        newRuleSet.topLimit = topLimit
        setRuleSet(newRuleSet)
    }

    /**
     * Sets the given hand size in the rule set.
     */
    const setHandSize = (handSize: number) => {
        let newRuleSet = props.ruleSet
        newRuleSet.handSize = handSize
        setRuleSet(newRuleSet)
    }

    /**
     * Sets the given cards per turn in the rule set.
     */
    const setCardsPerTurn = (cardsPerTurn: number) => {
        let newRuleSet = props.ruleSet
        newRuleSet.cardsPerTurn = cardsPerTurn
        setRuleSet(newRuleSet)
    }

    /**
     * Sets the given cards per turn in endgame in the rule set.
     */
    const setCardsPerTurnInEndgame = (cardsPerTurnInEndgame: number) => {
        let newRuleSet = props.ruleSet
        newRuleSet.cardsPerTurnInEndgame = cardsPerTurnInEndgame
        setRuleSet(newRuleSet)
    }

    /**
     * Sets the given mulligan limit in the rule set.
     */
    const setCanViewPileHistory = (canViewPileHistory: boolean) => {
        let newRuleSet = props.ruleSet
        newRuleSet.canViewPileHistory = canViewPileHistory
        setRuleSet(newRuleSet)
    }

    /**
     * Sets the given mulligan limit in the rule set.
     */
    const setMulliganLimit = (mulliganLimit: number) => {
        let newRuleSet = props.ruleSet
        newRuleSet.mulliganLimit = mulliganLimit
        setRuleSet(newRuleSet)
    }

    let gameModeOptions = []
    for (let mode of Object.values(GameMode)) {
        gameModeOptions.push(
            <option key={mode} value={mode}>{mode}</option>
        )
    }

    let isSpectatorMode = props.clientMode === ClientMode.Spectator

    let options = (
        <div className="flex-center">
            <div className="align-centre margin-right">
                <div className="margin-bottom-small">
                    <label className="option-label">
                        Can view pile history
                        <input
                            className="ruleset-input"
                            type="checkbox"
                            disabled={isSpectatorMode}
                            onChange={e => setCanViewPileHistory(e.target.checked)}
                            checked={props.ruleSet.canViewPileHistory} />
                    </label>
                </div>

                <div className="margin-bottom-small">
                    <label className="option-label">
                        Mulligan limit
                        <input
                            className="ruleset-input"
                            type="number"
                            disabled={isSpectatorMode}
                            min={0}
                            max={10}
                            onChange={e => setMulliganLimit(Number(e.target.value))}
                            value={props.ruleSet.mulliganLimit} />
                    </label>
                </div>

                <div>
                    <label className="option-label-above" htmlFor="gameModeSelect">
                        Game mode
                    </label>

                    <select
                        id="gameModeSelect"
                        className="ruleset-select"
                        disabled={isSpectatorMode}
                        onChange={e => setGameMode(e.target.value as GameMode)}
                        value={props.ruleSet.gameMode}>
                        {gameModeOptions}
                    </select>
                </div>
            </div>

            <div className="align-right margin-right">
                <div>
                    <label className="option-label">
                        Pairs of piles
                        <input
                            className="ruleset-input"
                            type="number"
                            disabled={isSpectatorMode}
                            min={1}
                            max={2}
                            onChange={e => setPairsOfPiles(Number(e.target.value))}
                            value={props.ruleSet.pairsOfPiles} />
                    </label>
                </div>

                <div>
                    <label className="option-label">
                        Jump back size
                        <input
                            className="ruleset-input"
                            type="number"
                            disabled={isSpectatorMode}
                            min={2}
                            max={20}
                            onChange={e => setJumpBackSize(Number(e.target.value))}
                            value={props.ruleSet.jumpBackSize} />
                    </label>
                </div>

                <div>
                    <label className="option-label">
                        Top limit
                        <input
                            className="ruleset-input"
                            type="number"
                            disabled={isSpectatorMode}
                            min={10}
                            max={200}
                            step={10}
                            onChange={e => setTopLimit(Number(e.target.value))}
                            value={props.ruleSet.topLimit} />
                    </label>
                </div>
            </div>

            <div className="align-right">
                <div>
                    <label className="option-label">
                        Hand size
                        <input
                            className="ruleset-input"
                            type="number"
                            disabled={isSpectatorMode}
                            min={5}
                            max={8}
                            onChange={e => setHandSize(Number(e.target.value))}
                            value={props.ruleSet.handSize} />
                    </label>
                </div>

                <div>
                    <label className="option-label">
                        Cards per turn
                        <input
                            className="ruleset-input"
                            type="number"
                            disabled={isSpectatorMode}
                            min={1}
                            max={4}
                            onChange={e => setCardsPerTurn(Number(e.target.value))}
                            value={props.ruleSet.cardsPerTurn} />
                    </label>
                </div>

                <div>
                    <label className="option-label">
                        Cards per turn in endgame
                        <input
                            className="ruleset-input"
                            type="number"
                            disabled={isSpectatorMode}
                            min={1}
                            max={4}
                            onChange={e => setCardsPerTurnInEndgame(Number(e.target.value))}
                            value={props.ruleSet.cardsPerTurnInEndgame} />
                    </label>
                </div>
            </div>
        </div>
    )

    let lowerButtons = (
        <div className="flex-center">
            <button
                className="option-button"
                disabled={isSpectatorMode}
                onClick={() => resetOptions()}>
                Reset
            </button>
        </div>
    )

    return (
        <div className="margin-bottom">
            <div className="margin-bottom">
                {options}
            </div>

            <div>
                {lowerButtons}
            </div>
        </div>
    )
}
