import React, { Component } from "react"

interface GameOptionsProps {
    newGame: () => void
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
        return (
            <div className="game-options">
                <button
                    onClick={() => this.props.newGame()}>
                    New Game
                </button>
            </div>
        )
    }
}