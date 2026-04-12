import { useStore } from "../store/useStore"
import { TOPICS } from "../data/topics"
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const { activeTopic, setActiveTopic, habits } = useStore()

    return (
        <aside className="w-56 min-h-screen bg-[#090909] border-r border-[#141414] flex flex-col py-6 shrink-0">
            <div className="px-5 pb-5 border-b border-[#141414] mb-6">
                <span className="font-['bebas_Neue'] text-3xl text-white tracking-widest">
                    DYNAMIC
                </span>
                <span className="font-['Bebas_Neue'] text-3xl tracking-widest transition-colors duration-300"
                style={{color: TOPICS.find(t => t.id === activeTopic) ?.color}}>HABITS</span>
            </div>

            <nav className="flex flex-col gap-1 px-3 mb-5">
                {[
                    {to: "/", icon: "◈", label: "Dashboard"},
                    {to: "/calendar", icon: "◻", label: "Calendário"},
                    {to: "/notas", icon: "◉", label: "Anotações"}
                ].map(item => (
                    <NavLink key={item.to} to={item.to} end className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${isActive ? "text-white bg-white/5 border-1-2" : "text-[#444] border-1-2 border-transparent hover:text-[#666]"}`
                    }
                    style={({isActive}) => isActive ? {borderLeftColor: TOPICS.find(t => t.id === activeTopic)?.color, color: TOPICS.find(t => t.id === activeTopic)?.color} : {}}>
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="h-px bg-[#141414] mx-4 mb-4"/>

            <div className="flex flex-col gap-1.5 px-3 flex-1 overflow-y-auto">
                <p className="text-[10px] text-[#252525] tracking-[0.2em] font-mono px-1 mb-2">
                    CATEGORIAS
                </p>
                {TOPICS.map(t => {
                    const done = habits.filter(h => h.topic === t.id && h.completedDates.includes(new Date().toISOString().split('T')[0])).length
                    const total = habits.filter(h => h.topic === t.id).length
                    return (
                        <button key={t.id} onClick={() => setActiveTopic(t.id)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all hover:scale-[1.02]"
                        style={{background: activeTopic === t.id ? t.color + "18" : "#0e0e0e",
                            border: `1px solid ${activeTopic === t.id ? t.color + "55" : "#181818"}`,
                            color: activeTopic === t.id ? t.color : "#3a3a3a",
                        }}>
                            <span className="text-base shrink-0">{t.icon}</span>
                            <span className="flex-1 text-[11px] font-semibold tracking-wide">{t.label}</span>
                            {total > 0 && (
                                <span className="text-[10px] font-mono opacity-60">{done}/{total}</span>
                            )}
                        </button>
                    )
                })}
            </div>

            <div className="px-5 pt-4 border-t border-[#141414] mt-3">
                <p className="text-[10px] text-[#222] font-mono leading-relaxed">
                    {new Date().toLocaleDateString('pt-BR', {weekday: 'long'}).toUpperCase()}<br/>
                    {new Date().toLocaleDateString('pt-BR', {day: 'numeric', month: 'long'})}
                </p>    
            </div>
        </aside>
    )
}
