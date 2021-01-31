import React, { useState } from "react"

import { PlayerData, RoomWith } from "game-server-lib"

export interface StartingPlayerSelectorProps {
    /**
     * The socket for server communication.
     */
    socket: SocketIOClient.Socket

    /**
     * The room name.
     */
    roomName: string

    /**
     * The players to select from.
     */
    playersData: PlayerData[]

    /**
     * The player name.
     */
    playerName: string

    /**
     * Whether the player has voted for a starting player.
     */
    hasVoted: boolean
}

/**
 * Renders a list of players, one of whom can be selected as the starting player.
 */
export function StartingPlayerSelector(props: StartingPlayerSelectorProps) {
    const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0)

    /**
     * Adds the given player's starting player vote in the given room.
     */
    const addVoteForStartingPlayer = () => {
        let startingPlayer = props.playersData[selectedPlayerIndex].name
        let data: [string, string] = [props.playerName, startingPlayer]
        let req = new RoomWith(props.roomName, data)
        props.socket.emit("addVoteForStartingPlayer", req)
    }

    /**
     * Removes the given player's starting player vote in the given room.
     */
    const removeVoteForStartingPlayer = () => {
        let req = new RoomWith(props.roomName, props.playerName)
        props.socket.emit("removeVoteForStartingPlayer", req)
    }

    return (
        <div>
            <div className="flex-center margin-bottom">
                <div className="starting-player-selector-text margin-right">
                    <span>
                        Select which player will start:
                    </span>
                </div>

                <div>
                    <select
                        disabled={props.hasVoted}
                        onChange={e => setSelectedPlayerIndex(e.target.selectedIndex)}>
                        {props.playersData.map((p, i) => {
                            let text = p.name
                            if (p.name === props.playerName) {
                                text += " (you)"
                            }

                            return (
                                <option key={i}>{text}</option>
                            )
                        })}
                    </select>
                </div>
            </div>

            <div className="flex-center margin-bottom">
                <div className="margin-right">
                    <button
                        disabled={props.hasVoted}
                        onClick={addVoteForStartingPlayer}>
                        Confirm
                    </button>
                </div>

                <div>
                    <button
                        disabled={!props.hasVoted}
                        onClick={removeVoteForStartingPlayer}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
