import React, { Component } from "react"

import { HandView } from "./HandView"
import { GameOptions } from "./GameOptions"
import { PileView } from "./PileView"

import { GameData } from "../models/GameData"
import { Direction, Pile } from "../models/Pile"
import { RuleSet } from "../models/RuleSet"

interface GameBoardProps {
    /**
     * The rule set.
     */
    gameData: GameData

    /**
     * Sets the game data.
     */
    setGameData: (gameData: GameData) => void
}

interface GameBoardState {

}

export class GameBoard extends Component<GameBoardProps, GameBoardState> {
    /**
     * Renders the game board.
     */
    render() {
        let deckInfo = `Cards left in deck: ${this.props.gameData.deck.size()}`
        if (this.isWon()) {
            deckInfo = "You won!"
        }
        else if (this.props.gameData.isLost) {
            // TODO: show remaining cards in deck after losing
            deckInfo = "You lost!"
        }

        let deckInfoElement = (
            <div className="half-width">
                <span className="game-info-text">{deckInfo}</span>
            </div>
        )

        let handInfo = `Cards left to play this turn: ${this.getCardsLeftToPlayThisTurn()}`
        let handInfoElement = (
            <div className="half-width">
                <span className="game-info-text">{handInfo}</span>
            </div>
        )

        let ruleSet = this.props.gameData.ruleSet
        let piles = this.props.gameData.piles

        let ascendingPiles = []
        for (let i = 0; i < ruleSet.pairsOfPiles; i++) {
            ascendingPiles.push(
                <PileView
                    key={i}
                    index={i}
                    pile={piles[i]}
                    ruleSet={ruleSet}
                    turnsPlayed={this.props.gameData.turnsPlayed}
                    isLost={this.props.gameData.isLost}
                    cardToPlay={this.props.gameData.cardToPlay}
                    setCardToPlay={(card) => this.setCardToPlay(card)}
                    playCard={(card) => this.playCard(card, i)}
                    loseGame={() => this.loseGame()} />
            )
        }

        let descendingPiles = []
        for (let j = 0; j < ruleSet.pairsOfPiles; j++) {
            let index = ruleSet.pairsOfPiles + j
            descendingPiles.push(
                <PileView
                    key={index}
                    index={index}
                    pile={piles[index]}
                    ruleSet={ruleSet}
                    turnsPlayed={this.props.gameData.turnsPlayed}
                    isLost={this.props.gameData.isLost}
                    cardToPlay={this.props.gameData.cardToPlay}
                    setCardToPlay={(card) => this.setCardToPlay(card)}
                    playCard={(card) => this.playCard(card, index)}
                    loseGame={() => this.loseGame()} />
            )
        }

        return (
            <div className="game-board">
                <div className="flex-center margin-bottom">
                    {deckInfoElement}
                    {handInfoElement}
                </div>

                <div className="flex-center space-around">
                    {ascendingPiles}
                    {descendingPiles}
                </div>

                <div>
                    <HandView
                        ruleSet={ruleSet}
                        hand={this.props.gameData.hand}
                        cardToPlay={this.props.gameData.cardToPlay}
                        isLost={this.props.gameData.isLost}
                        setCardToPlay={(card) => this.setCardToPlay(card)} />
                </div>

                <div className="flex-center margin-bottom">
                    <button
                        className="margin-right"
                        disabled={this.props.gameData.isLost || this.isWon() || this.props.gameData.cardToPlay === undefined}
                        onClick={() => this.setCardToPlay(undefined)}>
                        Cancel
                    </button>

                    <button
                        className="margin-right"
                        disabled={this.props.gameData.isLost || this.isWon() || this.props.gameData.hand.isEmpty()}
                        onClick={() => this.sortHand()}>
                        Sort hand
                    </button>

                    <button
                        className="margin-right"
                        disabled={this.props.gameData.isLost || this.isWon() || !this.areEnoughCardsPlayed()}
                        onClick={() => this.endTurn()}>
                        End turn
                    </button>

                    <button
                        disabled={this.props.gameData.isLost || this.isWon() || !this.noCardsCanBePlayed()}
                        onClick={() => this.loseGame()}>
                        Pass
                    </button>
                </div>

                <GameOptions ruleSet={this.props.gameData.ruleSet} newGame={(ruleSet) => this.newGame(ruleSet)} />
            </div>
        )
    }

    /**
     * Returns whether the game has been won.
     */
    isWon() {
        return this.props.gameData.deck.isEmpty() && this.props.gameData.hand.isEmpty()
    }

    /**
     * Returns whether no cards can be played on any piles.
     */
    noCardsCanBePlayed() {
        let gameData = this.props.gameData

        for (let card of gameData.hand.cards) {
            for (let pile of gameData.piles) {
                if (pile.canBePlayed(card, gameData.ruleSet)) {
                    return false
                }
            }
        }

        return true
    }

    /**
     * Starts a new game.
     */
    newGame(ruleSet: RuleSet) {
        let newGameData = GameData.withRuleSet(ruleSet)
        this.props.setGameData(newGameData)
    }

    /**
     * Creates piles for the rule set.
     */
    createPiles(ruleSet: RuleSet) {
        let piles = []

        for (let i = 0; i < ruleSet.pairsOfPiles; i++) {
            let pile = new Pile(i, 1, Direction.Ascending)
            piles.push(pile)
        }

        for (let j = 0; j < ruleSet.pairsOfPiles; j++) {
            let index = ruleSet.pairsOfPiles + j
            let pile = new Pile(index, ruleSet.topLimit, Direction.Descending)
            piles.push(pile)
        }

        return piles
    }

    /**
     * Sets the card to play.
     */
    setCardToPlay(card: number | undefined) {
        let newGameData = this.props.gameData
        newGameData.cardToPlay = card
        this.props.setGameData(newGameData)
    }

    /**
     * Plays the given card from the player's hand.
     */
    playCard(card: number, pileIndex: number) {
        let newGameData = this.props.gameData

        let pile = newGameData.piles[pileIndex]
        pile.push(card, this.props.gameData.ruleSet)

        let hand = newGameData.hand
        hand.remove(card)

        newGameData.cardsPlayedThisTurn++

        this.props.setGameData(newGameData)
    }

    /**
     * Returns the number of cards that must be played this turn.
     */
    getCardsToPlay() {
        let gameData = this.props.gameData

        if (gameData.deck.isEmpty()) {
            return gameData.ruleSet.cardsPerTurnInEndgame
        }

        return gameData.ruleSet.cardsPerTurn
    }

    /**
     * Returns whether enough cards have been played.
     */
    areEnoughCardsPlayed() {
        return this.props.gameData.cardsPlayedThisTurn >= this.getCardsToPlay()
    }

    /**
     * Returns the remaining number of cards that must be played this turn.
     */
    getCardsLeftToPlayThisTurn() {
        return Math.max(this.getCardsToPlay() - this.props.gameData.cardsPlayedThisTurn, 0)
    }

    /**
     * Sorts the hand into ascending order.
     */
    sortHand() {
        let newGameData = this.props.gameData
        newGameData.hand = newGameData.hand.sort()
        this.props.setGameData(newGameData)
    }

    /**
     * Ends the turn according to the given rule set.
     */
    endTurn() {
        let newGameData = this.props.gameData

        for (let pile of newGameData.piles) {
            pile.endTurn(newGameData.ruleSet)

            if (pile.isDestroyed(newGameData.ruleSet)) {
                console.log(`Pile ${pile.index} is destroyed! You lose!`)
                this.loseGame()
                return
            }
        }

        let noCardsCanBePlayed = this.noCardsCanBePlayed()

        if (!noCardsCanBePlayed) {
            // draw new cards if the game is still going
            for (let i = 0; i < newGameData.cardsPlayedThisTurn; i++) {
                if (!newGameData.deck.isEmpty()) {
                    let newCard = newGameData.deck.drawOne()
                    newGameData.hand.add(newCard)
                }
            }
        }

        newGameData.cardsPlayedThisTurn = 0
        newGameData.isLost = noCardsCanBePlayed

        this.props.setGameData(newGameData)
    }

    /**
     * Loses the game.
     */
    loseGame() {
        let newGameData = this.props.gameData
        newGameData.isLost = true
        this.props.setGameData(newGameData)
    }
}