import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import {TOPICS} from './data/topics'
import { useEffect, useState } from 'react'
import  Sidebar  from './components/Sidebar'
import  Dashboard  from './components/Dashboard'
import  Calendar  from './components/Calendar'
import  Notes  from './components/Notes'
import Login from './components/Login'
import { supabase } from './lib/supabase'

const PAGE_LABELS = {
  '/':         'PROGRESSO DO DIA',
  '/calendar': 'HISTÓRICO MENSAL',
  '/notes':    'ANOTAÇÕES',
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="text-center">
        <span className="font-['Bebas_Neue'] text-4xl text-white tracking-widest">
            DYNAMIC
        </span>
        <span className="font-['Bebas_Neue] text-4xl text-[#ff6b35] tracking-widest">
            HABIT
        </span>
        <div className="mt-4 w-8 bg-[#ff6b35] mx-auto animate-pulse rounded-full"/>
      </div>
    </div>
  )
}

function AppContext({user}) {
  const {activeTopic, loading} = useApp()
  const topic = TOPICS.find(t => t.id === activeTopic)
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)

  },[location.pathname, activeTopic])

  useEffect(() => {
    document.body.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])
  
  if(loading) return <LoadingScreen />

  return (
    <div className="flex min-h-screen bg-[#080808] font-['DM_Sans'] relative">
      {sidebarOpen && (
        <div 
        className="fixed inset-0 bg-black/70 z-20 md:hidden"
        onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:z-auto md:h-auto md:shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar user={user} onClose={() => setSidebarOpen(false)}/>
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <header className="flex items-start justify-between px-5 pt-6 pb-0 md:px-8 md:pt-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <button 
                onClick={() => setSidebarOpen(true)}
                className="md:hidden w-9 h-9 flex flex-col items-center justify-center
                 gap-[5px] rounded-lg bg-[#0e0e0e] border border-[#1e1e1e] shrink-0"
                > 
                  <span className="w-4 h-[1.5px] bg-[#555] rounded-full"/>
                  <span className="w-4 h-[1.5px] bg-[#555] rounded-full"/>
                  <span className="w-3 h-[1.5px] bg-[#555] rounded-full"/>
                </button>
                <span className="text-2xl md:text-3xl">
                  {topic?.icon}
                </span>
                <h1 className="font-['Bebas_Neue'] text-3xl md:text-4xl tracking-[0.12em] leading-none transition-colors duration-300"
                style={{color: topic?.color}}
                >
                  {topic?.label}
                </h1>
              </div>
              <p className="text-[10px] font-mono text-[#2a2a2a]">
                {PAGE_LABELS[location.pathname] ?? 'PROGRESSO DO DIA'}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#252525] flex items-center justify-center overflow-hidden">
                {user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover"/>
                : <span className="text-xs text-[#555]">{user.email?.[0]?.toUpperCase()}</span>}
              </div>
            </div>
          </header>

          <div className="flex-1 px-5 pt-5 pb-8 md:px-8 md:pt-6 max-w-2xl w-full">
            <Routes>
              <Route path="/" element={<Dashboard />}/>
              <Route path="/calendar" element={<Calendar />}/>
              <Route path="/notes" element={<Notes />}/>
            </Routes>
          </div>
      </main>
    </div>
  )

  export default function App() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      supabase.auth.getSession().then(({data: {session}}) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })

      const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe() 
    },[])

    if(loading) return <LoadingScreen />
    if(!user) return <Login />

    return (
      <AppProvider userId={user.id}>
        <BrowserRouter>
          <AppContext user={user}/>
        </BrowserRouter>
      </AppProvider>
    )
  }
}