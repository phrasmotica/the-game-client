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
     * The level of the message.
     */
    level: Level

    /**
     * The message content.
     */
    content: T

    /**
     * Creates a new message.
     */
    constructor(
        level: Level,
        content: T
    ) {
        this.level = level
        this.content = content
    }

    /**
     * Returns a new info message.
     */
    static info<T>(content: T) {
        return new Message(Level.Info, content)
    }
}
