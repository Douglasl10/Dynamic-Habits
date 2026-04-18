
import { useApp } from "../context/AppContext"
import { TOPICS } from "../data/topics"

const todayStr = new Date().toISOString().split('T')[0]

export default function ProgressBar() {
    const {habits, activeTopic} = useApp()
    const tc = TOPICS.find(t => t.id === activeTopic)?.color
    const topicHabits = habits.filter(h => h.topic === activeTopic)
    const done = topicHabits.filter(h => h.completedDates.includes(todayStr)).length
    const pct = topicHabits.length ? Math.round(done / topicHabits.length * 100) : 0

    return (
        <div className="mb-6">
            <div className="h-[3px] bg-[#141414] rounded-full overflow-hidden mb-1.5">
                <div className="h-full rounded-full transition-all duration-700"
                style={{width: `${pct}%`, background: `linear-gradient(90deg, ${tc}66, ${tc})`, boxShadow: `0 0 10px ${tc}44`}} /> 
            </div>
            <span className="text-[10px] font-mono text-[#282828]">
                {done}/{topicHabits.length} CONCLUIDOS HOJE
            </span>
        </div>
    )
}