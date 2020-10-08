import { Hand } from "../models/Hand"
import { GameData, GameStartResult } from "../models/GameData"
import { RoomData } from "../models/RoomData"
import { RuleSet } from "../models/RuleSet"
import { VoteResult } from "../models/voting/Vote"

/**
 * Represents a map of room names to room data.
 */
type RoomDataMap = {
    [roomName: string] : RoomData
}

/**
 * Class for managing room data on the server.
 */
export class RoomDataManager {
    /**
     * Room data indexed by room name.
     */
    roomGameData: RoomDataMap = {}

    /**
     * Returns the data for the given room.
     */
    getRoomData(roomName: string) {
        return this.roomGameData[roomName]
    }

    /**
     * Returns the data for all rooms.
     */
    getAllRoomData() {
        return Object.values(this.roomGameData)
    }

    /**
     * Returns the players in the given room.
     */
    getPlayers(roomName: string) {
        return this.getRoomData(roomName)?.gameData.players ?? []
    }

    /**
     * Returns the starting player in the given room.
     */
    getStartingPlayer(roomName: string) {
        return this.getRoomData(roomName)?.gameData.startingPlayer
    }

    /**
     * Returns whether the given room exists.
     */
    roomExists(roomName: string) {
        return this.roomGameData[roomName] !== undefined
    }

    /**
     * If the given room doesn't exist then create it.
     */
    ensureRoomExists(roomName: string) {
        if (!this.roomExists(roomName)) {
            console.log(`Creating game for new room ${roomName}`)
            this.initialise(roomName)
        }
    }

    /**
     * Removes the given player from whichever rooms they're in. Returns the names of those rooms.
     */
    removePlayer(playerName: string) {
        let rooms = []

        for (let room of this.getAllRoomData()) {
            if (room.playerIsPresent(playerName)) {
                console.log(`Removed player ${playerName} from room ${room.name}`)

                room.removePlayer(playerName)
                rooms.push(room.name)
            }
        }

        return rooms
    }

    /**
     * Creates a room with the given name.
     */
    initialise(roomName: string) {
        this.roomGameData[roomName] = RoomData.named(roomName)
    }

    /**
     * Starts a new game in the given room.
     */
    startGame(roomName: string) {
        if (this.roomExists(roomName)) {
            console.log(`Starting new game in room ${roomName}`)

            this.getRoomData(roomName).startGame()
        }
    }

    /**
     * Adds the given player to the given room.
     */
    addPlayerToRoom(playerName: string, roomName: string) {
        // TODO: enforce player limit in each room
        let roomData = this.getRoomData(roomName)
        roomData.addPlayer(playerName)
    }

    /**
     * Adds the given player to the game.
     */
    addToGameData(playerName: string, gameData: GameData) {
        gameData.players.push(playerName)
    }

    /**
     * Deals a hand to the given player in the given room.
     */
    dealHand(playerName: string, roomName: string) {
        console.log(`Dealing hand to player ${playerName} in room ${roomName}`)

        let roomData = this.getRoomData(roomName)
        roomData.gameData.dealHand(playerName)
    }

    /**
     * Adds a starting player vote from the given player in the given room.
     */
    addStartingPlayerVote(roomName: string, playerName: string, startingPlayerName: string) {
        if (this.roomExists(roomName)) {
            let gameData = this.getRoomData(roomName).gameData
            return gameData.addStartingPlayerVote(playerName, startingPlayerName)
        }
        else {
            console.warn(`Tried to add starting player vote to non-existent room ${roomName}!`)
        }

        return VoteResult.NonExistent
    }

    /**
     * Removes a starting player vote from the given player in the given room.
     */
    removeStartingPlayerVote(roomName: string, playerName: string) {
        if (this.roomExists(roomName)) {
            let gameData = this.getRoomData(roomName).gameData
            return gameData.removeStartingPlayerVote(playerName)
        }
        else {
            console.warn(`Tried to remove starting player vote from non-existent room ${roomName}!`)
        }

        return VoteResult.NonExistent
    }

    /**
     * Returns whether the starting player vote is complete.
     */
    isStartingPlayerVoteComplete(roomName: string) {
        if (this.roomExists(roomName)) {
            let gameData = this.getRoomData(roomName).gameData
            return gameData.isStartingPlayerVoteComplete()
        }

        return false
    }

    /**
     * Closes the starting player vote and sets the starting player accordingly in the given room.
     */
    setStartingPlayer(roomName: string) {
        if (this.roomExists(roomName)) {
            let gameData = this.getRoomData(roomName).gameData
            return gameData.setStartingPlayer()
        }

        return GameStartResult.NonExistent
    }

    /**
     * Clears the game data in the given room.
     */
    clear(roomName: string) {
        if (this.roomExists(roomName)) {
            let gameData = this.getRoomData(roomName).gameData
            return gameData.clear()
        }

        return false
    }

    /**
     * Processes the game data for the given room.
     */
    processGameData(roomName: string) {
        if (this.roomExists(roomName)) {
            let gameData = this.getRoomData(roomName).gameData
            this.checkForWin(gameData)
            this.checkForLoss(gameData)
        }
        else {
            console.warn(`Tried to process game data for non-existent room ${roomName}!`)
        }
    }

    /**
     * Checks for the game being won.
     */
    checkForWin(gameData: GameData) {
        let hands = Object.values(gameData.hands).map(Hand.from)

        let handsEmpty = true
        for (let hand of hands) {
            if (!hand.isEmpty()) {
                handsEmpty = false
                break
            }
        }

        if (gameData.deck.isEmpty() && handsEmpty) {
            gameData.isWon = true
        }
    }

    /**
     * Checks for the game being lost.
     */
    checkForLoss(gameData: GameData) {
        let hands = Object.values(gameData.hands).map(Hand.from)

        for (let pile of gameData.piles) {
            pile.endTurn(gameData.ruleSet)

            if (pile.isDestroyed(gameData.ruleSet)) {
                console.log(`Pile ${pile.index} is destroyed!`)
                gameData.isLost = true
                return
            }
        }

        let noCardsCanBePlayed = true
        for (let hand of hands) {
            if (hand === undefined || hand.isEmpty()) {
                continue
            }

            for (let card of hand.cards) {
                for (let pile of gameData.piles) {
                    if (pile.canBePlayed(card, gameData.ruleSet)) {
                        noCardsCanBePlayed = false
                        break
                    }
                }
            }
        }

        if (!gameData.deck.isEmpty() && noCardsCanBePlayed) {
            gameData.isLost = true
        }
    }

    /**
     * Replenishes the hand of the current player in the given room.
     */
    replenish(roomName: string) {
        // draw new cards
        let gameData = this.getRoomData(roomName).gameData
        let currentPlayer = gameData.getCurrentPlayer()

        if (currentPlayer !== undefined) {
            let hand = gameData.getHand(currentPlayer)

            if (hand !== undefined) {
                for (let i = 0; i < gameData.cardsPlayedThisTurn; i++) {
                    if (!gameData.deck.isEmpty()) {
                        let newCard = gameData.deck.drawOne()
                        hand.add(newCard)
                    }
                }
            }
        }
    }

    /**
     * Passes control to the next player in the given room.
     */
    nextPlayer(roomName: string) {
        // pass control to the next player
        let gameData = this.getRoomData(roomName).gameData
        let players = gameData.players
        let newIndex = (gameData.currentPlayerIndex + 1) % players.length
        gameData.currentPlayerIndex = newIndex

        gameData.cardsPlayedThisTurn = 0
        let nextPlayer = players[newIndex]
        console.log(`It is now player ${nextPlayer}'s turn in room ${roomName}`)
    }

    /**
     * Removes the given player from the given room.
     */
    removeFromRoom(playerName: string, roomName: string) {
        if (this.roomExists(roomName)) {
            let roomData = this.getRoomData(roomName)
            roomData.removePlayer(playerName)
        }
        else {
            console.warn(`Tried to remove player ${playerName} from non-existent room ${roomName}!`)
        }
    }

    /**
     * Sets the game data for the given room.
     */
    setGameData(roomName: string, gameData: GameData) {
        if (this.roomExists(roomName)) {
            this.roomGameData[roomName].gameData = gameData
        }
        else {
            console.error(`Tried to set game data for non-existent room "${roomName}"!`)
        }
    }

    /**
     * Sets the rule set for the game in the given room.
     */
    setRuleSet(roomName: string, ruleSet: RuleSet) {
        if (this.roomExists(roomName)) {
            this.roomGameData[roomName].gameData.setRuleSet(ruleSet)
        }
        else {
            console.error(`Tried to set rule set for non-existent room "${roomName}"!`)
        }
    }

    /**
     * Removes the given room.
     */
    removeRoom(roomName: string) {
        console.log(`Removing room ${roomName}`)
        delete this.roomGameData[roomName]
    }
}
