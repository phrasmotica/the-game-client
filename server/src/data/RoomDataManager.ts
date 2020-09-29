import { Hand } from "../models/Hand"
import { GameData } from "../models/GameData"
import { RoomData } from "../models/RoomData"
import { RuleSet } from "../models/RuleSet"

/**
 * Class for managing room data on the server.
 */
export class RoomDataManager {
    /**
     * Room data indexed by room name.
     */
    roomGameData: {
        [roomName: string] : RoomData
    } = {}

    /**
     * Returns the data for the given room.
     */
    getRoomData(roomName: string) {
        return this.roomGameData[roomName]
    }

    /**
     * Returns the players in the given room.
     */
    getPlayers(roomName: string) {
        return this.getRoomData(roomName)?.gameData.players ?? []
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
     * Creates a room with the given name.
     */
    initialise(roomName: string) {
        this.roomGameData[roomName] = RoomData.named(roomName)
    }

    /**
     * Starts a new game in the given room.
     */
    newGame(roomName: string, ruleSet: RuleSet) {
        console.log(`Starting new game in room ${roomName}`)

        let newGameData = GameData.withRuleSet(ruleSet)
        let players = this.getPlayers(roomName)
        for (let player of players) {
            this.addToGameData(player, newGameData)
            newGameData.dealHand(player)
        }

        this.roomGameData[roomName].gameData = newGameData
    }

    /**
     * Adds the given player to the given room.
     */
    addToRoom(playerName: string, roomName: string) {
        let roomData = this.getRoomData(roomName)
        this.addToGameData(playerName, roomData.gameData)
    }

    /**
     * Adds the given player to the game.
     */
    addToGameData(playerName: string, gameData: GameData) {
        gameData.players.push(playerName)

        // TODO: allow the players to decide who starts
        if (gameData.players.length === 1) {
            gameData.currentPlayerIndex = 0
        }
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
    removeFromGame(playerName: string, roomName: string) {
        console.log(`Removing player ${playerName} from room ${roomName}`)

        if (this.roomExists(roomName)) {
            let gameData = this.getRoomData(roomName).gameData
            gameData.removePlayer(playerName)
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
     * Removes the given room.
     */
    removeRoom(roomName: string) {
        console.log(`Removing room ${roomName}`)
        this.roomGameData[roomName] = undefined
    }
}
