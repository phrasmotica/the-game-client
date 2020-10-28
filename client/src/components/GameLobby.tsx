import React from "react"

import { GameOptions } from "./GameOptions"

import { RoomData } from "../models/RoomData"
import { RuleSet } from "../models/RuleSet"

interface GameLobbyProps {
    /**
     * The player name.
     */
    playerName: string

    /**
     * The room data.
     */
    roomData: RoomData

    /**
     * Starts the game.
     */
    startGame: (roomName: string) => void

    /**
     * Sets the rule set.
     */
    setRuleSet: (ruleSet: RuleSet) => void

    /**
     * Leaves the room.
     */
    leaveRoom: () => void
}

/**
 * Renders the game browser.
 */
export function GameLobby(props: GameLobbyProps) {
    let isPlayer = props.roomData.players.includes(props.playerName)

    return (
        <div className="game-menu">
            <div className="flex-center margin-bottom">
                <div>
                    <div>
                        <span>
                            Room ID: {props.roomData.name ?? "-"}
                        </span>
                    </div>

                    <div>
                        <span>
                            Players: {props.roomData.players.join(", ")}
                        </span>
                    </div>

                    <div>
                        <span>
                            Spectators: {props.roomData.spectators.join(", ")}
                        </span>
                    </div>
                </div>
            </div>

            <GameOptions
                ruleSet={props.roomData.gameData.ruleSet}
                setRuleSet={props.setRuleSet} />

            <div className="flex-center">
                <div className="margin-right">
                    <button
                        className="option-button"
                        disabled={!isPlayer}
                        onClick={() => props.startGame(props.roomData.name)}>
                        Start Game
                    </button>
                </div>

                <div>
                    <button className="option-button"
                        onClick={props.leaveRoom}>
                        Leave Room
                    </button>
                </div>
            </div>
        </div>
    )
}
