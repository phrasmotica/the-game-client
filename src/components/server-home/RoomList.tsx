import React, { useState, useEffect, useCallback } from "react"
import { FaPlus, FaRedo } from "react-icons/fa"

import { Message, RoomData, RoomWith } from "game-server-lib"
import { GameData } from "the-game-lib"

import { RoomCard } from "./RoomCard"
import { createRoomData } from "../../util/Convert"

interface RoomListProps {
    /**
     * The socket for server communication.
     */
    socket: SocketIOClient.Socket

    /**
     * The player's name.
     */
    playerName: string
}

export function RoomList(props: RoomListProps) {
    const [createRoomName, setCreateRoomName] = useState("")
    const [allRoomData, setAllRoomData] = useState<RoomData<GameData>[]>([])

    props.socket.on("allRoomData", (newAllRoomData: RoomData<GameData>[]) => {
        setAllRoomData(newAllRoomData.map(createRoomData))
    })

    props.socket.on("roomData", (message: Message<RoomData<GameData>>) => {
        let newAllRoomData = [...allRoomData]

        let roomData = createRoomData(message.content)
        let index = newAllRoomData.findIndex(r => r.name === roomData.name)
        if (index >= 0) {
            newAllRoomData[index] = roomData
        }
        else {
            newAllRoomData.push(roomData)
        }

        setAllRoomData(newAllRoomData)
    })

    props.socket.on("removeRoomData", (roomName: string) => {
        let newAllRoomData = [...allRoomData]

        let index = newAllRoomData.findIndex(r => r.name === roomName)
        if (index >= 0) {
            newAllRoomData.splice(index, 1)
            setAllRoomData(newAllRoomData)
        }
    })

    props.socket.on("createRoomResult", (success: boolean) => {
        if (success) {
            setCreateRoomName("")
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
        props.socket.emit("allRoomData", props.playerName)
    }, [props.playerName, props.socket])

    // effect for refreshing the room list after first render
    useEffect(() => {
        refreshRoomList()
        return () => setAllRoomData([])
    }, [refreshRoomList])

    let canCreateRoom = createRoomName.length > 0

    return (
        <div>
            <div className="grid-equal-columns margin-bottom">
                <div className="grid margin-right-small">
                    <span className="text-align-left">
                        Rooms ({allRoomData.length})
                    </span>
                </div>

                <div className="grid">
                    <div className="flex">
                        <div className="margin-right-small">
                            <input
                                type="text"
                                className="name-field"
                                placeholder="new room name here"
                                value={createRoomName}
                                onChange={e => setCreateRoomName(e.target.value)} />
                        </div>

                        <div className="margin-right-small">
                            <button
                                disabled={!canCreateRoom}
                                onClick={() => createRoom(createRoomName)}>
                                <FaPlus />
                            </button>
                        </div>

                        <div>
                            <button
                                onClick={refreshRoomList}>
                                <FaRedo />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="room-list scroll-vert">
                <div>
                    {allRoomData.map((room, index) => {
                        let className = ""
                        if (index < allRoomData.length - 1) {
                            className += "margin-bottom-small"
                        }

                        return (
                            <div className={className}>
                                <RoomCard
                                    roomData={room}
                                    playerName={props.playerName}
                                    joinRoom={joinRoom}
                                    spectateRoom={spectateRoom} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}