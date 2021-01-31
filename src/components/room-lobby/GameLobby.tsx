import React from "react"

import { PlayerData, RoomData, RoomWith } from "game-server-lib"
import { GameData } from "the-game-lib"

import { GameOptions } from "./GameOptions"

import { ClientMode } from "../../models/ClientMode"
import { Button } from "semantic-ui-react"
import { PlayerList } from "../players/PlayerList"

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

    let playersData = props.roomData.players.map(p => ({ name: p } as PlayerData))
    let spectatorsData = props.roomData.spectators.map(p => ({ name: p } as PlayerData))

    return (
        <div className="game-menu">
            <div className="flex-center margin-bottom">
                <span className="room-name-header">
                    Room ID: {props.roomData.name ?? "-"}
                </span>
            </div>

            <div className="flex">
                <div className="margin-right">
                    <div className="margin-bottom">
                        <div className="margin-bottom-small">
                            <span className="players-header">
                                Players ({playersData.length})
                            </span>
                        </div>

                        <PlayerList
                            playersData={playersData}
                            playerName={props.playerName}
                            namesOnly={true}
                            placeholderCount={5} />
                    </div>

                    <div>
                        <div className="margin-bottom-small">
                            <span className="players-header">
                                Spectators ({spectatorsData.length})
                            </span>
                        </div>

                        <PlayerList
                            playersData={spectatorsData}
                            playerName={props.playerName}
                            namesOnly={true}
                            placeholderCount={5} />
                    </div>
                </div>

                <div>
                    <GameOptions
                        socket={props.socket}
                        clientMode={props.clientMode}
                        roomName={props.roomData.name}
                        ruleSet={props.roomData.gameData.ruleSet} />
                </div>
            </div>

            <div className="flex-center">
                <div className="margin-right">
                    <Button
                        positive
                        className="no-margin option-button"
                        disabled={!isPlayer}
                        onClick={() => startGame(props.roomData.name)}>
                        Start Game
                    </Button>
                </div>

                <div>
                    <Button
                        negative
                        className="no-margin option-button"
                        onClick={leaveRoom}>
                        Leave Room
                    </Button>
                </div>
            </div>
        </div>
    )
}
