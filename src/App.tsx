import React from "react"

import { GameBoard } from "./components/GameBoard"

import "./App.css"

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <div className="elements">
                <GameBoard />
                </div>
            </header>
        </div>
    )
}

export default App
