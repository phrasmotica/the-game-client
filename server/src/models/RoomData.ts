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
    players: string[]

    /**
     * The game data.
     */
    gameData: GameData

    /**
     * Constructor.
     */
    constructor(
        name: string,
        players: string[],
        gameData: GameData
    ) {
        this.name = name
        this.players = players
        this.gameData = gameData
    }

    /**
     * Returns an empty room data object.
     */
    static empty() {
        return RoomData.named("")
    }

    /**
     * Returns an room data object with the given name.
     */
    static named(roomName: string) {
        return new RoomData(roomName, [], GameData.default())
    }

    /**
     * Returns a concrete room data object. Use when processing naive message from the server.
     */
    static from(roomData: RoomData) {
        return new RoomData(
            roomData.name,
            roomData.players,
            GameData.from(roomData.gameData)
        )
    }
}
