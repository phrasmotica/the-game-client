import React from "react"

import { GameData } from "the-game-lib"

interface PlayersViewProps {
    /**
     * The game data.
     */
    gameData: GameData

    /**
     * The current player.
     */
    player: string
}

/**
 * Renders info about the players in the given game.
 */
export function PlayersView(props: PlayersViewProps) {
    let gameData = props.gameData

    return (
        <div className="flex-center space-evenly">
            {gameData.players.map(p => {
                let isInProgress = gameData.isInProgress()
                let isCurrentPlayer = gameData.getCurrentPlayer() === p
                let isThisPlayer = props.player === p

                let showCardValues = isThisPlayer || gameData.isWon() || gameData.isLost()

                let nameElement = (
                    <span className="player-name">
                        {p}
                    </span>
                )

                let handElement = (
                    <div className="flex-center">
                        <span className="player-card-text">
                            (you)
                        </span>
                    </div>
                )

                if (!isThisPlayer) {
                    let baseClassName = "hidden-card"
                    if (isInProgress && isCurrentPlayer) {
                        baseClassName += "-current"
                    }

                    let hand = gameData.getHand(p)
                    handElement = (
                        <div className="flex-center">
                            {hand?.cards.map(c => (
                                <div className={`${baseClassName} player-card-text`}>
                                    {showCardValues ? c : "?"}
                                </div>
                            ))}
                        </div>
                    )
                }

                return (
                    <div className={"player-hand" + (isInProgress && isCurrentPlayer ? "-current" : "")}>
                        <div>
                            {nameElement}
                        </div>

                        <div>
                            {handElement}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
