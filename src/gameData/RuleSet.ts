/**
 * Represents a set of rules for the game.
 */
export class RuleSet {
    /**
     * The number of pairs of piles.
     */
    pairsOfPiles: number

    /**
     * The size of valid backward jumps on a pile.
     */
    jumpBackSize: number

    /**
     * The start value for descending piles.
     */
    topLimit: number

    /**
     * The size of a player's hand.
     */
    handSize: number

    /**
     * Creates a new rule set.
     */
    private constructor(
        pairsOfPiles: number,
        jumpBackSize: number,
        topLimit: number,
        handSize: number,
    ) {
        this.pairsOfPiles = pairsOfPiles
        this.jumpBackSize = jumpBackSize
        this.topLimit = topLimit
        this.handSize = handSize
    }

    /**
     * Creates the default rule set.
     */
    static default() {
        return new RuleSet(2, 10, 100, 8)
    }
}