import React, { Component } from "react"

import { GameMode, IRuleSet, RuleSet, RuleSetBuilder } from "../gameData/RuleSet"

interface GameOptionsProps {
    /**
     * The rule set.
     */
    ruleSet: RuleSet

    /**
     * Starts a new game.
     */
    newGame: (ruleSet: RuleSet) => void
}

interface GameOptionsState extends IRuleSet {
    /**
     * Whether to show the options panel.
     */
    showOptions: boolean
}

/**
 * Renders the game options.
 */
export class GameOptions extends Component<GameOptionsProps, GameOptionsState> {
    constructor(props: GameOptionsProps) {
        super(props)

        let ruleSet = props.ruleSet
        this.state = {
            pairsOfPiles: ruleSet.pairsOfPiles,
            jumpBackSize: ruleSet.jumpBackSize,
            topLimit: ruleSet.topLimit,
            handSize: ruleSet.handSize,
            cardsPerTurn: ruleSet.cardsPerTurn,
            cardsPerTurnInEndgame: ruleSet.cardsPerTurnInEndgame,
            gameMode: ruleSet.gameMode,
            onFireCards: ruleSet.onFireCards,
            showOptions: false,
        }
    }

    /**
     * Re-render if the rule set changed.
     */
    componentDidUpdate(prevProps: GameOptionsProps) {
        if (this.props.ruleSet !== prevProps.ruleSet) {
            this.updateInputs(this.props.ruleSet)
        }
    }

    /**
     * Renders the game options.
     */
    render() {
        let showOptionsText = "Show Options"
        let options = null
        if (this.state.showOptions) {
            showOptionsText = "Hide Options"
            options = this.renderOptions()
        }

        return (
            <div className="margin-bottom">
                <div className="flex-center">
                    <div className="margin-right">
                        <button className="option-button"
                            onClick={() => this.newGame()}>
                            New Game
                        </button>
                    </div>

                    <div>
                        <button className="option-button show-options-button"
                            onClick={() => this.toggleShowOptions()}>
                            {showOptionsText}
                        </button>
                    </div>
                </div>

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
                            onChange={(e) => { this.setState({ gameMode: e.target.value as GameMode })}}
                            value={this.state.gameMode}>
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
                                onChange={(e) => { this.setState({ pairsOfPiles: Number(e.target.value) })}}
                                value={this.state.pairsOfPiles} />
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
                                onChange={(e) => { this.setState({ jumpBackSize: Number(e.target.value) })}}
                                value={this.state.jumpBackSize} />
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
                                onChange={(e) => { this.setState({ topLimit: Number(e.target.value) })}}
                                value={this.state.topLimit} />
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
                                onChange={(e) => { this.setState({ handSize: Number(e.target.value) })}}
                                value={this.state.handSize} />
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
                                onChange={(e) => { this.setState({ cardsPerTurn: Number(e.target.value) })}}
                                value={this.state.cardsPerTurn} />
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
                                onChange={(e) => { this.setState({ cardsPerTurnInEndgame: Number(e.target.value) })}}
                                value={this.state.cardsPerTurnInEndgame} />
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
     * Starts a new game with the specified rule set.
     */
    newGame() {
        let newRuleSet = new RuleSetBuilder()
            .withPairsOfPiles(this.state.pairsOfPiles)
            .withJumpBackSize(this.state.jumpBackSize)
            .withTopLimit(this.state.topLimit)
            .withHandSize(this.state.handSize)
            .withGameMode(this.state.gameMode)
            .withCardsPerTurn(this.state.cardsPerTurn)
            .withCardsPerTurnInEndgame(this.state.cardsPerTurnInEndgame)
            .build()

        this.props.newGame(newRuleSet)
    }

    /**
     * Toggles whether the options are shown.
     */
    toggleShowOptions() {
        this.setState(prevState => ({
            showOptions: !prevState.showOptions
        }))
    }
}
