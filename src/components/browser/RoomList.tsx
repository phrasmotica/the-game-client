import React, { useState, useEffect, useCallback } from "react"
import { FaPlus, FaRedo } from "react-icons/fa"
import { Message, RoomData, RoomWith } from "the-game-lib"

import { RoomCard } from "./RoomCard"

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
        props.socket.emit("allLobbyData", props.playerName)
    }, [props.playerName, props.socket])

    // effect for refreshing the room list after first render
    useEffect(() => {
        refreshRoomList()
        return () => setAllRoomData([])
    }, [refreshRoomList])

    let canCreateRoom = createRoomName.length > 0

    return (
        <div>
            <div className="flex-center margin-bottom">
                <div className="margin-right-small">
                    <input
                        type="text"
                        className="flex-center name-field"
                        placeholder="new room name here"
                        value={createRoomName}
                        onChange={e => setCreateRoomName(e.target.value)} />
                </div>

                <div>
                    <button
                        className="flex-center"
                        disabled={!canCreateRoom}
                        onClick={() => createRoom(createRoomName)}>
                        <FaPlus />
                    </button>
                </div>
            </div>

            <div className="flex-center margin-bottom">
                <div className="margin-right">
                    <span>
                        Rooms
                    </span>
                </div>

                <div>
                    <button
                        className="flex-center"
                        onClick={refreshRoomList}>
                        <FaRedo />
                    </button>
                </div>
            </div>

            <div className="flex-center">
                <div>
                    {allRoomData.map(room => (
                        <div className="margin-bottom">
                            <RoomCard
                                roomData={room}
                                playerName={props.playerName}
                                joinRoom={joinRoom}
                                spectateRoom={spectateRoom} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}