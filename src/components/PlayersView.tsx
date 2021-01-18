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
        <div>
            {gameData.players.map(p => {
                let isInProgress = gameData.isInProgress()
                let isCurrentPlayer = gameData.getCurrentPlayer() === p
                let isThisPlayer = props.player === p

                let showCardValues = isThisPlayer || gameData.isWon() || gameData.isLost()

                let nameText = p
                if (isThisPlayer) {
                    nameText += " (you)"
                }

                let nameElement = (
                    <div>
                        <span className="player-name">
                            {nameText}
                        </span>
                    </div>
                )

                let handElement = null
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
                        {nameElement}
                        {handElement}
                    </div>
                )
            })}
        </div>
    )
}
