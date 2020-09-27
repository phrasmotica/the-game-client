import { Deck } from "./Deck"
import { Hand } from "./Hand"
import { Direction, Pile } from "./Pile"
import { RuleSet } from "./RuleSet"

/**
 * Represents data about a game.
 */
export class GameData {
    /**
     * The rule set for the game.
     */
    ruleSet: RuleSet

    /**
     * The deck of cards.
     */
    deck: Deck

    /**
     * The player's hand.
     */
    hand: Hand

    /**
     * The piles for the game.
     */
    piles: Pile[]

    /**
     * The number of turns played.
     */
    turnsPlayed: number

    /**
     * The card to play.
     */
    cardToPlay: number | undefined

    /**
     * The number of cards played this turn.
     */
    cardsPlayedThisTurn: number

    /**
     * Whether the game is lost.
     */
    isLost: boolean

    /**
     * Constructor.
     */
    constructor(
        ruleSet: RuleSet,
        deck: Deck,
        hand: Hand,
        piles: Pile[],
        turnsPlayed: number,
        cardToPlay: number | undefined,
        cardsPlayedThisTurn: number,
        isLost: boolean
    ) {
        this.ruleSet = ruleSet
        this.deck = deck
        this.hand = hand
        this.piles = piles
        this.turnsPlayed = turnsPlayed
        this.cardToPlay = cardToPlay
        this.cardsPlayedThisTurn = cardsPlayedThisTurn
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
        let hand = GameData.createHand(ruleSet, deck)
        let piles = GameData.createPiles(ruleSet)

        return new GameData(ruleSet, deck, hand, piles, 0, undefined, 0, false)
    }

    /**
     * Returns a concrete game data object. Use when processing naive message from the server.
     */
    static from(gameData: GameData) {
        return new GameData(
            RuleSet.from(gameData.ruleSet),
            Deck.from(gameData.deck),
            Hand.from(gameData.hand),
            gameData.piles.map(p => Pile.from(p)),
            gameData.turnsPlayed,
            gameData.cardToPlay,
            gameData.cardsPlayedThisTurn,
            gameData.isLost
        )
    }

    /**
     * Creates a deck for the rule set.
     */
    static createDeck(ruleSet: RuleSet) {
        return Deck.create(2, ruleSet.topLimit)
    }

    /**
     * Creates a hand for the rule set from the given deck.
     */
    static createHand(ruleSet: RuleSet, deck: Deck) {
        return new Hand(deck.draw(ruleSet.handSize))
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
}