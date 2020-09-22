import { RuleSet } from "./RuleSet"

import { Stack } from "../util/Stack"

/**
 * Represents a direction that a pile can go in.
 */
export enum Direction {
    Ascending,
    Descending
}

/**
 * Represents a pile.
 */
export class Pile {
    /**
     * The pile's starting number.
     */
    start: number

    /**
     * The pile's direction.
     */
    direction: Direction

    /**
     * The cards in the pile.
     */
    private cards: Stack<number>

    /**
     * Creates a new pile.
     */
    constructor(
        start: number,
        direction: Direction
    ) {
        this.start = start
        this.direction = direction
        this.cards = new Stack(100)
    }

    /**
     * Adds a number to the pile if possible.
     */
    push(number: number, ruleSet: RuleSet) {
        if (this.canBePlayed(number, ruleSet)) {
            this.cards.push(number)
        }
    }

    /**
     * Returns the card on the top of the pile.
     */
    top() {
        if (this.cards.isEmpty()) {
            return this.start
        }

        return this.cards.peek()
    }

    /**
     * Returns whether the given number can be played on this pile.
     */
    canBePlayed(number: number, ruleSet: RuleSet) {
        let top = this.top()

        if (this.direction === Direction.Ascending) {
            return number > top || number === top - ruleSet.jumpBackSize
        }

        return number < top || number === top + ruleSet.jumpBackSize
    }
}
