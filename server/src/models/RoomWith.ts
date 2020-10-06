/**
 * Represents a request for data to be set in a given room.
 */
export class RoomWith<T> {
    /**
     * The level of the message.
     */
    roomName: string

    /**
     * The message content.
     */
    data: T

    /**
     * Creates a new RoomWith request.
     */
    constructor(
        roomName: string,
        data: T
    ) {
        this.roomName = roomName
        this.data = data
    }
}
