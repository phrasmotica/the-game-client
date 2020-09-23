import React, { Component } from "react"
import { GameMode, IRuleSet, RuleSet, RuleSetBuilder } from "../gameData/RuleSet"

interface GameOptionsProps {
    /**
     * Starts a new game.
     */
    newGame: (ruleSet: RuleSet) => void
}

interface GameOptionsState extends IRuleSet {

}

/**
 * Renders the game options.
 */
export class GameOptions extends Component<GameOptionsProps, GameOptionsState> {
    constructor(props: GameOptionsProps) {
        super(props)

        let defaultRuleSet = RuleSet.default()
        this.state = {
            pairsOfPiles: defaultRuleSet.pairsOfPiles,
            jumpBackSize: defaultRuleSet.jumpBackSize,
            topLimit: defaultRuleSet.topLimit,
            handSize: defaultRuleSet.handSize,
            cardsPerTurn: defaultRuleSet.cardsPerTurn,
            cardsPerTurnInEndgame: defaultRuleSet.cardsPerTurnInEndgame,
            gameMode: defaultRuleSet.gameMode,
            onFireCards: defaultRuleSet.onFireCards,
        }
    }

    /**
     * Renders the game options.
     */
    render() {
        let gameModeOptions = []
        for (let mode of Object.values(GameMode)) {
            gameModeOptions.push(
                <option key={mode} value={mode}>{mode}</option>
            )
        }

        return (
            <div className="game-options">
                <div className="margin-right">
                    <button
                        onClick={() => this.newGame()}>
                        New Game
                    </button>
                </div>

                <div className="margin-right">
                    <label className="margin-right">
                        Game mode
                        <select
                            className="ruleset-select"
                            onChange={(e) => { this.setState({ gameMode: e.target.value as GameMode })}}
                            value={this.state.gameMode}>
                            {gameModeOptions}
                        </select>
                    </label>

                    <label className="margin-right">
                        Pairs of piles
                        <input
                            className="ruleset-input"
                            type="number"
                            min={1}
                            max={5}
                            onChange={(e) => { this.setState({ pairsOfPiles: Number(e.target.value) })}}
                            value={this.state.pairsOfPiles} />
                    </label>

                    <label className="margin-right">
                        Jump back size
                        <input
                            className="ruleset-input"
                            type="number"
                            min={2}
                            max={20}
                            onChange={(e) => { this.setState({ jumpBackSize: Number(e.target.value) })}}
                            value={this.state.jumpBackSize} />
                    </label>

                    <label className="margin-right">
                        Top limit
                        <input
                            className="ruleset-input"
                            type="number"
                            min={100}
                            max={500}
                            step={10}
                            onChange={(e) => { this.setState({ topLimit: Number(e.target.value) })}}
                            value={this.state.topLimit} />
                    </label>

                    <label className="margin-right">
                        Hand size
                        <input
                            className="ruleset-input"
                            type="number"
                            min={5}
                            max={10}
                            onChange={(e) => { this.setState({ handSize: Number(e.target.value) })}}
                            value={this.state.handSize} />
                    </label>

                    <label className="margin-right">
                        Cards per turn
                        <input
                            className="ruleset-input"
                            type="number"
                            min={1}
                            max={5}
                            onChange={(e) => { this.setState({ cardsPerTurn: Number(e.target.value) })}}
                            value={this.state.cardsPerTurn} />
                    </label>

                    <label className="margin-right">
                        Cards per turn in endgame
                        <input
                            className="ruleset-input"
                            type="number"
                            min={1}
                            max={5}
                            onChange={(e) => { this.setState({ cardsPerTurnInEndgame: Number(e.target.value) })}}
                            value={this.state.cardsPerTurnInEndgame} />
                    </label>
                </div>
            </div>
        )
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
}
