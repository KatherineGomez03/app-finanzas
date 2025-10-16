import React from "react"
import { Header } from "./header/Header"
import { PanelContainer } from "./panel/PanelContainer"
import SaveContainer from "./save/SaveContainer";

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

    const mockSavings = {
        current: 1350,
        goal: 2000,
        remainingDays: 14,
        dailySavings: [50, 75, 100, 60, 90, 80, 120, 70, 85, 95, 60, 100, 65, 100],
    };


    return (
        <div className="mx-4 min-h-screen text-white">
            <Header {...userData} />
            <div className="m-2 flex justify-items-center grid grid-cols-1 md:grid-cols-2">
                <PanelContainer />
                <SaveContainer
                    current={mockSavings.current}
                    goal={mockSavings.goal}
                    remainingDays={mockSavings.remainingDays}
                    dailySavings={mockSavings.dailySavings}
                />
            </div>

        </div>
    )
}

export default App
