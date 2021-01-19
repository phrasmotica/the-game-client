import React, { useCallback, useEffect, useState } from "react"

import { Message } from "the-game-lib/dist/models/Message"
import { RoomData } from "the-game-lib/dist/models/RoomData"
import { RoomWith } from "the-game-lib/dist/models/RoomWith"

import { RoomCard } from "./RoomCard"

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
        <div className="game-menu">
            <div className="flex-center margin-bottom">
                Welcome to the server!
            </div>

            <div className="flex-center margin-bottom">
                <div className="margin-right">
                    <button
                        disabled={!canCreateRoom}
                        onClick={() => createRoom(createRoomName)}>
                        Create Room
                    </button>
                </div>

                <div>
                    <button
                        onClick={props.leaveServer}>
                        Leave Server
                    </button>
                </div>
            </div>

            <div className="flex-center margin-bottom">
                <input
                    type="text"
                    className="name-field"
                    placeholder="new room name here"
                    value={createRoomName}
                    onChange={e => setCreateRoomName(e.target.value)} />
            </div>

            <div className="flex-center margin-bottom">
                <div className="margin-right">
                    <span>
                        Room List
                    </span>
                </div>

                <div className="flex">
                    <button
                        onClick={refreshRoomList}>
                        Refresh
                    </button>
                </div>
            </div>

            <div className="flex-center">
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
    )
}
