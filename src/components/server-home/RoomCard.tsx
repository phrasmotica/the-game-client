import React from "react"

import { RoomData } from "game-server-lib"
import { GameData } from "the-game-lib"
import { Button } from "semantic-ui-react"

interface RoomCardProps {
    /**
     * The room data.
     */
    roomData: RoomData<GameData>

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
                        {room.players.length} player(s), {room.spectators.length} spectator(s)
                    </span>
                </div>

                <div className="grid">
                    <span className="in-progress-message">
                        {isInProgress ? "in game" : "in lobby"}
                    </span>
                </div>
            </div>

            <div className="flex">
                <Button.Group>
                    <Button
                        primary
                        disabled={isInProgress}
                        onClick={() => props.joinRoom(room.name, props.playerName)}>
                        Join
                    </Button>

                    <Button.Or className="flex-or" />

                    <Button
                        secondary
                        onClick={() => props.spectateRoom(room.name, props.playerName)}>
                        Spectate
                    </Button>
                </Button.Group>
            </div>
        </div>
    )
}
