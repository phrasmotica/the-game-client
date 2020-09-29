/**
 * Represents a request for a player to join a game.
 */
export class JoinGameRequest {
    /**
     * The room name.
     */
    roomName: string

    /**
     * The player name.
     */
    playerName: string

    /**
     * Constructor.
     */
    constructor(roomName: string, playerName: string) {
        this.roomName = roomName
        this.playerName = playerName
    }
}