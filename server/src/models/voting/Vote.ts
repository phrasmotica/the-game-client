import { IVoteCalculator } from "./IVoteCalculator"
import { UnanimousVoteCalculator } from "./UnanimousVoteCalculator"

/**
 * Represents a map of votes.
 */
type VoteMap = {
    [voter: string] : string
}

/**
 * Represents the results of an action in a vote.
 */
export enum VoteResult {
    Success,
    Denied,
    Closed,
    NonExistent
}

/**
 * Represents the ways the winner of a vote can be calculated.
 */
export enum VoteCalculationMethod {
    Unanimous
}

/**
 * Stores a map of voters to votees.
 */
export class Vote {
    /**
     * The voters.
     */
    voters: string[]

    /**
     * The vote map.
     */
    voteMap: VoteMap

    /**
     * The vote calculation method.
     */
    voteCalculationMethod: VoteCalculationMethod

    /**
     * Whether the vote is closed.
     */
    isClosed: boolean

    /**
     * Creates a new player vote.
     */
    private constructor(
        voters: string[],
        voteMap: VoteMap,
        voteCalculationMethod: VoteCalculationMethod,
        isClosed: boolean
    ) {
        this.voters = voters
        this.voteMap = voteMap
        this.voteCalculationMethod = voteCalculationMethod
        this.isClosed = isClosed
    }

    /**
     * Sets the voters allowed to participate in this vote.
     */
    setVoters(voters: string[]) {
        this.voters = voters
    }

    /**
     * Adds a vote from the given voter for the given votee.
     */
    addVote(voter: string, votee: string) {
        if (!this.isClosed) {
            if (this.voters.includes(voter)) {
                this.voteMap[voter] = votee
                return VoteResult.Success
            }

            return VoteResult.Denied
        }

        return VoteResult.Closed
    }

    /**
     * Removes the vote from the given voter.
     */
    removeVote(voter: string) {
        if (!this.isClosed) {
            if (this.voters.includes(voter)) {
                delete this.voteMap[voter]
                return VoteResult.Success
            }

            return VoteResult.Denied
        }

        return VoteResult.Closed
    }

    /**
     * Returns whether the given voter has voted.
     */
    hasVoted(playerName: string) {
        return this.voteMap[playerName] !== undefined
    }

    /**
     * Returns whether the vote is complete.
     */
    isComplete() {
        let numberOfVotes = Object.values(this.voteMap).length
        return numberOfVotes === this.voters.length
    }

    /**
     * Returns the vote calculator to use for this vote.
     */
    getVoteCalculator(): IVoteCalculator {
        switch (this.voteCalculationMethod) {
            case VoteCalculationMethod.Unanimous:
                return new UnanimousVoteCalculator()

            default:
                return new UnanimousVoteCalculator()
        }
    }

    /**
     * Returns the winner of the vote.
     */
    getWinner() {
        return this.getVoteCalculator().getWinner(this)
    }

    /**
     * Closes the vote.
     */
    close() {
        this.isClosed = true
    }

    /**
     * Returns an empty vote.
     */
    static empty() {
        return new Vote([], {}, VoteCalculationMethod.Unanimous, false)
    }

    /**
     * Returns a new Vote object from the given Vote object.
     */
    static from(vote: Vote) {
        return new Vote(
            vote.voters,
            vote.voteMap,
            vote.voteCalculationMethod,
            vote.isClosed
        )
    }
}
