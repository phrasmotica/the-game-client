/**
 * Represents the possible levels of messages.
 */
export enum Level {
    Info = "info"
}

/**
 * Represents a message to be sent to a client.
 */
export class Message<T> {
    /**
     * Creates a new message.
     */
    constructor(
        public level: Level,
        public content: T
    ) { }

    /**
     * Returns a new info message.
     */
    static info<T>(content: T) {
        return new Message(Level.Info, content)
    }
}
