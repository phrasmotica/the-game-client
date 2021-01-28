import React, { useState } from "react"
import { FaArrowDown, FaArrowUp, FaHistory, FaUndo } from "react-icons/fa"
import { Button } from "semantic-ui-react"

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
export const PileView = (props: PileViewProps) => {
    const [showHistory, setShowHistory] = useState(false)

    let pile = props.pile

    let directionElement = <FaArrowUp />
    if (pile.direction === Direction.Descending) {
        directionElement = <FaArrowDown />
    }

    let topCard = pile.topCard()
    let topElement = <CardView ruleSet={props.ruleSet} />

    if (pile.cards.length > 0) {
        let isJustPlayed = pile.topCardInfo()!.turnPlayed === props.turnCounter

        topElement = <CardView
                        ruleSet={props.ruleSet}
                        card={topCard}
                        isJustPlayed={isJustPlayed} />
    }

    let pileClassName = "pile"
    let pileState = pile.getState(props.ruleSet)
    switch (pileState) {
        case PileState.Destroyed:
            pileClassName += " destroyed"
            break
        case PileState.OnFire:
            pileClassName += " on-fire"
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
                    gap = props.cardToPlay.value - topCard.value
                    if (gap < 0) {
                        className += " gap-jumpback"
                        text = `${gap}`
                    }
                    else {
                        text = `+${gap}`
                    }
                    break

                case Direction.Descending:
                    gap = topCard.value - props.cardToPlay.value
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

    const createHistoryElement = () => {
        if (!showHistory) {
            return null
        }

        return (
            <div className="history-container">
                <span className="history-text">
                    {props.pile.cards.map(c => c[0].value).join(", ")}
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
                <div className="start-text">
                    <span>{pile.start}</span>
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

                {createHistoryElement()}
            </div>

            <div className="flex-center space-between">
                <div className="margin-right-small">
                    <Button
                        positive
                        className="pile-button no-margin"
                        disabled={cannotPlay}
                        onClick={() => playCard(cardToPlay)}>
                        Play
                    </Button>
                </div>

                <div className="margin-right-small">
                    <Button
                        className="mulligan-button no-margin"
                        disabled={!canMulligan}
                        onClick={() => props.mulligan(props.index)}>
                        <FaUndo />
                    </Button>
                </div>

                <div>
                    <Button
                        className="history-button no-margin"
                        disabled={!props.ruleSet.canViewPileHistory}
                        onClick={() => setShowHistory(!showHistory)}>
                        <FaHistory />
                    </Button>
                </div>
            </div>
        </div>
    )
}
