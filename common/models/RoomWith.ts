/**
 * Represents a request for data to be set in a given room.
 */
export class RoomWith<T> {
    /**
     * Creates a new RoomWith request.
     */
    constructor(
        public roomName: string,
        public data: T
    ) { }
}
