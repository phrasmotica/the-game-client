import { Deck } from "../models/Deck"
import { GameData } from "../models/GameData"
import { Hand } from "../models/Hand"
import { Direction, Pile } from "../models/Pile"
import { RoomData } from "../models/RoomData"
import { RuleSet } from "../models/RuleSet"

/**
 * Class for managing game data on the server.
 */
export class GameDataManager {
    /**
     * Game data indexed by room ID.
     */
    roomGameData: {
        [roomName: string] : GameData
    } = {}

    /**
     * Returns the game data for the given room.
     */
    getGameData(roomName: string) {
        return this.roomGameData[roomName]
    }

    /**
     * Returns whether the given room exists.
     */
    roomExists(roomName: string) {
        return this.getGameData(roomName) !== undefined
    }

    /**
     * If the given room doesn't have a game yet, create one.
     */
    ensureRoomExists(roomName: string) {
        if (!this.roomExists(roomName)) {
            console.log(`Creating game for new room ${roomName}`)
            this.createDefaultGame(roomName)
        }
    }

    /**
     * Creates a default game in the given room.
     */
    createDefaultGame(roomName: string) {
        this.roomGameData[roomName] = GameData.default()
    }

    /**
     * Creates a deck for the rule set.
     */
    createDeck(ruleSet: RuleSet) {
        return Deck.create(2, ruleSet.topLimit)
    }

    /**
     * Creates a hand for the rule set from the given deck.
     */
    createHand(ruleSet: RuleSet, deck: Deck) {
        return new Hand(deck.draw(ruleSet.handSize))
    }

    /**
     * Creates piles for the rule set.
     */
    createPiles(ruleSet: RuleSet) {
        let piles = []

        for (let i = 0; i < ruleSet.pairsOfPiles; i++) {
            let pile = new Pile(i, 1, Direction.Ascending)
            piles.push(pile)
        }

        for (let j = 0; j < ruleSet.pairsOfPiles; j++) {
            let index = ruleSet.pairsOfPiles + j
            let pile = new Pile(index, ruleSet.topLimit, Direction.Descending)
            piles.push(pile)
        }

        return piles
    }

    /**
     * Sets the game data for the given room.
     */
    setGameData(roomName: string, gameData: GameData) {
        this.roomGameData[roomName] = gameData
    }

    /**
     * Removes the given room.
     */
    removeRoom(roomName: string) {
        console.log(`Removing room ${roomName}`)
        this.roomGameData[roomName] = undefined
    }
}
