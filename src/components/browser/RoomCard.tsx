import React from "react"
import { RoomData } from "the-game-lib"

interface RoomCardProps {
    /**
     * The room data.
     */
    roomData: RoomData

    /**
     * The player's name.
     */
    playerName: string

    /**
     * Joins the given room.
     */
    joinRoom: (roomName: string, playerName: string) => void

    /**
     * Joins the given room as a spectator.
     */
    spectateRoom: (roomName: string, playerName: string) => void
}

export function RoomCard(props: RoomCardProps) {
    let room = props.roomData
    let isInProgress = room.isInProgress()

    return (
        <div
            className="flex"
            key={room.name}>
            <div className="grid-equal-rows margin-right">
                <div className="grid room-name">
                    <span>{room.name}</span>
                </div>

                <div className="grid player-count">
                    <span>{room.players.length} player(s)</span>
                </div>

                <div className="grid in-progress-message">
                    <span>
                        {isInProgress ? "in game" : "in lobby"}
                    </span>
                </div>
            </div>

            <div className="grid-equal-rows grid-row-gap">
                <div className="grid">
                    <button
                        disabled={isInProgress}
                        onClick={() => props.joinRoom(room.name, props.playerName)}>
                        Join
                    </button>
                </div>

                <div className="grid">
                    <button
                        disabled={isInProgress}
                        onClick={() => props.spectateRoom(room.name, props.playerName)}>
                        Spectate
                    </button>
                </div>
            </div>
        </div>
    )
}
