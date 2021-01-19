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

    let className = "room-card"
    if (isInProgress) {
        className += "-in-progress"
    }

    return (
        <div
            className={className}
            key={room.name}>
            <div className="grid-equal-rows text-center-right margin-right">
                <div className="grid">
                    <span className="truncate room-name">
                        {room.name}
                    </span>
                </div>

                <div className="grid">
                    <span className="player-count">
                        {room.players.length} player(s)
                    </span>
                </div>

                <div className="grid">
                    <span className="in-progress-message">
                        {isInProgress ? "in game" : "in lobby"}
                    </span>
                </div>
            </div>

            <div className="grid-equal-columns grid-column-gap">
                <div className="grid">
                    <button
                        disabled={isInProgress}
                        onClick={() => props.joinRoom(room.name, props.playerName)}>
                        Join
                    </button>
                </div>

                <div className="grid">
                    <button
                        onClick={() => props.spectateRoom(room.name, props.playerName)}>
                        Spectate
                    </button>
                </div>
            </div>
        </div>
    )
}
