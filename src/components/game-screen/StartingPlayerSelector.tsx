import React, { useState } from "react"

import { PlayerData, RoomWith } from "game-server-lib"
import { Button, Dropdown } from "semantic-ui-react"

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

    let options = props.playersData.map((p, i) => {
        let text = p.name
        if (p.name === props.playerName) {
            text += " (you)"
        }

        return {
            text: text,
            value: i,
        }
    })

    return (
        <div>
            <div className="margin-bottom-small">
                <span className="starting-player-selector-text">
                    Select starting player
                </span>
            </div>

            <div className="margin-bottom-small">
                <Dropdown
                    selection
                    disabled={props.hasVoted}
                    defaultValue={options[0].value}
                    options={options}
                    onChange={(_, data) => setSelectedPlayerIndex(Number(data.value))}>
                </Dropdown>
            </div>

            <div className="starting-player-selector-buttons-panel">
                <div>
                    <Button
                        positive
                        className="sidebar-button no-margin"
                        disabled={props.hasVoted}
                        onClick={addVoteForStartingPlayer}>
                        Confirm
                    </Button>
                </div>

                <div>
                    <Button
                        negative
                        className="sidebar-button no-margin"
                        disabled={!props.hasVoted}
                        onClick={removeVoteForStartingPlayer}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}
