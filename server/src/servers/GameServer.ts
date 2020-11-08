import http from "http"
import { Server } from "socket.io"

import { RoomDataManager } from "../data/RoomDataManager"
import { SocketManager } from "../data/SocketManager"

/**
 * Represents a server for a game with the given game data type and settings type.
 */
export abstract class GameServer<TGameData, TServerSettings> {
    /**
     * The server settings.
     */
    protected serverSettings: TServerSettings

    /**
     * The socket manager.
     */
    protected socketManager: SocketManager

    /**
     * The room data manager.
     */
    protected roomDataManager: RoomDataManager

    /**
     * The underlying socket IO server.
     */
    protected server: http.Server

    /**
     * The underlying socket IO server.
     */
    protected io: Server

    /**
     * Constructor.
     */
    protected constructor(
        serverSettings: TServerSettings,
        socketManager: SocketManager,
        roomDataManager: RoomDataManager
    ) {
        this.serverSettings = serverSettings
        this.socketManager = socketManager
        this.roomDataManager = roomDataManager

        this.server = this.createHttpServer()
        this.io = this.createSocketIOServer()
    }

    /**
     * Creates the HTTP server.
     */
    protected abstract createHttpServer(): http.Server

    /**
     * Creates the socket IO server.
     */
    protected abstract createSocketIOServer(): Server

    /**
     * Starts the server.
     */
    abstract start(): void
}
