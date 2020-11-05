import React, { Component } from "react"
import { RoomWith } from "../models/RoomWith"

import { GameMode, RuleSet } from "../models/RuleSet"

interface GameOptionsProps {
    /**
     * The socket for server communication.
     */
    socket: SocketIOClient.Socket

    /**
     * The room name.
     */
    roomName: string

    /**
     * The rule set.
     */
    ruleSet: RuleSet
}

interface GameOptionsState {

}

/**
 * Renders the game options.
 */
export class GameOptions extends Component<GameOptionsProps, GameOptionsState> {
    /**
     * Renders the game options.
     */
    render() {
        let options = this.renderOptions()

        return (
            <div className="margin-bottom">
                {options}
            </div>
        )
    }

    /**
     * Renders the options.
     */
    renderOptions() {
        let gameModeOptions = []
        for (let mode of Object.values(GameMode)) {
            gameModeOptions.push(
                <option key={mode} value={mode}>{mode}</option>
            )
        }

        return (
            <div className="flex-center">
                <div className="align-centre margin-right">
                    <div>
                        <button className="option-button"
                            onClick={() => this.resetOptions()}>
                            Reset
                        </button>
                    </div>

                    <div>
                        <label className="option-label-above" htmlFor="gameModeSelect">
                            Game mode
                        </label>

                        <select
                            id="gameModeSelect"
                            className="ruleset-select"
                            onChange={e => this.setGameMode(e.target.value as GameMode)}
                            value={this.props.ruleSet.gameMode}>
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
                                min={1}
                                max={2}
                                onChange={e => this.setPairsOfPiles(Number(e.target.value))}
                                value={this.props.ruleSet.pairsOfPiles} />
                        </label>
                    </div>

                    <div>
                        <label className="option-label">
                            Jump back size
                            <input
                                className="ruleset-input"
                                type="number"
                                min={2}
                                max={20}
                                onChange={e => this.setJumpBackSize(Number(e.target.value))}
                                value={this.props.ruleSet.jumpBackSize} />
                        </label>
                    </div>

                    <div>
                        <label className="option-label">
                            Top limit
                            <input
                                className="ruleset-input"
                                type="number"
                                min={10}
                                max={200}
                                step={10}
                                onChange={e => this.setTopLimit(Number(e.target.value))}
                                value={this.props.ruleSet.topLimit} />
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
                                min={5}
                                max={8}
                                onChange={e => this.setHandSize(Number(e.target.value))}
                                value={this.props.ruleSet.handSize} />
                        </label>
                    </div>

                    <div>
                        <label className="option-label">
                            Cards per turn
                            <input
                                className="ruleset-input"
                                type="number"
                                min={1}
                                max={4}
                                onChange={e => this.setCardsPerTurn(Number(e.target.value))}
                                value={this.props.ruleSet.cardsPerTurn} />
                        </label>
                    </div>

                    <div>
                        <label className="option-label">
                            Cards per turn in endgame
                            <input
                                className="ruleset-input"
                                type="number"
                                min={1}
                                max={4}
                                onChange={e => this.setCardsPerTurnInEndgame(Number(e.target.value))}
                                value={this.props.ruleSet.cardsPerTurnInEndgame} />
                        </label>
                    </div>
                </div>
            </div>
        )
    }

    /**
     * Resets the options to those of a default game.
     */
    resetOptions() {
        this.updateInputs(RuleSet.default())
    }

    /**
     * Resets the options to those of the given ruleset.
     */
    updateInputs(ruleSet: RuleSet) {
        this.setState({
            pairsOfPiles: ruleSet.pairsOfPiles,
            jumpBackSize: ruleSet.jumpBackSize,
            topLimit: ruleSet.topLimit,
            handSize: ruleSet.handSize,
            gameMode: ruleSet.gameMode,
            cardsPerTurn: ruleSet.cardsPerTurn,
            cardsPerTurnInEndgame: ruleSet.cardsPerTurnInEndgame,
        })
    }

    /**
     * Sets the given rule set for the game.
     */
    setRuleSet(ruleSet: RuleSet) {
        let body = new RoomWith(this.props.roomName, ruleSet)
        this.props.socket.emit("setRuleSet", body)
    }

    /**
     * Sets the rule set to the given game mode.
     */
    setGameMode(gameMode: GameMode) {
        let newRuleSet = this.props.ruleSet
        newRuleSet.gameMode = gameMode
        this.setRuleSet(newRuleSet)
    }

    /**
     * Sets the given number of pairs of piles in the rule set.
     */
    setPairsOfPiles(pairsOfPiles: number) {
        let newRuleSet = this.props.ruleSet
        newRuleSet.pairsOfPiles = pairsOfPiles
        this.setRuleSet(newRuleSet)
    }

    /**
     * Sets the given jump back size in the rule set.
     */
    setJumpBackSize(jumpBackSize: number) {
        let newRuleSet = this.props.ruleSet
        newRuleSet.jumpBackSize = jumpBackSize
        this.setRuleSet(newRuleSet)
    }

    /**
     * Sets the given top limit in the rule set.
     */
    setTopLimit(topLimit: number) {
        let newRuleSet = this.props.ruleSet
        newRuleSet.topLimit = topLimit
        this.setRuleSet(newRuleSet)
    }

    /**
     * Sets the given hand size in the rule set.
     */
    setHandSize(handSize: number) {
        let newRuleSet = this.props.ruleSet
        newRuleSet.handSize = handSize
        this.setRuleSet(newRuleSet)
    }

    /**
     * Sets the given cards per turn in the rule set.
     */
    setCardsPerTurn(cardsPerTurn: number) {
        let newRuleSet = this.props.ruleSet
        newRuleSet.cardsPerTurn = cardsPerTurn
        this.setRuleSet(newRuleSet)
    }

    /**
     * Sets the given cards per turn in endgame in the rule set.
     */
    setCardsPerTurnInEndgame(cardsPerTurnInEndgame: number) {
        let newRuleSet = this.props.ruleSet
        newRuleSet.cardsPerTurnInEndgame = cardsPerTurnInEndgame
        this.setRuleSet(newRuleSet)
    }
}
