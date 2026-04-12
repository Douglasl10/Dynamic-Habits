import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useStore } from './store/useStore'
import { TOPICS } from './data/topics'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Calendar from './components/Calendar'
import Notes from './components/Notes'

const PAGE_LABELS = {
  '/':         'PROGRESSO DO DIA',
  '/calendar': 'HISTÓRICO MENSAL',
  '/notes':    'ANOTAÇÕES',
}

function AppContent() {
  const { activeTopic } = useStore()
  const topic = TOPICS.find(t => t.id === activeTopic)
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Fecha a sidebar ao trocar de página no mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname, activeTopic])

  // Trava o scroll do body quando o drawer está aberto
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <div className="flex min-h-screen bg-[#080808] font-['DM_Sans'] relative">

      {/* ── Overlay escuro (só mobile, quando aberto) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <div
        className={`
          fixed top-0 left-0 h-full z-30 transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:z-auto md:h-auto md:shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Conteúdo principal ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Header — visível sempre */}
        <header className="flex items-start justify-between px-5 pt-6 pb-0 md:px-8 md:pt-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {/* Botão hambúrguer — só aparece no mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg bg-[#0e0e0e] border border-[#1e1e1e] shrink-0"
                aria-label="Abrir menu"
              >
                <span className="w-4 h-[1.5px] bg-[#555] rounded-full" />
                <span className="w-4 h-[1.5px] bg-[#555] rounded-full" />
                <span className="w-3 h-[1.5px] bg-[#555] rounded-full" />
              </button>

              <span className="text-2xl md:text-3xl">{topic?.icon}</span>
              <h1
                className="font-['Bebas_Neue'] text-3xl md:text-4xl tracking-[0.12em] leading-none transition-colors duration-300"
                style={{ color: topic?.color }}
              >
                {topic?.label}
              </h1>
            </div>
            <p className="text-[10px] font-mono text-[#2a2a2a] ml-0 md:ml-1">
              {PAGE_LABELS[location.pathname] ?? 'PROGRESSO DO DIA'}
            </p>
          </div>
        </header>

        {/* Páginas */}
        <div className="flex-1 px-5 pt-5 pb-8 md:px-8 md:pt-6 max-w-2xl w-full">
          <Routes>
            <Route path="/"         element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/notes"    element={<Notes />} />
          </Routes>
        </div>

      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}