import React from "react"
import { Header } from "./header/Header"

function App() {
    const userData = {
        username: "Maximiliano Guerra",
        level: 4,
        health: 75,
        maxHealth: 100,
        experience: 350,
        maxExperience: 500,
        attack: 30,
        defense: 15,
        coins: 285,
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header {...userData} />
        </div>
    )
}

export default App
