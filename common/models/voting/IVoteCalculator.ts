import { Vote } from "./Vote"

/**
 * Interface for calculating the winner of a vote.
 */
export interface IVoteCalculator {
    /**
     * Returns the winner of the vote, or undefined if there is no winner.
     */
    getWinner(vote: Vote): string | undefined
}
