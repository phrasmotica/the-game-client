import React from "react"

import { RoomData, RoomWith } from "game-server-lib"
import { GameData } from "the-game-lib"

import { GameOptions } from "./GameOptions"

import { ClientMode } from "../models/ClientMode"

interface GameLobbyProps {
    /**
     * The socket for server communication.
     */
    socket: SocketIOClient.Socket

    /**
     * The player name.
     */
    playerName: string

    /**
     * The client mode.
     */
    clientMode: ClientMode

    /**
     * The room data.
     */
    roomData: RoomData<GameData>
}

/**
 * Renders the game lobby.
 */
export function GameLobby(props: GameLobbyProps) {
    let isPlayer = props.roomData.players.includes(props.playerName)

    /**
     * Starts a game with the given rule set.
     */
    const startGame = (roomName: string) => {
        props.socket.emit("startGame", roomName)
    }

    /**
     * Leaves the room.
     */
    const leaveRoom = () => {
        props.socket.emit("leaveRoom", new RoomWith(props.roomData.name, props.playerName))
    }

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
                socket={props.socket}
                clientMode={props.clientMode}
                roomName={props.roomData.name}
                ruleSet={props.roomData.gameData.ruleSet} />

            <div className="flex-center">
                <div className="margin-right">
                    <button
                        className="option-button"
                        disabled={!isPlayer}
                        onClick={() => startGame(props.roomData.name)}>
                        Start Game
                    </button>
                </div>

                <div>
                    <button className="option-button"
                        onClick={leaveRoom}>
                        Leave Room
                    </button>
                </div>
            </div>
        </div>
    )
}
