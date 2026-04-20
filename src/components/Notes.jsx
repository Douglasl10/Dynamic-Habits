import { useApp } from "../context/AppContext"
import { TOPICS } from "../data/topics"

export default function NoteCard({ note }) {
  const { removeNote, activeTopic } = useApp()
  const tc       = TOPICS.find(t => t.id === activeTopic)?.color
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div
      className="rounded-xl p-4 mb-2.5 hover:-translate-y-0.5 transition-all"
      style={{
        background: "#0d0d0d",
        borderLeft: `3px solid ${tc}`,
      }}
    >
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[10px] font-mono" style={{ color: tc }}>
          {note.date === todayStr ? "HOJE" : note.date}
        </span>
        <button
          onClick={() => removeNote(note.id)}
          className="text-[#222] hover:text-red-500 transition-colors text-xs p-1"
        >
          ✕
        </button>
      </div>
      <p className="text-sm text-[#888] leading-relaxed">{note.text}</p>
    </div>
  )
}