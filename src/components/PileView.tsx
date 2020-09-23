import React from "react"

import { CardView } from "./CardView"

import { Direction, Pile, PileState } from "../gameData/Pile"
import { RuleSet } from "../gameData/RuleSet"

interface PileViewProps {
    /**
     * The index of the pile.
     */
    index: number

    /**
     * The pile.
     */
    pile: Pile

    /**
     * The rule set.
     */
    ruleSet: RuleSet

    /**
     * The number of turns played.
     */
    turnsPlayed: number

    /**
     * The card to play.
     */
    cardToPlay: number | undefined

    /**
     * Whether the game is lost.
     */
    isLost: boolean

    /**
     * Sets the card to be played.
     */
    setCardToPlay: (card: number | undefined) => void

    /**
     * Removes the given card from the player's hand.
     */
    playCard: (card: number) => void

    /**
     * Loses the game.
     */
    loseGame: () => void
}

/**
 * Renders a pile.
 */
export function PileView(props: PileViewProps) {
    let pile = props.pile

    let directionElement = <span className="direction-text">(UP)</span>
    if (pile.direction === Direction.Descending) {
        directionElement = <span className="direction-text">(DOWN)</span>
    }

    let top = pile.top()
    let topElement = <CardView ruleSet={props.ruleSet} card={top} />
    if (top === pile.start) {
        topElement = <CardView ruleSet={props.ruleSet} />
    }

    let pileClassName = "pile"
    let pileState = pile.getState(props.ruleSet)
    switch (pileState) {
        case PileState.Destroyed:
            pileClassName = "pile-destroyed"
            break;
        case PileState.OnFire:
            pileClassName = "pile-on-fire"
            break;
        default:
            break;
    }

    let cardToPlay = props.cardToPlay

    /**
     * Plays the given card on this pile.
     */
    const playCard = (card: number | undefined) => {
        if (card) {
            props.playCard(card)
        }

        props.setCardToPlay(undefined)
    }

    /**
     * Returns whether the given card can be played on this pile.
     */
    const canPlayCard = (card: number) => {
        return props.pile.canBePlayed(card, props.ruleSet)
    }

    return (
        <div className="pile-set">
            <div className={pileClassName}>
                <div>
                    <span className="start-text">{pile.start}</span>
                </div>

                <div>
                    {directionElement}
                </div>

                <div>
                    {topElement}
                </div>
            </div>

            <div>
                <button
                    className="pile-button"
                    disabled={props.isLost || cardToPlay === undefined || !canPlayCard(cardToPlay)}
                    onClick={() => playCard(cardToPlay)}>
                    Play
                </button>
            </div>
        </div>
    )
}
