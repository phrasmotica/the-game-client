import React from "react"

import { RuleSet } from "the-game-lib"

interface RuleSummaryProps {
    /**
     * The rule set.
     */
    ruleSet: RuleSet
}

/**
 * Renders a rule set.
 */
export function RuleSummary(props: RuleSummaryProps) {
    let ruleSet = props.ruleSet

    /**
     * Renders the given text in an span.
     */
    const renderSpan = (text: string) => <div><span>{text}</span></div>

    let cardsPerTurnElement = (
        <div>
            <span>
                Cards per turn: {ruleSet.cardsPerTurn}&nbsp;
                <abbr title="during endgame">
                    ({ruleSet.cardsPerTurnInEndgame})
                </abbr>
            </span>
        </div>
    )

    let canViewPileHistoryElement = (
        <div>
            <span>
                {ruleSet.canViewPileHistory ? "Can" : "Cannot"} view pile history
            </span>
        </div>
    )

    return (
        <div className="rule-summary">
            {renderSpan(`Game mode: ${ruleSet.gameMode}`)}
            {renderSpan(`Pairs of piles: ${ruleSet.pairsOfPiles}`)}
            {renderSpan(`Jump back size: ${ruleSet.jumpBackSize}`)}
            {renderSpan(`Top limit: ${ruleSet.topLimit}`)}
            {renderSpan(`Hand size: ${ruleSet.handSize}`)}
            {cardsPerTurnElement}
            {renderSpan(`Mulligan limit: ${ruleSet.mulliganLimit}`)}
            {canViewPileHistoryElement}
        </div>
    )
}
