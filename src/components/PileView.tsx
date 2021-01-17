import React from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"

import { CardView } from "./CardView"

import { Direction, Pile, PileState } from "the-game-lib/dist/game/Pile"
import { RuleSet } from "the-game-lib/dist/game/RuleSet"

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
     * Whether to show the gaps between the top of the pile and the card to be played.
     */
    showPileGaps: boolean

    /**
     * Whether it is the player's turn.
     */
    isMyTurn: boolean

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
}

/**
 * Renders a pile.
 */
export function PileView(props: PileViewProps) {
    let pile = props.pile

    let directionElement = <FaArrowUp />
    if (pile.direction === Direction.Descending) {
        directionElement = <FaArrowDown />
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
            break
        case PileState.OnFire:
            pileClassName = "pile-on-fire"
            break
        default:
            break
    }

    const createHintElement = () => {
        let text = "-"
        let className = "gap-text"

        let gap = 0

        if (props.showPileGaps && props.cardToPlay !== undefined && canPlayCard(props.cardToPlay)) {
            switch (pile.direction) {
                case Direction.Ascending:
                    gap = props.cardToPlay - top
                    if (gap < 0) {
                        className += " gap-jumpback"
                        text = `${gap}`
                    }
                    else {
                        text = `+${gap}`
                    }
                    break

                case Direction.Descending:
                    gap = top - props.cardToPlay
                    if (gap < 0) {
                        className += " gap-jumpback"
                        text = `+${-gap}`
                    }
                    else {
                        text = `-${gap}`
                    }
                    break
            }
        }

        return (
            <div className={className}>
                <span>
                    {text}
                </span>
            </div>
        )
    }

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

    let cardToPlay = props.cardToPlay
    let buttonIsDisabled = props.isLost || !props.isMyTurn || cardToPlay === undefined || !canPlayCard(cardToPlay)

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

                <div>
                    {createHintElement()}
                </div>
            </div>

            <div>
                <button
                    className="pile-button"
                    disabled={buttonIsDisabled}
                    onClick={() => playCard(cardToPlay)}>
                    Play
                </button>
            </div>
        </div>
    )
}
