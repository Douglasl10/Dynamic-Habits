import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useStore } from "./store/useStore";
import { TOPICS } from "./data/topics";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import Notes from "./components/Notes";

export default function App() {
  const {activeTopic} = useStore()
  const topic = TOPICS.find(t => t.id === activeTopic)
 
  return (
    <BrowserRouter>
    <div className="flex min-h-screen bg-[#000000] font-['DM_Sans']">
      <Sidebar />

      <main className="flex-1 p-8 max-w-2xl overflow-y-auto">
        <header className="flex justify-between items-start mb-7">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">{topic?.icon}</span>
              <h1 className="font-['Bebas_Neue'] text-4xl tracking-[0.12em] leading-none transition-colors durantion-300"
              style={{color: topic?.color}}>
                {topic?.label}
              </h1>
            </div>
            <Routes>
              <Route path="/" element={<p className="text-[11px] font-mono text-[#2a2a2a]">PROGRESSO DO DIA</p>}/>
              <Route path="/calendar" element={<p className="text-[11px] font-mono text-[#2a2a2a]">HISTORICO MENSAL</p>}/>
              <Route path="/notas" element={<p className="text-[11px] font-mono text-[#2a2a2a]">ANOTAÇÕES</p>}/>
            </Routes>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/calendar" element={<Calendar />}/>
          <Route path="/notas" element={<Notes />}/>
        </Routes>
      </main>
    </div>
  </BrowserRouter> 
  )
}