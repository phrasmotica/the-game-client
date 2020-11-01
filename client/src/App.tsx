import React, { useState, useRef } from "react"
import socketIOClient, { Socket } from "socket.io-client"

import { GameBoard } from "./components/GameBoard"
import { GameBrowser } from "./components/GameBrowser"
import { GameLobby } from "./components/GameLobby"
import { GameMenu } from "./components/GameMenu"

import { ClientMode } from "./models/ClientMode"
import { GameData } from "./models/GameData"
import { Message } from "./models/Message"
import { RoomData } from "./models/RoomData"
import { RoomWith } from "./models/RoomWith"
import { RuleSet } from "./models/RuleSet"

import "./App.css"

/**
 * The states the app can adopt.
 */
enum AppState {
    Menu,
    Browse,
    Lobby,
    Game
}

function App() {
    const [state, setState] = useState(AppState.Menu)
    const [allRoomData, setAllRoomData] = useState<RoomData[]>([])
    const [roomData, setRoomData] = useState(RoomData.empty())
    const [playerName, setPlayerName] = useState("")
    const [clientMode, setClientMode] = useState(ClientMode.Player)

    const socket = useRef(Socket)

    /**
     * Connects to the server and sets up event listeners for the socket.
     */
    const joinServer = (playerName: string) => {
        let endpoint = process.env.REACT_APP_SERVER_ENDPOINT
        if (endpoint === undefined) {
            throw new Error("No server endpoint found!")
        }

        socket.current = socketIOClient(endpoint)
        setPlayerName(playerName)

        socket.current.emit("joinServer", playerName)

        socket.current.on("joinServerReceived", (newAllRoomData: RoomData[]) => {
            setAllRoomData(newAllRoomData.map(RoomData.from))
            setState(AppState.Browse)
        })

        socket.current.on("allLobbyData", (newAllRoomData: RoomData[]) => {
            setAllRoomData(newAllRoomData.map(RoomData.from))
        })

        socket.current.on("lobbyData", (message: Message<RoomData>) => {
            let roomData = RoomData.from(message.content)

            // TODO: allRoomData seems to be an empty list every time here.
            // is it being reset unbeknownst to me?
            let newAllRoomData = [...allRoomData]

            let index = newAllRoomData.findIndex(r => r.name === roomData.name)
            if (index >= 0) {
                newAllRoomData[index] = roomData
            }
            else {
                // this is a workaround for allRoomData sometimes being an empty list,
                // even though it should never be once the player has joined the server
                newAllRoomData.push(roomData)
            }

            setAllRoomData(newAllRoomData)
        })

        socket.current.on("removeLobbyData", (roomName: string) => {
            // TODO: same as line 63
            let newAllRoomData = [...allRoomData]

            let index = newAllRoomData.findIndex(r => r.name === roomName)
            if (index >= 0) {
                newAllRoomData.splice(index, 1)
                setAllRoomData(newAllRoomData)
            }
        })

        socket.current.on("joinRoomReceived", () => {
            setClientMode(ClientMode.Player)
            setState(AppState.Lobby)
        })

        socket.current.on("spectateRoomReceived", () => {
            setClientMode(ClientMode.Spectator)
            setState(AppState.Lobby)
        })

        socket.current.on("gameStarted", (message: Message<RoomData>) => {
            setState(AppState.Game)
            setRoomData(RoomData.from(message.content))
        })

        socket.current.on("roomData", (message: Message<RoomData>) => {
            let roomData = RoomData.from(message.content)
            setRoomData(roomData)
        })

        socket.current.on("kick", () => {
            let roomData = RoomData.empty()
            setRoomData(roomData)
            setState(AppState.Browse)
        })
    }

    /**
     * Creates a room with the given name.
     */
    const createRoom = (roomName: string) => {
        socket.current.emit("createRoom", roomName)
    }

    /**
     * Joins the given room with the given player name.
     */
    const joinRoom = (roomName: string, playerName: string) => {
        socket.current.emit("joinRoom", new RoomWith(roomName, playerName))
    }

    /**
     * Joins the given room with the given player name as a spectator.
     */
    const spectateGame = (roomName: string, playerName: string) => {
        socket.current.emit("spectateRoom", new RoomWith(roomName, playerName))
    }

    /**
     * Starts a game with the given rule set.
     */
    const startGame = (roomName: string) => {
        socket.current.emit("startGame", roomName)
    }

    /**
     * Adds the given player's starting player vote in the given room.
     */
    const addVoteForStartingPlayer = (startingPlayer: string) => {
        let data: [string, string] = [playerName, startingPlayer]
        let req = new RoomWith(roomData.name, data)
        socket.current.emit("addVoteForStartingPlayer", req)
    }

    /**
     * Removes the given player's starting player vote in the given room.
     */
    const removeVoteForStartingPlayer = () => {
        let req = new RoomWith(roomData.name, playerName)
        socket.current.emit("removeVoteForStartingPlayer", req)
    }

    /**
     * Starts a new game.
     */
    const newGame = (ruleSet: RuleSet) => {
        let message = Message.info(ruleSet)
        socket.current.emit("newGame", message)
    }

    /**
     * Sets the game data and sends the new data to the server.
     */
    const setGameData = (gameData: GameData) => {
        let newRoomData = RoomData.from(roomData)
        newRoomData.gameData = gameData
        setRoomData(newRoomData)

        let message = Message.info(newRoomData)
        socket.current.emit("roomData", message)
    }

    /**
     * Plays a card and sends the new game data to the server.
     */
    const playCard = (gameData: GameData) => {
        let newRoomData = RoomData.from(roomData)
        newRoomData.gameData = gameData
        setRoomData(newRoomData)

        let message = Message.info(newRoomData)
        socket.current.emit("playCard", message)
    }

    /**
     * Sets the given rule set for the game.
     */
    const setRuleSet = (ruleSet: RuleSet) => {
        let body = new RoomWith(roomData.name, ruleSet)
        socket.current.emit("setRuleSet", body)
    }

    /**
     * Ends the turn.
     */
    const endTurn = () => {
        socket.current.emit("endTurn", roomData.name)
    }

    /**
     * Leaves the room.
     */
    const leaveRoom = () => {
        let event = ""
        switch (clientMode) {
            case ClientMode.Player:
                event = "leaveRoom"
                break;

            case ClientMode.Spectator:
                event = "stopSpectating"
                break;

            default:
                throw new Error(`Unrecognised client mode '${clientMode}'!`)
        }

        socket.current.emit(event, new RoomWith(roomData.name, playerName))
        setRoomData(RoomData.empty())
        setState(AppState.Browse)
    }

    /**
     * Leaves the server.
     */
    const leaveServer = () => {
        socket.current.disconnect()
        setPlayerName("")
        setState(AppState.Menu)
    }

    /**
     * Refreshes the game list.
     */
    const refreshGameList = () => {
        socket.current.emit("allLobbyData", playerName)
    }

    // TODO: when they leave a single player game in progress, a player's browser still
    // shows the game as in progress. GameBrowser not re-rendering even though the objects passed to its props are different?
    let contents = null
    switch (state) {
        case AppState.Menu:
            contents = (
                <GameMenu
                    joinServer={joinServer} />
            )
            break
        case AppState.Browse:
            contents = (
                <GameBrowser
                    playerName={playerName}
                    games={allRoomData}
                    createRoom={createRoom}
                    joinGame={joinRoom}
                    spectateGame={spectateGame}
                    leaveServer={leaveServer}
                    refreshGameList={refreshGameList} />
            )
            break
        case AppState.Lobby:
            contents = (
                <GameLobby
                    playerName={playerName}
                    roomData={roomData}
                    startGame={startGame}
                    setRuleSet={setRuleSet}
                    leaveRoom={leaveRoom} />
            )
            break
        case AppState.Game:
            contents = (
                <GameBoard
                    playerName={playerName}
                    gameData={roomData.gameData}
                    clientMode={clientMode}
                    addStartVote={addVoteForStartingPlayer}
                    removeStartVote={removeVoteForStartingPlayer}
                    newGame={newGame}
                    setGameData={setGameData}
                    playCard={playCard}
                    endTurn={endTurn}
                    leaveGame={leaveRoom} />
            )
            break
        default:
            break
    }

    let gameLink = "https://boardgamegeek.com/boardgame/173090/game"

    return (
        <div className="App">
            <header className="App-header">
                <div className="elements">
                    {contents}

                    <div id="footer" className="flex-center space-around">
                        <div>
                            <span>
                                Version 1.0
                            </span>
                        </div>

                        <div>
                            <span>
                                Adapted from <a className="App-link" href={gameLink} target="_blank" rel="noopener noreferrer">The Game</a> by Steffen Benndorf
                            </span>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default App
