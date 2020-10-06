import { Deck } from "./Deck"
import { Hand } from "./Hand"
import { Direction, Pile } from "./Pile"
import { RuleSet } from "./RuleSet"

/**
 * Represents a map of player names to hands.
 */
type PlayerHandMap = {
    [playerName: string] : Hand
}

/**
 * Represents data about a game.
 */
export class GameData {
    /**
     * The players in the game.
     */
    players: string[]

    /**
     * The rule set for the game.
     */
    ruleSet: RuleSet

    /**
     * The deck of cards.
     */
    deck: Deck

    /**
     * The players' hands.
     */
    hands: PlayerHandMap

    /**
     * The piles for the game.
     */
    piles: Pile[]

    /**
     * The number of turns played.
     */
    turnsPlayed: number

    /**
     * The index of the player whose turn it is.
     */
    currentPlayerIndex: number

    /**
     * The card to play.
     */
    cardToPlay: number | undefined

    /**
     * The number of cards played this turn.
     */
    cardsPlayedThisTurn: number

    /**
     * Whether the game is won.
     */
    isWon: boolean

    /**
     * Whether the game is lost.
     */
    isLost: boolean

    /**
     * Constructor.
     */
    constructor(
        players: string[],
        ruleSet: RuleSet,
        deck: Deck,
        hands: PlayerHandMap,
        piles: Pile[],
        turnsPlayed: number,
        currentPlayerIndex: number,
        cardToPlay: number | undefined,
        cardsPlayedThisTurn: number,
        isWon: boolean,
        isLost: boolean,

    ) {
        this.players = players
        this.ruleSet = ruleSet
        this.deck = deck
        this.hands = hands
        this.piles = piles
        this.turnsPlayed = turnsPlayed
        this.currentPlayerIndex = currentPlayerIndex
        this.cardToPlay = cardToPlay
        this.cardsPlayedThisTurn = cardsPlayedThisTurn
        this.isWon = isWon
        this.isLost = isLost
    }

    /**
     * Returns a default game data object.
     */
    static default() {
        return GameData.withRuleSet(RuleSet.default())
    }

    /**
     * Creates a new game data object with the given rule set.
     */
    static withRuleSet(ruleSet: RuleSet) {
        let deck = GameData.createDeck(ruleSet)
        let piles = GameData.createPiles(ruleSet)

        return new GameData([], ruleSet, deck, {}, piles, 0, 0, undefined, 0, false, false)
    }

    /**
     * Returns a concrete game data object. Use when processing naive message from the server.
     */
    static from(gameData: GameData) {
        return new GameData(
            gameData.players,
            RuleSet.from(gameData.ruleSet),
            Deck.from(gameData.deck),
            gameData.hands,
            gameData.piles.map(p => Pile.from(p)),
            gameData.turnsPlayed,
            gameData.currentPlayerIndex,
            gameData.cardToPlay,
            gameData.cardsPlayedThisTurn,
            gameData.isWon,
            gameData.isLost,
        )
    }

    /**
     * Creates a deck for the rule set.
     */
    static createDeck(ruleSet: RuleSet) {
        return Deck.create(2, ruleSet.topLimit)
    }

    /**
     * Creates piles for the rule set.
     */
    static createPiles(ruleSet: RuleSet) {
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
     * Sets this game's rule set to the given one.
     */
    setRuleSet(ruleSet: RuleSet) {
        this.ruleSet = ruleSet
        this.ready()
    }

    /**
     * Readies the game.
     */
    private ready() {
        this.deck = GameData.createDeck(this.ruleSet)
        this.piles = GameData.createPiles(this.ruleSet)
    }

    /**
     * Starts the game with the given players and rule set.
     */
    start(players: string[]) {
        this.players = players

        for (let player of this.players) {
            this.dealHand(player)
        }
    }

    /**
     * Returns whether this game is in progress.
     */
    isInProgress() {
        return !this.isWon && !this.isLost
    }

    /**
     * Creates a hand for the rule set from the given deck.
     */
    dealHand(playerName: string) {
        this.hands[playerName] = new Hand(this.deck.draw(this.ruleSet.handSize))
    }

    /**
     * Returns the current player.
     */
    getCurrentPlayer() {
        if (this.players.length <= 0) {
            return undefined
        }

        return this.players[this.currentPlayerIndex]
    }

    /**
     * Returns the hand belonging to the given player.
     */
    getHand(playerName: string ) {
        let handObj = this.hands[playerName]
        return handObj !== undefined ? Hand.from(handObj) : undefined
    }

    /**
     * Removes the given player from the game.
     */
    removePlayer(playerName: string) {
        if (this.playerIsPresent(playerName)) {
            // remove player from list
            let index = this.players.indexOf(playerName)
            this.players.splice(index, 1)

            // reset current player
            this.currentPlayerIndex = Math.max(0, this.currentPlayerIndex - 1)

            // shuffle player's hand back into the deck
            let hand = this.getHand(playerName)
            if (hand !== undefined) {
                this.deck.addCards(hand.cards)
                this.deck.shuffle()
                delete this.hands[playerName]
            }
        }
        else {
            console.warn(`Tried to remove player ${playerName} but they were not in the game!`)
        }
    }

    /**
     * Returns whether the given player is in this game.
     */
    playerIsPresent(playerName: string) {
        return this.players.includes(playerName)
    }
}