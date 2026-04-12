import { useStore } from "../store/useStore"
import { DAYS_PT, TOPICS } from "../data/topics"

const today = new Date()
const todayStr = today.toISOString().split('T')[0]

function getWeekDates() {
    const start = new Date(today)
    start.setDate(today.getDate() - today.getDate())

    return Array.from({length: 7}, (_, i) => {
        const d = new Date(start)
        d.setDate(start.getDate() + i)

        return d.toISOString().split('T')[0]
    })
}

export default function WeekStrip() {
    const {habits, activeTopic} = useStore()
    const tc = TOPICS.find(t => t.id === activeTopic)?.color
    const topicHabits = habits.filter(h => h.topic === activeTopic) 
    const weekDates = getWeekDates()

    return (
        <div className="flex gap-2 bg-[#0a0a0a] border border-[#141414] rounded-2xl p-4 mb-5">
            {weekDates.map((date, i) => {
                const d = new Date(date)
                const isToday = date === todayStr
                const isFuture = d > today
                const pct = topicHabits.length ? topicHabits.filter(h => h.completedDates.includes(date)).length / topicHabits.length : 0

                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5" style={{opacity: isFuture ? 0.25 : 1}}>
                        <span className="text-[9px] font-mono text-[#2e2e2e]">
                            {DAYS_PT[d.getDay()]}
                        </span>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center relative overflow-hidden"
                        style={{border: `2px solid ${isToday ? tc : "#1a1a1a"}`, background: "#111"}}>
                            <div className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                            style={{height: `${pct * 100}%`, background: tc + '70'}} />
                            <span className="relative text-xs" style={{color: isToday ? tc : "#444", fontFamily: "Bebas Neue"}}>
                                {d.getDate()}
                            </span>
                        </div>
                        {isToday && <div className="w-1 h-1 rounded-full" style={{background: tc}}/>}
                    </div>
                )
            })}
        </div>
    )
}