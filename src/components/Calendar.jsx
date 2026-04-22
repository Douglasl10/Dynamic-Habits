import { useState } from "react"
import { useApp } from "../context/AppContext"
import { DAYS_PT, MONTHS_PT, TOPICS } from "../data/topics"

// Fix: era ".date()" em todo arquivo, correto é "new Date()"
const todayStr = new Date().toLocaleDateString('en-CA')

export default function Calendar() {
  const { habits, activeTopic, completionsForHabit } = useApp()
  const [calDate, setCalDate] = useState(new Date())
  const tc          = TOPICS.find(t => t.id === activeTopic)?.color
  const topicHabits = habits.filter(h => h.topic === activeTopic)

  const year        = calDate.getFullYear()
  const month       = calDate.getMonth()
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const calDays     = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ]

  const dateStr = (day) =>
    day
      ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      : null

  const pctForDay = (ds) => {
    if (!ds || !topicHabits.length) return 0
    const done = topicHabits.filter(h =>
      completionsForHabit(h.id).includes(ds)
    ).length
    return done / topicHabits.length
  }

  return (
    <div className="max-w-3xl">
      {/* Navegação mês */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCalDate(new Date(year, month - 1, 1))}
          className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-lg text-[#444] px-4 py-2 hover:text-[#666] transition-colors"
        >←</button>

        <h2 className="font-['Bebas_Neue'] text-3xl tracking-widest" style={{ color: tc }}>
          {MONTHS_PT[month]} {year}
        </h2>

        <button
          onClick={() => setCalDate(new Date(year, month + 1, 1))}
          className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-lg text-[#444] px-4 py-2 hover:text-[#666] transition-colors"
        >→</button>
      </div>

      {/* Grade */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {DAYS_PT.map(d => (
          <div key={d} className="text-center text-[10px] font-mono text-[#242424] py-1">
            {d}
          </div>
        ))}

        {calDays.map((day, i) => {
          const ds      = dateStr(day)
          const pct     = pctForDay(ds)
          const isToday = ds === todayStr

          return (
            <div
              key={i}
              className="aspect-square rounded-lg flex flex-col items-center justify-center p-1 transition-all"
              style={{
                background: !day
                  ? 'transparent'
                  : pct > 0
                    ? tc + Math.round(pct * 50 + 8).toString(16).padStart(2, '0')
                    : '#0d0d0d',
                border:  isToday ? `1px solid ${tc}` : '1px solid #151515',
                opacity: day ? 1 : 0,
              }}
            >
              {day && (
                <>
                  <span className="text-[11px] font-mono" style={{ color: isToday ? tc : '#383838' }}>
                    {day}
                  </span>
                  {pct > 0 && (
                    <div className="w-4/5 h-0.5 bg-black/30 rounded-full mt-1">
                      <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, background: tc }} />
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Legenda */}
      <div className="flex gap-5 mb-6">
        {[
          { l: 'Sem registro', bg: '#0d0d0d' },
          { l: 'Parcial',      bg: tc + '44' },
          { l: '100%',         bg: tc        },
        ].map(item => (
          <div key={item.l} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: item.bg }} />
            <span className="text-[10px] font-mono text-[#2a2a2a]">{item.l}</span>
          </div>
        ))}
      </div>

      {/* Consistência mensal */}
      <div className="bg-[#0a0a0a] border border-[#141414] rounded-2xl p-5">
        <p className="text-[10px] tracking-[0.2em] font-mono text-[#222] mb-4">
          CONSISTENCIA DO MES
        </p>

        {topicHabits.length === 0 && (
          <p className="text-sm text-[#222]">Sem habitos nesta categoria.</p>
        )}

        {topicHabits.map(h => {
          const completions = completionsForHabit(h.id)
          const mDays = Array.from({ length: daysInMonth }, (_, i) =>
            `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
          )
          const cnt = mDays.filter(d => completions.includes(d)).length
          const pct = Math.round(cnt / daysInMonth * 100)

          return (
            <div key={h.id} className="flex items-center gap-4 py-2.5 border-b border-[#0f0f0f]">
              <span className="flex-1 text-sm text-[#555]">{h.name}</span>
              <div className="w-28 h-[3px] bg-[#181818] rounded-full">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: tc }}
                />
              </div>
              <span className="text-[10px] font-mono w-8 text-right" style={{ color: tc }}>
                {cnt}d
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}