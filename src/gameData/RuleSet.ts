/**
 * Represents the possible game modes.
 */
export enum GameMode {
    Regular = "Regular",
    OnFire = "On Fire"
}

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

    /**
     * The number of cards that must be played per turn.
     */
    cardsPerTurn: number

    /**
     * The number of cards that must be played per turn during the endgame.
     * Useless for single player but will have a use in multiplayer!
     */
    cardsPerTurnInEndgame: number

    /**
     * The game mode.
     */
    gameMode: GameMode

    /**
     * The cards that are on fire.
     */
    onFireCards: number[]
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
     * The number of cards that must be played per turn.
     */
    cardsPerTurn: number

    /**
     * The number of cards that must be played per turn during the endgame.
     * Useless for single player but will have a use in multiplayer!
     */
    cardsPerTurnInEndgame: number

    /**
     * The game mode.
     */
    gameMode: GameMode

    /**
     * The cards that are on fire.
     */
    onFireCards: number[]

    /**
     * Creates a new rule set.
     */
    constructor() {
        this.pairsOfPiles = 2
        this.jumpBackSize = 10
        this.topLimit = 100
        this.handSize = 8
        this.cardsPerTurn = 2
        this.cardsPerTurnInEndgame = 1
        this.gameMode = GameMode.Regular
        this.onFireCards = [22, 33, 44, 55, 66, 77]
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
            .withCardsPerTurn(2)
            .withCardsPerTurnInEndgame(1)
            .withGameMode(GameMode.Regular)
            .build()
    }

    /**
     * Returns whether this rule set is using the On Fire game mode.
     */
    isOnFire() {
        return this.gameMode === GameMode.OnFire
    }

    /**
     * Returns whether the given card is on fire.
     */
    cardIsOnFire(card: number) {
        return this.onFireCards.includes(card)
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
     * Sets the cards per turn in the rule set.
     */
    withCardsPerTurn(cardsPerTurn: number) {
        this.ruleSet.cardsPerTurn = cardsPerTurn
        return this
    }

    /**
     * Sets the cards per turn during the endgame in the rule set.
     */
    withCardsPerTurnInEndgame(cardsPerTurnInEndgame: number) {
        this.ruleSet.cardsPerTurnInEndgame = cardsPerTurnInEndgame
        return this
    }

    /**
     * Sets the game mode in the rule set.
     */
    withGameMode(gameMode: GameMode) {
        this.ruleSet.gameMode = gameMode
        return this
    }

    /**
     * Builds the rule set.
     */
    build() {
        return this.ruleSet
    }
}