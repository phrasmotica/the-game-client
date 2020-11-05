import React, { useCallback, useEffect, useState } from "react"

import { Message } from "../models/Message"
import { RoomData } from "../models/RoomData"
import { RoomWith } from "../models/RoomWith"

interface GameBrowserProps {
    /**
     * The socket for server communication.
     */
    socket: SocketIOClient.Socket

    /**
     * The player name.
     */
    playerName: string

    /**
     * Leaves the server.
     */
    leaveServer: () => void
}

/**
 * Renders the game browser.
 */
export function GameBrowser(props: GameBrowserProps) {
    const [createRoomName, setCreateRoomName] = useState("")
    const [allRoomData, setAllRoomData] = useState<RoomData[]>([])

    props.socket.on("allLobbyData", (newAllRoomData: RoomData[]) => {
        setAllRoomData(newAllRoomData.map(RoomData.from))
    })

    props.socket.on("lobbyData", (message: Message<RoomData>) => {
        let newAllRoomData = [...allRoomData]

        let roomData = RoomData.from(message.content)
        let index = newAllRoomData.findIndex(r => r.name === roomData.name)
        if (index >= 0) {
            newAllRoomData[index] = roomData
        }
        else {
            newAllRoomData.push(roomData)
        }

        setAllRoomData(newAllRoomData)
    })

    props.socket.on("removeLobbyData", (roomName: string) => {
        let newAllRoomData = [...allRoomData]

        let index = newAllRoomData.findIndex(r => r.name === roomName)
        if (index >= 0) {
            newAllRoomData.splice(index, 1)
            setAllRoomData(newAllRoomData)
        }
    })

    /**
     * Creates a room with the given name.
     */
    const createRoom = (roomName: string) => {
        props.socket.emit("createRoom", roomName)
    }

    /**
     * Joins the given room with the given player name.
     */
    const joinRoom = (roomName: string, playerName: string) => {
        props.socket.emit("joinRoom", new RoomWith(roomName, playerName))
    }

    /**
     * Joins the given room with the given player name as a spectator.
     */
    const spectateRoom = (roomName: string, playerName: string) => {
        props.socket.emit("spectateRoom", new RoomWith(roomName, playerName))
    }

    /**
     * Refreshes the room list.
     */
    const refreshRoomList = useCallback(() => {
        props.socket.emit("allLobbyData", props.playerName)
    }, [props.playerName, props.socket])

    // effect for refreshing the room list after first render
    useEffect(() => {
        refreshRoomList()
        return () => setAllRoomData([])
    }, [refreshRoomList])

    let canCreateRoom = createRoomName.length > 0

    return (
        <div className="game-menu">
            <div className="flex-center margin-bottom">
                Welcome to the server!
            </div>

            <div className="flex-center margin-bottom">
                <div className="margin-right">
                    <button
                        disabled={!canCreateRoom}
                        onClick={() => createRoom(createRoomName)}>
                        Create Game
                    </button>
                </div>

                <div>
                    <button
                        onClick={() => props.leaveServer()}>
                        Leave Server
                    </button>
                </div>
            </div>

            <div className="flex-center margin-bottom">
                <input
                    type="text"
                    className="name-field"
                    placeholder="new room name here"
                    onChange={e => setCreateRoomName(e.target.value)} />
            </div>

            <div className="flex-center margin-bottom">
                <div className="margin-right">
                    <span>
                        Games List
                    </span>
                </div>

                <div className="flex">
                    <button
                        onClick={refreshRoomList}>
                        Refresh
                    </button>
                </div>
            </div>

            <div>
                {allRoomData.map(room => {
                    let inProgress = room.gameData.isInProgress()

                    let inProgressElement = null
                    if (inProgress) {
                        inProgressElement = (
                            <div className="in-progress-message">
                                <span>
                                    This game is in progress.
                                </span>
                            </div>
                        )
                    }

                    return (
                        <div key={room.name}>
                            <div className="flex-center margin-bottom">
                                <div className="margin-right">
                                    <span>{room.name}</span>
                                </div>

                                <div className="flex margin-right">
                                    <button
                                        disabled={inProgress}
                                        onClick={() => joinRoom(room.name, props.playerName)}>
                                        Join
                                    </button>
                                </div>

                                <div className="flex">
                                    <button
                                        disabled={inProgress}
                                        onClick={() => spectateRoom(room.name, props.playerName)}>
                                        Spectate
                                    </button>
                                </div>
                            </div>

                            {inProgressElement}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
