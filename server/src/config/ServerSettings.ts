/**
 * Class for server settings.
 */
export class ServerSettings {
    /**
     * The default port to use.
     */
    private static readonly DEFAULT_PORT = 4001

    /**
     * The port to use.
     */
    port: number

    /**
     * The default maximum number of rooms allowed.
     */
    private static readonly DEFAULT_MAX_ROOMS = 3

    /**
     * The maximum number of rooms allowed.
     */
    maxRooms: number

    /**
     * The default maximum number of players allowed in a single room.
     */
    private static readonly DEFAULT_MAX_PLAYERS_PER_ROOM = 3

    /**
     * The maximum number of players allowed in a single room.
     */
    maxPlayersPerRoom: number

    /**
     * The default maximum number of spectators allowed in a single room.
     */
    private static readonly DEFAULT_MAX_SPECTATORS_PER_ROOM = 3

    /**
     * The maximum number of spectators allowed in a single room.
     */
    maxSpectatorsPerRoom: number

    /**
     * Constructor.
     */
    private constructor(
        port: number,
        maxRooms: number,
        maxPlayersPerRoom: number,
        maxSpectatorsPerRoom: number,
    ) {
        this.port = port
        this.maxRooms = maxRooms
        this.maxPlayersPerRoom = maxPlayersPerRoom
        this.maxSpectatorsPerRoom = maxSpectatorsPerRoom
    }

    /**
     * Returns a new instance of ServerSettings based on values in the environment.
     */
    static readFromEnv() {
        return new ServerSettings(
            Number(process.env.PORT || this.DEFAULT_PORT),
            Number(process.env.SERVER_MAX_ROOMS || this.DEFAULT_MAX_ROOMS),
            Number(process.env.SERVER_MAX_PLAYERS_PER_ROOM || this.DEFAULT_MAX_PLAYERS_PER_ROOM),
            Number(process.env.SERVER_MAX_SPECTATORS_PER_ROOM || this.DEFAULT_MAX_SPECTATORS_PER_ROOM),
        )
    }
}
