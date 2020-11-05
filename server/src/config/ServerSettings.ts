/**
 * Class for server settings.
 */
export class ServerSettings {
    /**
     * The default maximum number of rooms allowed.
     */
    private static readonly DEFAULT_MAX_ROOMS = 3

    /**
     * The maximum number of rooms allowed.
     */
    maxRooms: number

    /**
     * Constructor.
     */
    private constructor(maxRooms: number) {
        this.maxRooms = maxRooms
    }

    /**
     * Returns a new instance of ServerSettings based on values in the environment.
     */
    static readFromEnv() {
        return new ServerSettings(
            Number(process.env.SERVER_MAX_ROOMS || this.DEFAULT_MAX_ROOMS)
        )
    }
}
