/**
 * Class for managing sockets on the server.
 */
export class SocketManager {
    /**
     * Player names indexed by socket ID.
     */
    socketData: {
        [socketId: string] : string
    } = {}

    /**
     * Returns the player name for the given socket ID.
     */
    getPlayerName(socketId: string) {
        return this.socketData[socketId]
    }

    /**
     * Sets the player name for the given socket ID.
     */
    setPlayerName(socketId: string, playerName: string) {
        this.socketData[socketId] = playerName
    }

    /**
     * Removes the socket with the given ID.
     */
    removePlayerName(socketId: string) {
        delete this.socketData[socketId]
    }
}
