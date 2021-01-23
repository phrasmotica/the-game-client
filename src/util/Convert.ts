import { RoomData } from "game-server-lib"
import { GameData } from "the-game-lib"

export const createRoomData = (roomData: RoomData<GameData>) => {
    return new RoomData(
        roomData.name,
        roomData.players,
        roomData.spectators,
        GameData.from(roomData.gameData),
    )
}
