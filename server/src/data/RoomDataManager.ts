import { GameData } from "../models/GameData"
import { RoomData } from "../models/RoomData"

/**
 * Class for managing room data on the server.
 */
export class RoomDataManager {
    /**
     * Room data indexed by room name.
     */
    roomGameData: {
        [roomName: string] : RoomData
    } = {}

    /**
     * Returns the data for the given room.
     */
    getRoomData(roomName: string) {
        return this.roomGameData[roomName]
    }

    /**
     * Returns whether the given room exists.
     */
    roomExists(roomName: string) {
        return this.roomGameData[roomName] !== undefined
    }

    /**
     * If the given room doesn't exist then create it.
     */
    ensureRoomExists(roomName: string) {
        if (!this.roomExists(roomName)) {
            console.log(`Creating game for new room ${roomName}`)
            this.initialise(roomName)
        }
    }

    /**
     * Creates a room with the given name.
     */
    initialise(roomName: string) {
        this.roomGameData[roomName] = RoomData.named(roomName)
    }

    /**
     * Adds the given player to the given room.
     */
    addToGame(playerName: string, roomName: string) {
        let roomData = this.getRoomData(roomName)
        roomData.players.push(playerName)
    }

    /**
     * Sets the game data for the given room.
     */
    setGameData(roomName: string, gameData: GameData) {
        if (this.roomExists(roomName)) {
            this.roomGameData[roomName].gameData = gameData
        }
        else {
            console.error(`Tried to set game data for non-existent room "${roomName}"!`)
        }
    }

    /**
     * Removes the given room.
     */
    removeRoom(roomName: string) {
        console.log(`Removing room ${roomName}`)
        this.roomGameData[roomName] = undefined
    }
}
