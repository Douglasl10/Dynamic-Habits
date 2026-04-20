import { createContext, useContext, useState } from "react";
import { useHabits } from "../hooks/useHabits";

const AppContext = createContext(null)

export function AppProvider({userId, children}) {
    const [activeTopic, setActiveTopic] = useState('treino')
    const habitsData = useHabits(userId)

    return (
        <AppContext.Provider value={{activeTopic, setActiveTopic, ...habitsData}}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => useContext(AppContext)