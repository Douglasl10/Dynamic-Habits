import { useApp } from "../context/AppContext"
import { DAYS_PT, TOPICS } from "../data/topics"

const todayStr = new Date().toLocaleDateString('en-CA')

function getWeekDates() {
  const result = []
  // Pega o domingo da semana atual no fuso local
  const now = new Date()
  const dayOfWeek = now.getDay()

  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(now.getDate() - dayOfWeek + i)
    result.push(d.toLocaleDateString('en-CA'))
  }
  return result
}

// Extrai dia, mês e dia da semana de uma string 'YYYY-MM-DD' sem converter timezone
function parseDateStr(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day) // mês é 0-indexed, sem UTC
  return {
    day,
    dayOfWeek: d.getDay(),
  }
}

export default function WeekStrip() {
  const { habits, activeTopic, isCompleted } = useApp()
  const tc          = TOPICS.find(t => t.id === activeTopic)?.color
  const topicHabits = habits.filter(h => h.topic === activeTopic)
  const weekDates   = getWeekDates()

  return (
    <div className="flex gap-2 bg-[#0a0a0a] border border-[#141414] rounded-2xl p-4 mb-5">
      {weekDates.map((date, i) => {
        const { day, dayOfWeek } = parseDateStr(date)
        const isToday  = date === todayStr
        const isFuture = date > todayStr

        // Só conta hábitos que já existiam naquele dia
        const habitsOnDay = topicHabits.filter(h => {
          const createdAt = h.created_at
            ? new Date(h.created_at).toLocaleDateString('en-CA')
            : date
          return createdAt <= date
        })

        const pct = habitsOnDay.length
          ? habitsOnDay.filter(h => isCompleted(h.id, date)).length / habitsOnDay.length
          : 0

        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1.5"
            style={{ opacity: isFuture ? 0.25 : 1 }}
          >
            <span className="text-[9px] font-mono text-[#2e2e2e]">
              {DAYS_PT[dayOfWeek]}
            </span>

            <div
              className="w-9 h-9 rounded-full flex items-center justify-center relative overflow-hidden"
              style={{ border: `2px solid ${isToday ? tc : '#1a1a1a'}`, background: '#111' }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                style={{ height: `${pct * 100}%`, background: tc + '70' }}
              />
              <span
                className="relative text-xs"
                style={{ color: isToday ? tc : '#444', fontFamily: 'Bebas Neue' }}
              >
                {day}
              </span>
            </div>

            {isToday && (
              <div className="w-1 h-1 rounded-full" style={{ background: tc }} />
            )}
          </div>
        )
      })}
    </div>
  )
}