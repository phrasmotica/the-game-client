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
 * Represents a state that a pile can be in
 */
export enum PileState {
    Safe,
    OnFire,
    Destroyed
}

/**
 * Represents a pile.
 */
export class Pile {
    /**
     * The cards in the pile.
     */
    private cards: Stack<number>

    /**
     * The number of turns that this pile has been on fire for.
     */
    private turnsOnFire: number

    /**
     * Creates a new pile.
     */
    constructor(
        public index: number,
        public start: number,
        public direction: Direction,
        cards?: number[],
        turnsOnFire?: number,
    ) {
        this.cards = new Stack(100, cards)
        this.turnsOnFire = turnsOnFire || 0
    }

    /**
     * Returns a concrete pile object. Use when processing naive message from the server.
     */
    static from(pile: Pile) {
        return new Pile(
            pile.index,
            pile.start,
            pile.direction,
            pile.cards.stack,
            pile.turnsOnFire,
        )
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

    /**
     * Returns the state of the pile.
     */
    getState(ruleSet: RuleSet) {
        if (this.isOnFire(ruleSet)) {
            if (this.turnsOnFire > 1) {
                return PileState.Destroyed
            }

            return PileState.OnFire
        }

        return PileState.Safe
    }

    /**
     * Returns whether this pile is on fire.
     */
    isOnFire(ruleSet: RuleSet) {
        return ruleSet.isOnFire() && ruleSet.cardIsOnFire(this.top())
    }

    /**
     * Returns whether this pile is on fire.
     */
    isDestroyed(ruleSet: RuleSet) {
        return ruleSet.isOnFire() && this.getState(ruleSet) === PileState.Destroyed
    }

    /**
     * Ends the turn according to the rule set.
     */
    endTurn(ruleSet: RuleSet) {
        if (ruleSet.isOnFire()) {
            if (ruleSet.cardIsOnFire(this.top())) {
                this.turnsOnFire++
                console.log(`Pile ${this.index} has been on fire for ${this.turnsOnFire} turns`)
            }
            else if (this.turnsOnFire > 0) {
                this.turnsOnFire = 0
                console.log(`Pile ${this.index} is no longer on fire`)
            }
        }
    }
}
