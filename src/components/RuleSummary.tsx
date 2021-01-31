import React from "react"

import { GameMode, RuleSet } from "the-game-lib"

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

    const renderRule = (text: string, value?: number | string | GameMode) => {
        let valueElement = null
        if (value !== undefined) {
            valueElement = (
                <div>
                    <span>{value}</span>
                </div>
            )
        }

        return (
            <div className="rule-container">
                <div>
                    <span>{text}</span>
                </div>

                {valueElement}
            </div>
        )
    }

    return (
        <div className="rule-summary">
            <div className="margin-bottom-small">
                {renderRule("Game mode", ruleSet.gameMode)}
            </div>

            <div className="margin-bottom-small">
                {renderRule("Pairs of piles", ruleSet.pairsOfPiles)}
            </div>

            <div className="margin-bottom-small">
                {renderRule("Jump back size", ruleSet.jumpBackSize)}
            </div>

            <div className="margin-bottom-small">
                {renderRule("Top limit", ruleSet.topLimit)}
            </div>

            <div className="margin-bottom-small">
                {renderRule("Hand size", ruleSet.handSize)}
            </div>

            <div className="margin-bottom-small">
                {renderRule("Cards per turn", ruleSet.cardsPerTurn)}
            </div>

            <div className="margin-bottom-small">
                {renderRule("Cards per turn in endgame", ruleSet.cardsPerTurnInEndgame)}
            </div>

            <div className="margin-bottom-small">
                {renderRule("Mulligan limit", ruleSet.mulliganLimit)}
            </div>

            <div>
                {renderRule(`Can view pile history`, ruleSet.canViewPileHistory ? "Yes" : "No")}
            </div>
        </div>
    )
}
