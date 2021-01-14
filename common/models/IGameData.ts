/**
 * Represents data about a game.
 */
export interface IGameData {
    /**
     * The players.
     */
    players: string[]

    /**
     * The starting player.
     */
    startingPlayer: string | undefined

    /**
     * Starts the game with the given players.
     */
    start(players: string[]): void

    /**
     * Returns whether this room's game is in progress.
     */
    isInProgress(): boolean

    /**
     * Removes the given player from the game.
     */
    removePlayer(playerName: string): void

    /**
     * Clears data from a lingering game.
     */
    clear(): boolean
}
