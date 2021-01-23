import React from "react"
import { FaArrowDown, FaArrowUp, FaUndo } from "react-icons/fa"

import { Card, Direction, RuleSet, Pile, PileState } from "the-game-lib"

import { CardView } from "./CardView"

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
     * The name of the player.
     */
    playerName: string

    /**
     * The rule set.
     */
    ruleSet: RuleSet

    /**
     * The turn counter.
     */
    turnCounter: number

    /**
     * The card to play.
     */
    cardToPlay: Card | undefined

    /**
     * Whether to show the gaps between the top of the pile and the card to be played.
     */
    showPileGaps: boolean

    /**
     * Whether it is the player's turn.
     */
    isMyTurn: boolean

    /**
     * Whether the game is below the mulligan limit.
     */
    isWithinMulliganLimit: boolean

    /**
     * Whether the game is lost.
     */
    isLost: boolean

    /**
     * Sets the card to be played.
     */
    setCardToPlay: (card: Card | undefined) => void

    /**
     * Removes the given card from the player's hand.
     */
    playCard: (card: Card) => void

    /**
     * Takes a mulligan on the pile with the given index.
     */
    mulligan: (pileIndex: number) => void
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

    let top = pile.topCard()
    let topElement = <CardView ruleSet={props.ruleSet} card={top} />
    if (top.value === pile.start) {
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

        let shouldShow = props.isMyTurn && props.showPileGaps

        if (shouldShow && props.cardToPlay !== undefined && canPlayCard(props.cardToPlay)) {
            switch (pile.direction) {
                case Direction.Ascending:
                    gap = props.cardToPlay.value - top.value
                    if (gap < 0) {
                        className += " gap-jumpback"
                        text = `${gap}`
                    }
                    else {
                        text = `+${gap}`
                    }
                    break

                case Direction.Descending:
                    gap = top.value - props.cardToPlay.value
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
    const playCard = (card: Card | undefined) => {
        if (card) {
            props.playCard(card)
        }

        props.setCardToPlay(undefined)
    }

    /**
     * Returns whether the given card can be played on this pile.
     */
    const canPlayCard = (card: Card) => {
        return props.pile.canBePlayed(card, props.ruleSet)
    }

    let cardToPlay = props.cardToPlay
    let cannotPlay = props.isLost || !props.isMyTurn || cardToPlay === undefined || !canPlayCard(cardToPlay)
    let canMulligan = props.isWithinMulliganLimit && props.pile.canMulligan(props.playerName, props.turnCounter)

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

            <div className="flex-center space-between">
                <div>
                    <button
                        className="pile-button"
                        disabled={cannotPlay}
                        onClick={() => playCard(cardToPlay)}>
                        Play
                    </button>
                </div>

                <div>
                    <button
                        className="mulligan-button"
                        disabled={!canMulligan}
                        onClick={() => props.mulligan(props.index)}>
                        <FaUndo />
                    </button>
                </div>
            </div>
        </div>
    )
}
