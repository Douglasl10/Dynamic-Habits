import { TOPICS } from "../data/topics";
import { NavLink } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useApp } from "../context/AppContext";

export default function Sidebar({ onClose }) {
  const { activeTopic, setActiveTopic, habits, isCompleted } = useApp();
  const todayStr = new Date().toLocaleDateString('en-CA');
  const tc = TOPICS.find((t) => t.id === activeTopic)?.color;

  return (
    <aside className="w-56 h-full min-h-screen bg-[#090909] border-r border-[#141414] flex flex-col py-6 overflow-y-auto">

    
      <div className="px-5 pb-5 border-b border-[#141414] mb-5 flex items-center justify-between">
        <div>
          <span className="font-['Bebas_Neue'] text-3xl text-white tracking-widest">
            DYNAMIC
          </span>
          <span
            className="font-['Bebas_Neue'] text-3xl tracking-widest transition-colors duration-300"
            style={{ color: tc }}
          >
            HABITS
          </span>
        </div>

        <button
          onClick={onClose}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-[#141414] border border-[#1e1e1e] text-[#444] hover:text-[#888] transition-colors text-sm"
          aria-label="Fechar menu"
        >
          ✕
        </button>
      </div>

    
      <nav className="flex flex-col gap-1 px-3 mb-5">
        {[
          { to: "/",         icon: "◈", label: "Dashboard"  },
          { to: "/calendar", icon: "◻", label: "Calendário" },
          { to: "/notes",    icon: "◉", label: "Anotações"  },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
               ${isActive
                 ? "bg-white/5 border-l-2"
                 : "text-[#444] border-l-2 border-transparent hover:text-[#666]"
               }`
            }
            style={({ isActive }) =>
              isActive ? { borderLeftColor: tc, color: tc } : {}
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="h-px bg-[#141414] mx-4 mb-4" />

     
      <div className="flex flex-col gap-1.5 px-3 flex-1 overflow-y-auto">
        <p className="text-[10px] text-[#252525] tracking-[0.2em] font-mono px-1 mb-2">
          CATEGORIAS
        </p>
        {TOPICS.map((t) => {
          const topicHabits = habits.filter((h) => h.topic === t.id)
          const total = topicHabits.length

          
          const done = topicHabits.filter((h) => isCompleted(h.id, todayStr)).length

          return (
            <button
              key={t.id}
              onClick={() => setActiveTopic(t.id)}
              className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: activeTopic === t.id ? t.color + "18" : "#0e0e0e",
                border: `1px solid ${activeTopic === t.id ? t.color + "55" : "#181818"}`,
                color: activeTopic === t.id ? t.color : "#3a3a3a",
              }}
            >
              <span className="text-base shrink-0">{t.icon}</span>
              <span className="flex-1 text-[11px] font-semibold tracking-wide">
                {t.label}
              </span>
              {total > 0 && (
                <span className="text-[10px] font-mono opacity-60">
                  {done}/{total}
                </span>
              )}
            </button>
          )
        })}
      </div>

    
      <div className="px-5 pt-4 border-t border-[#141414] mt-3 flex flex-col gap-3">
        <p className="text-[10px] text-[#222] font-mono leading-relaxed">
          {new Date()
            .toLocaleDateString("pt-BR", { weekday: "long" })
            .toUpperCase()}
          <br />
          {new Date().toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
          })}
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-[10px] font-mono text-[#2a2a2a] hover:text-red-500/60 transition-colors text-left"
        >
          → sair da conta
        </button>
      </div>
    </aside>
  );
}