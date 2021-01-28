import React from "react"

import { RoomWith } from "game-server-lib"
import { GameMode, RuleSet } from "the-game-lib"

import { ClientMode } from "../../models/ClientMode"
import { Button, Input } from "semantic-ui-react"

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

    let isSpectatorMode = props.clientMode === ClientMode.Spectator

    let gameModeOption = (
        <div className="option-container margin-bottom-small">
            <div>
                <span className="option-label">
                    Game mode
                </span>
            </div>

            <div>
                <Button.Group>
                    <Button
                        disabled={isSpectatorMode}
                        primary={props.ruleSet.gameMode === GameMode.Regular}
                        onClick={() => setGameMode(GameMode.Regular)}>
                        Regular
                    </Button>

                    <Button.Or className="flex-or" />

                    <Button
                        disabled={isSpectatorMode}
                        color={props.ruleSet.gameMode === GameMode.OnFire ? "orange" : undefined}
                        onClick={() => setGameMode(GameMode.OnFire)}>
                        On Fire
                    </Button>
                </Button.Group>
            </div>
        </div>
    )

    let pairsOfPilesOption = (
        <div className="option-container margin-bottom-small">
            <div>
                <span className="option-label">
                    Pairs of piles
                </span>
            </div>

            <div>
                <Input
                    className="ruleset-input"
                    type="number"
                    disabled={isSpectatorMode}
                    min={1}
                    max={2}
                    onChange={e => setPairsOfPiles(Number(e.target.value))}
                    value={props.ruleSet.pairsOfPiles} />
            </div>
        </div>
    )

    let jumpBackSizeOption = (
        <div className="option-container margin-bottom-small">
            <div>
                <span className="option-label">
                    Jump back size
                </span>
            </div>

            <div>
                <Input
                    className="ruleset-input"
                    type="number"
                    disabled={isSpectatorMode}
                    min={2}
                    max={20}
                    onChange={e => setJumpBackSize(Number(e.target.value))}
                    value={props.ruleSet.jumpBackSize} />
            </div>
        </div>
    )

    let topLimitOption = (
        <div className="option-container margin-bottom-small">
            <div>
                <span className="option-label">
                    Top limit
                </span>
            </div>

            <div>
                <Input
                    className="ruleset-input"
                    type="number"
                    disabled={isSpectatorMode}
                    min={10}
                    max={200}
                    step={10}
                    onChange={e => setTopLimit(Number(e.target.value))}
                    value={props.ruleSet.topLimit} />
            </div>
        </div>
    )

    let handSizeOption = (
        <div className="option-container margin-bottom-small">
            <div>
                <span className="option-label">
                    Hand size
                </span>
            </div>

            <div>
                <Input
                    className="ruleset-input"
                    type="number"
                    disabled={isSpectatorMode}
                    min={5}
                    max={8}
                    onChange={e => setHandSize(Number(e.target.value))}
                    value={props.ruleSet.handSize} />
            </div>
        </div>
    )

    let cardsPerTurnOption = (
        <div className="option-container margin-bottom-small">
            <div>
                <span className="option-label">
                    Cards per turn
                </span>
            </div>

            <div>
                <Input
                    className="ruleset-input"
                    type="number"
                    disabled={isSpectatorMode}
                    min={1}
                    max={4}
                    onChange={e => setCardsPerTurn(Number(e.target.value))}
                    value={props.ruleSet.cardsPerTurn} />
            </div>
        </div>
    )

    let cardsPerTurnInEndgameOption = (
        <div className="option-container margin-bottom-small">
            <div>
                <span className="option-label">
                    Cards per turn in endgame
                </span>
            </div>

            <div>
                <Input
                    className="ruleset-input"
                    type="number"
                    disabled={isSpectatorMode}
                    min={1}
                    max={4}
                    onChange={e => setCardsPerTurnInEndgame(Number(e.target.value))}
                    value={props.ruleSet.cardsPerTurnInEndgame} />
            </div>
        </div>
    )

    let mulliganLimitOption = (
        <div className="option-container margin-bottom-small">
            <div>
                <span className="option-label">
                    Mulligan limit
                </span>
            </div>

            <div>
                <Input
                    className="ruleset-input"
                    type="number"
                    disabled={isSpectatorMode}
                    min={0}
                    max={10}
                    onChange={e => setMulliganLimit(Number(e.target.value))}
                    value={props.ruleSet.mulliganLimit} />
            </div>
        </div>
    )

    let canViewPileHistoryOption = (
        <div className="option-container">
            <div>
                <span className="option-label">
                    Can view pile history
                </span>
            </div>

            <div>
                <input
                    className="ruleset-input"
                    type="checkbox"
                    disabled={isSpectatorMode}
                    onChange={e => setCanViewPileHistory(e.target.checked)}
                    checked={props.ruleSet.canViewPileHistory} />
            </div>
        </div>
    )

    return (
        <div className="margin-bottom">
            <div className="flex space-between margin-bottom">
                <div className="rules-header">
                    <span>
                        Rules
                    </span>
                </div>

                <div>
                    <Button
                        color="yellow"
                        className="no-margin option-button"
                        disabled={isSpectatorMode}
                        onClick={() => resetOptions()}>
                        Reset
                    </Button>
                </div>
            </div>

            <div className="margin-bottom">
                {gameModeOption}
                {pairsOfPilesOption}
                {jumpBackSizeOption}
                {topLimitOption}
                {handSizeOption}
                {cardsPerTurnOption}
                {cardsPerTurnInEndgameOption}
                {mulliganLimitOption}
                {canViewPileHistoryOption}
            </div>
        </div>
    )
}
