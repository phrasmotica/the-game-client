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
     * The players in the room.
     */
    players: string[]

    /**
     * The spectators in the room.
     */
    spectators: string[]

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
        spectators: string[],
        gameData: GameData
    ) {
        this.name = name
        this.players = players
        this.spectators = spectators
        this.gameData = gameData
    }

    /**
     * Adds the given player to the room.
     */
    addPlayer(player: string) {
        if (!this.playerIsPresent(player)) {
            this.players.push(player)
        }
        else {
            console.warn(`Tried to add player ${player} to room ${this.name} but they were already in the room!`)
        }
    }

    /**
     * Removes the given player from the room.
     */
    removePlayer(player: string) {
        if (this.playerIsPresent(player)) {
            this.gameData.removePlayer(player)

            let index = this.players.indexOf(player)
            this.players.splice(index, 1)
        }
        else {
            console.warn(`Tried to remove player ${player} from room ${this.name} but they were not in the room!`)
        }
    }

    /**
     * Returns whether the given player is in this room.
     */
    playerIsPresent(player: string) {
        return this.players.includes(player)
    }

    /**
     * Starts a game in this room with the given rule set.
     */
    startGame() {
        console.log(`Starting game in room ${this.name} with ${this.players.length} player(s)`)
        this.gameData.start(this.players)
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
        return new RoomData(roomName, [], [], GameData.default())
    }

    /**
     * Returns a concrete room data object. Use when processing naive message from the server.
     */
    static from(roomData: RoomData) {
        return new RoomData(
            roomData.name,
            roomData.players,
            roomData.spectators,
            GameData.from(roomData.gameData)
        )
    }
}
