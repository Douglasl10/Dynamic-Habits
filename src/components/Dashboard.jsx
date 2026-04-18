import { useState } from "react";
import { TOPICS } from "../data/topics";
import { useNavigate } from "react-router-dom";
import WeekStrip from "../components/WeekStrip";
import ProgressBar from "./ProgressBar";
import HabitCard from "./HabitCard";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
    const {habits, notes, activeTopic, addHabit} = useApp()
    const [newHabit, setNewHabit] = useState('')
    const [showForm, setShowForm] = useState(false)
    const topic = TOPICS.find(t => t.id === activeTopic)
    const tc = topic?.color
    const topicHabits = habits.filter(h => h.topic === activeTopic)
    const topicNotes = notes.filter(n => n.topic === activeTopic)
    const navigate = useNavigate()

    const handleAdd = () => {
        if(!newHabit.trim()) return
        addHabit(newHabit.trim(), activeTopic)
        setNewHabit('')
        setShowForm(false)
    }

    return (
        <div>
            <WeekStrip />
            <ProgressBar />

            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] tracking-[0.2em] font-mono text-[#282828]">
                        HABITOS
                    </span>
                    <button onClick={() => setShowForm(o => !o)}
                        className="text-xs px-3 py-1.5 rounded-md transition-all hover:opacity-80"
                        style={{border: `1px solid ${tc}44`, color: tc, background: "transparent"}}>
                            {showForm ? "✕ Cancelar" : "+ Adicionar"}
                    </button>
                </div>

                {showForm && (
                    <div className="flex gap-2 mb-3">
                        <input 
                        autoFocus
                        placeholder="Nome do Habito..."
                        value={newHabit}
                        onChange={e => setNewHabit(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleAdd}
                        className="flex-1 bg-[#0e0e0e] rounded-lg px-4 py-2.5 text-sm text-[#ccc] outline-none border border-[#222] focus:border-[#444] transition-colors"/>
                        <button className="px-4 py-2.5 rounded-lg text-sm font-bold text-black transition-opacity hover:opacity-80"
                        style={{background: tc}}
                        onClick={handleAdd}>
                            Criar
                        </button>
                    </div>
                )}

                {topicHabits.length === 0 ? <div className="flex flex-col items-center gap-3 py-10 opacity-30">
                    <span className="text-3xl">
                        {topic?.icon}
                    </span>
                    <p className="text-sm text-[#333]">
                        Nenhum habito nesta categoria
                    </p>
                </div> : topicHabits.map(h => <HabitCard key={h.id} habit={h} />)}
            </div>
            
            <div className="bg-[#0a0a0a] border border-[#141414] rounded-2xl p-5">
                <p className="text-[10px] tracking-[0.2em] font-mono text-[#222] mb-3">
                    ULTIMA ANOTAÇÃO
                </p>
                {topicNotes.length === 0 ? <p className="text-sm text-[#222]">Sem notação ainda.</p> :
                <div style={{borderLeft: `2px solid ${tc}`}} className="pl-3">
                    <p className="text-sm text-[#555] leading-relaxed mb-2">
                        {topicNotes.at(-1).text}
                    </p>
                    <span className="text-[10px] font-mono text-[#2a2a2a]">
                        {topicNotes.at(-1).date}
                    </span>
                </div>
                }
                <button className="text-sm font-medium mt-3 transition-opacity hover:opacity-70"
                onClick={() => navigate('/notes')}
                style={{color: tc, background: "transparent", border: "none", cursor: "pointer"}}>
                    Ver todas as anotações → 
                </button>
            </div>
        </div>
    )
}