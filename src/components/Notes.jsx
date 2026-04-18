import { useState } from "react";
import { TOPICS } from "../data/topics";
import NoteCard from "./NoteCard";
import { useApp } from "../context/AppContext";

export default function Notes() {
    const {notes, activeTopic, addNote} = useApp()
    const [text, setText] = useState('')
    const [showForm, setShowForm] = useState(false)
    const tc = TOPICS.find(t => t.id === activeTopic)?.color
    const topicNotes = notes.filter(n  => n.topic === activeTopic)

    const handleAdd = () => {
        if(!text.trim()) return
        addNote(text.trim(), activeTopic)
        setText('')
        setShowForm(false)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <span className="text-[10px] tracking-[0.2em] font-mono text-[#242424]">
                    ANOTAÇÔES — {TOPICS.find(t => t.id === activeTopic)?.label}
                </span>
                <button className="text-xs px-3 py-1.5 rounded-md transition-all hover:opacity-80"
                onClick={() => setShowForm(o => !o)}
                style={{border: `1px solid ${tc}44`, color: tc, background: "transparent"}}>
                    {showForm ? "✕ Fechar" : "+ Nova nota"}
                </button>
            </div>

            {showForm && (
                <div className="flex flex-col gap-2 mb-4">
                    <textarea 
                    autoFocus
                    placeholder="Escreva sua anotação..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={4}
                    className="bg-[#0e0e0e] border border-[#222] rounded-xl px-1 py-3 text-sm text-[#ccc] outline-none resize-y focus:border-[#444] transition-colors"/>
                    <button className="self-start px-5 py-2.5 rounded-lg text-sm font-bold text-black hover:opacity-80 transition-opacity"
                    style={{background: tc}}
                    onClick={handleAdd}>
                        Salvar Notas
                    </button>
                </div>
            )}

            {topicNotes.length === 0 ? <div className="flex flex-col items-center gap-3 py-16 opacity-30">
                <span className="text-4xl">📝</span>
                <p className="text-sm text-[#333]">Sem anotações ainda. Crie a primeira!</p>
            </div> : [...topicNotes].reverse().map(n => <NoteCard key={n.id} note={n} />)}
        </div>
    )
}