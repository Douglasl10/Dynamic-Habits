import { useState } from "react"
import { TOPICS } from "../data/topics"
import { useApp } from "../context/AppContext"

export default function HabitCard({ habit }) {
  
  const { toggleHabit, removeHabit, activeTopic, isCompleted } = useApp()
  const [popping, setPopping] = useState(false)
  const tc   = TOPICS.find(t => t.id === activeTopic)?.color
  const done = isCompleted(habit.id)

  const handleToggle = () => {
    setPopping(true)
   
    setTimeout(() => setPopping(false), 400)
    toggleHabit(habit)
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all hover:-translate-y-0.5"
      style={{
       
        background: done ? tc + "0d" : "#0d0d0d",
        border: `1px solid ${done ? tc + "44" : "#181818"}`,
      }}
    >
      <button
        onClick={handleToggle}
        className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center transition-all ${popping ? "scale-125" : "scale-100"}`}
        style={{
          background:  done ? tc : "transparent",
          border:     `2px solid ${done ? tc : "#282828"}`,
          boxShadow:   done ? `0 0 14px ${tc}55` : "none",
        }}
      >
        {done && <span className="text-black text-xs font-black">✓</span>}
      </button>

      
      <span
        className="flex-1 text-sm transition-colors"
        style={{ color: done ? "#ddd" : "#555" }}
      >
        {habit.name}
      </span>

      {habit.streak > 0 && (
        <div className="flex items-center gap-1 bg-[#141414] px-2 py-0.5 rounded-full">
          <span className="text-xs">🔥</span>
          <span className="text-xs font-mono text-[#ff6b35]">{habit.streak}</span>
        </div>
      )}

      <button
        onClick={() => removeHabit(habit.id)}
        className="text-[#222] hover:text-red-500 transition-colors text-xs p-1"
      >
        ✕
      </button>
    </div>
  )
}