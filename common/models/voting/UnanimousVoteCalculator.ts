import { IVoteCalculator } from "./IVoteCalculator"
import { Vote } from "./Vote"

export class UnanimousVoteCalculator implements IVoteCalculator {
    /**
     * Returns the winner of the vote if it is unanimous, otherwise returns undefined.
     */
    getWinner(vote: Vote) {
        let votes = vote.enumerateVotes()
        if (votes.length <= 0) {
            return undefined
        }

        let votesFor: string[] = []
        for (let vote of votes) {
            if (!votesFor.includes(vote)) {
                votesFor.push(vote)
            }
        }

        // only a unanimous vote is valid
        if (votesFor.length > 1) {
            return undefined
        }

        return votes[0]
    }
}
