import { GameData } from "./GameData"

/**
 * Represents data about a room on the server.
 */
export class RoomData {
    /**
     * The name of the room.
     */
    name: string

    /**
     * The number of players in the room.
     */
    numberOfPlayers: number

    /**
     * The game data.
     */
    gameData: GameData

    /**
     * Constructor.
     */
    constructor(
        name: string,
        numberOfPlayers: number,
        gameData: GameData
    ) {
        this.name = name
        this.numberOfPlayers = numberOfPlayers
        this.gameData = gameData
    }

    /**
     * Returns a default room data object.
     */
    static default() {
        return new RoomData("", 0, GameData.default())
    }

    /**
     * Returns a concrete room data object. Use when processing naive message from the server.
     */
    static from(roomData: RoomData) {
        return new RoomData(
            roomData.name,
            roomData.numberOfPlayers,
            GameData.from(roomData.gameData)
        )
    }
}
