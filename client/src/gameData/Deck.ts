import { Random } from "../util/Random"

/**
 * Represents the deck.
 */
export class Deck {
    /**
     * The cards in the deck.
     */
    private cards: number[]

    /**
     * Creates a new deck.
     */
    constructor(
        cards: number[]
    ) {
        this.cards = cards
    }

    /**
     * Creates a deck for the game.
     */
    static create(min: number, max: number) {
        let cards = []

        for (let i = min; i < max; i++) {
            cards.push(i)
        }

        console.log("Created a deck")

        return new Deck(cards)
    }

    /**
     * Returns the size of the deck.
     */
    size() {
        return this.cards.length
    }

    /**
     * Returns whether the deck is empty.
     */
    isEmpty() {
        return this.size() === 0
    }

    /**
     * Draws the given number of cards from the deck.
     */
    draw(count: number) {
        let draws = []

        for (let i = 0; i < count; i++) {
            draws.push(this.drawOne())
        }

        return draws
    }

    /**
     * Draws one card from the deck.
     */
    drawOne() {
        let index = Random.index(this.cards.length)
        let choice = this.cards[index]
        this.cards.splice(index, 1)
        return choice
    }
}
