import { create } from "zustand"
import { persist } from "zustand/middleware"

const todayStr = new Date().toISOString().split("T")[0]

export const useStore = create (
    persist (
        (set) => ({
            activeTopic: "treino",
            habits: [
                {id: "h1", topic: "treino", name: "Musculação", streak: 5, completedDates: [todayStr]},
                {id: "h2", topic: "treino", name: "Cardio 20min", streak: 2, completedDates: []},
                {id: "h3", topic: "estudo", name: "Leitura 30min", streak: 3, completedDates: [todayStr]},
                {id: "h4", topic: "estudo", name: "Curso online", streak: 0, completedDates: []},
                {id: "h5", topic: "alimentação", name: "Beber 4L agua", streak: 7, completedDates: [todayStr]},
                {id: "h6", topic: "saude", name: "Meditação", streak: 2, completedDates: []},
                {id: "h7", topic: "produtividade", name: "Revisar metas", streak: 1, completedDates: [todayStr]},

            ],
            notes: [
                {id: "n1", topic: "treino", date: todayStr, text: "Aumentei a carga no supino hoje!"},
                {id: "n2", topic: "estudo", date: todayStr, text: "Hooks ficaram muito mais  claros."},
            ],


            setActiveTopic: (topic) => set({activeTopic: topic}),

            toggleHabits: (id) => set((state) => ({
                habits: state.habits.map((h) => {
                    if(h.id !== id) return h
                    const done = h.completedDates.includes(todayStr)
                    return {
                        ...h,
                        completedDates: done
                        ? h.completedDates.filter((d) => d !== todayStr) 
                        : [...h.completedDates, todayStr],
                        streak: done ? Math.max(0, h.streak - 1) : h.streak + 1,
                    }
                }),
            })),

            addHabit: (name, topic) => set((state) => ({
                habits: [...state.habits, {
                    id: Math.random().toString(36).split(2, 10),
                    topic,
                    name,
                    streak: 0,
                    completedDates: [],
                }],
            })),

            removeHabits: (id) => set((state) => ({
                habits: state.habits.filter((h) => h.id !== id),
            })),

            addNote: (text, topic) => set((state) => ({
                notes: [...state.notes, {
                    id: Math.random().toString(36).split(2, 10),
                    topic,
                    date: todayStr,
                    text,
                }],
            })),

            removeNote: (id) => set((state) => ({
                notes: state.notes.filter((n) => n.id !== id),
            })),
        }),
        {name: "Habitos-storage"}
    )
)