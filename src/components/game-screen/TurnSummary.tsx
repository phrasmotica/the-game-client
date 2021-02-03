import React from "react"

import { GameData } from "the-game-lib"

interface TurnSummaryProps {
    /**
     * The game data.
     */
    gameData: GameData
}

/**
 * Renders a summary of the current turn.
 */
export function TurnSummary(props: TurnSummaryProps) {
    let gameData = props.gameData

    /**
     * Returns the number of cards that must be played this turn.
     */
    const getCardsToPlay = (gameData: GameData) => {
        if (gameData.deck.isEmpty()) {
            return gameData.ruleSet.cardsPerTurnInEndgame
        }

        return gameData.ruleSet.cardsPerTurn
    }

    /**
     * Returns the remaining number of cards that must be played this turn.
     */
    const getCardsLeftToPlayThisTurn = (gameData: GameData) => {
        return Math.max(getCardsToPlay(gameData) - gameData.cardsPlayedThisTurn, 0)
    }

    /**
     * Returns the remaining number of mulligans.
     */
    const getMulligans = (gameData: GameData) => {
        return gameData.ruleSet.mulliganLimit - gameData.cardsMulliganed
    }

    const renderInfo = (text: string, value?: number | string) => {
        let valueElement = null
        if (value !== undefined) {
            valueElement = (
                <div>
                    <span>{value}</span>
                </div>
            )
        }

        return (
            <div className="info-container">
                <div>
                    <span>{text}</span>
                </div>

                {valueElement}
            </div>
        )
    }

    return (
        <div>
            <div className="margin-bottom-small">
                {renderInfo("Cards left in deck", gameData.deck.size())}
            </div>

            <div className="margin-bottom-small">
                {renderInfo("Cards left to play this turn", getCardsLeftToPlayThisTurn(gameData))}
            </div>

            <div>
                {renderInfo("Mulligans remaining", getMulligans(gameData))}
            </div>
        </div>
    )
}
