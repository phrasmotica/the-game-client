/**
 * Interface for types containing a set of rules.
 */
export interface IRuleSet {
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
}

/**
 * Represents a set of rules for the game.
 */
export class RuleSet implements IRuleSet {
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
    constructor() {
        this.pairsOfPiles = 2
        this.jumpBackSize = 10
        this.topLimit = 100
        this.handSize = 8
    }

    /**
     * Creates the default rule set.
     */
    static default() {
        return new RuleSetBuilder()
            .withPairsOfPiles(2)
            .withJumpBackSize(10)
            .withTopLimit(100)
            .withHandSize(8)
            .build()
    }
}

/**
 * Builder for a rule set.
 */
export class RuleSetBuilder {
    /**
     * The rule set to build.
     */
    private readonly ruleSet: RuleSet

    /**
     * Constructor.
     */
    constructor() {
        this.ruleSet = new RuleSet()
    }

    /**
     * Sets the number of pairs of piles in the rule set.
     */
    withPairsOfPiles(pairsOfPiles: number) {
        this.ruleSet.pairsOfPiles = pairsOfPiles
        return this
    }

    /**
     * Sets the jump back size in the rule set.
     */
    withJumpBackSize(jumpBackSize: number) {
        this.ruleSet.jumpBackSize = jumpBackSize
        return this
    }

    /**
     * Sets the top limit in the rule set.
     */
    withTopLimit(topLimit: number) {
        this.ruleSet.topLimit = topLimit
        return this
    }

    /**
     * Sets the hand size in the rule set.
     */
    withHandSize(handSize: number) {
        this.ruleSet.handSize = handSize
        return this
    }

    /**
     * Builds the rule set.
     */
    build() {
        return this.ruleSet
    }
}