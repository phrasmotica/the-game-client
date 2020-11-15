import React from "react"

import { Hand } from "../common/models/Hand"

interface HandSummaryViewProps {
    /**
     * The player who the hand belongs to.
     */
    player: string | undefined

    /**
     * The hand.
     */
    hand: Hand | undefined
}

/**
 * Renders a summary of a hand.
 */
export function HandSummaryView(props: HandSummaryViewProps) {
    if (props.player === undefined || props.hand === undefined) {
        return (
            <div className="hand-summary margin-bottom">
                <span>
                    -
                </span>
            </div>
        )
    }

    return (
        <div className="hand-summary margin-bottom">
            <span>
                {props.player} has {props.hand.size()} cards in their hand.
            </span>
        </div>
    )
}
