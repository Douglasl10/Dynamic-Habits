import { useState } from "react"
import { TOPICS } from "../data/topics"
import { useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"
import WeekStrip   from "../components/WeekStrip"
import ProgressBar from "../components/ProgressBar"
import HabitCard   from "../components/HabitCard"

const todayStr = new Date().toLocaleDateString('en-CA')

export default function Dashboard() {
  const { habits, notes, activeTopic, addHabit, isCompleted } = useApp()
  const [newHabit, setNewHabit] = useState('')
  const [showForm, setShowForm] = useState(false)
  const topic    = TOPICS.find(t => t.id === activeTopic)
  const tc       = topic?.color
  const navigate = useNavigate()

  // Mostra só hábitos NÃO concluídos hoje — voltam amanhã automaticamente
  const topicHabits = habits
    .filter(h => h.topic === activeTopic)
    .filter(h => !isCompleted(h.id, todayStr))

  // Notas do tópico ativo
  const topicNotes = notes.filter(n => n && n.topic === activeTopic)
  const lastNote   = topicNotes.at(-1)

  // Total de hábitos do tópico (incluindo concluídos) para o contador
  const totalHabits = habits.filter(h => h.topic === activeTopic).length
  const doneToday   = habits
    .filter(h => h.topic === activeTopic)
    .filter(h => isCompleted(h.id, todayStr)).length

  const handleAdd = () => {
    if (!newHabit.trim()) return
    addHabit(newHabit.trim(), activeTopic)
    setNewHabit('')
    setShowForm(false)
  }

  return (
    <div>
      <WeekStrip />
      <ProgressBar />

      {/* Lista de hábitos pendentes */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] tracking-[0.2em] font-mono text-[#282828]">
            HÁBITOS — {doneToday}/{totalHabits} CONCLUÍDOS
          </span>
          <button
            onClick={() => setShowForm(o => !o)}
            className="text-xs px-3 py-1.5 rounded-md transition-all hover:opacity-80"
            style={{ border: `1px solid ${tc}44`, color: tc, background: "transparent" }}
          >
            {showForm ? "✕ Cancelar" : "+ Adicionar"}
          </button>
        </div>

        {showForm && (
          <div className="flex gap-2 mb-3">
            <input
              autoFocus
              placeholder="Nome do hábito..."
              value={newHabit}
              onChange={e => setNewHabit(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()}
              className="flex-1 bg-[#0e0e0e] rounded-lg px-4 py-2.5 text-sm text-[#ccc] outline-none border border-[#222] focus:border-[#444] transition-colors"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2.5 rounded-lg text-sm font-bold text-black transition-opacity hover:opacity-80"
              style={{ background: tc }}
            >
              Criar
            </button>
          </div>
        )}

        {/* Todos concluídos hoje */}
        {topicHabits.length === 0 && totalHabits > 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 opacity-60">
            <span className="text-4xl">🎉</span>
            <p className="text-sm font-medium" style={{ color: tc }}>
              Todos os hábitos concluídos hoje!
            </p>
            <p className="text-xs text-[#333]">Volte amanhã para uma nova sequência.</p>
          </div>
        ) : topicHabits.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 opacity-30">
            <span className="text-3xl">{topic?.icon}</span>
            <p className="text-sm text-[#333]">Nenhum hábito nesta categoria</p>
          </div>
        ) : (
          topicHabits.map(h => <HabitCard key={h.id} habit={h} />)
        )}
      </div>

      {/* Última anotação */}
      <div className="bg-[#0a0a0a] border border-[#141414] rounded-2xl p-5">
        <p className="text-[10px] tracking-[0.2em] font-mono text-[#222] mb-3">
          ÚLTIMA ANOTAÇÃO
        </p>

        {!lastNote ? (
          <p className="text-sm text-[#222]">Sem anotações ainda.</p>
        ) : (
          <div style={{ borderLeft: `2px solid ${tc}` }} className="pl-3">
            <p className="text-sm text-[#555] leading-relaxed mb-2">{lastNote.text}</p>
            <span className="text-[10px] font-mono text-[#2a2a2a]">{lastNote.date ?? ''}</span>
          </div>
        )}

        <button
          onClick={() => navigate('/notes')}
          className="text-xs font-medium mt-3 transition-opacity hover:opacity-70"
          style={{ color: tc, background: "transparent", border: "none", cursor: "pointer" }}
        >
          Ver todas as anotações →
        </button>
      </div>
    </div>
  )
}