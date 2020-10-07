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
     * The vote calculator.
     */
    voteCalculator: IVoteCalculator

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
        voteCalculator: IVoteCalculator,
        isClosed: boolean
    ) {
        this.voters = voters
        this.voteMap = voteMap
        this.voteCalculator = voteCalculator
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
     * Returns the winner of the vote.
     */
    getWinner() {
        return this.voteCalculator.getWinner(this)
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
        let voteCalculator = new UnanimousVoteCalculator()
        return new Vote([], {}, voteCalculator, false)
    }

    /**
     * Returns a new Vote object from the given Vote object.
     */
    static from(vote: Vote) {
        return new Vote(
            vote.voters,
            vote.voteMap,
            vote.voteCalculator,
            vote.isClosed
        )
    }
}
