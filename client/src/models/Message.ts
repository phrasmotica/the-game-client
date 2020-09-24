/**
 * Represents the possible levels of messages.
 */
export enum Level {
    Info = "info"
}

/**
 * Represents a message received from the server.
 */
export interface Message<T> {
    /**
     * The level of the message.
     */
    level: Level

    /**
     * The message content.
     */
    content: T
}
