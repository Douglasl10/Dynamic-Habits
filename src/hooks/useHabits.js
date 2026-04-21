import { useCallback, useEffect, useState } from "react"

import { supabase } from "../lib/supabase"


const todayStr = new Date().toLocaleDateString('en-CA')

export function useHabits(userId) {
  const [habits,      setHabits]      = useState([])
  const [completions, setCompletions] = useState([])
  const [notes,       setNotes]       = useState([])
  const [loading,     setLoading]     = useState(true)

  const fetchAll = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    const [{ data: h }, { data: c }, { data: n }] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', userId).order('created_at'),
      supabase.from('habit_completions').select('habit_id, date').eq('user_id', userId),
      supabase.from('notes').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ])

    setHabits(h ?? [])
    setCompletions((c ?? []).map(r => `${r.habit_id}:${r.date}`))
    setNotes(n ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchAll() }, [fetchAll])

  const isCompleted = (habitId, date = todayStr) =>
    completions.includes(`${habitId}:${date}`)

  const completionsForHabit = (habitId) =>
    completions
      .filter(c => c.startsWith(habitId + ':'))
      .map(c => c.split(':')[1])

  const toggleHabit = async (habit) => {
    const done = isCompleted(habit.id)
    const key  = `${habit.id}:${todayStr}`

    setCompletions(prev =>
      done ? prev.filter(c => c !== key) : [...prev, key]
    )

    const newStreak = done ? Math.max(0, habit.streak - 1) : habit.streak + 1
    setHabits(prev =>
      prev.map(h => h.id === habit.id ? { ...h, streak: newStreak } : h)
    )

    if (done) {
      await supabase.from('habit_completions')
        .delete()
        .eq('habit_id', habit.id)
        .eq('date', todayStr)
    } else {
      await supabase.from('habit_completions')
        .upsert({
          habit_id: habit.id, user_id: userId, date: todayStr
        }, {
          onConflict: 'habit_id, date', ignoreDuplicates: true
        })
    } 

    await supabase.from('habits')
      .update({ streak: newStreak })
      .eq('id', habit.id)
  }

  const addHabit = async (name, topic) => {
    const { data, error } = await supabase.from('habits')
      .insert({ user_id: userId, topic, name, streak: 0 })
      .select()
      .single()
    if (!error && data) setHabits(prev => [...prev, data])
  }

  const removeHabit = async (id) => {
    setHabits(prev => prev.filter(h => h.id !== id))
    await supabase.from('habits').delete().eq('id', id)
  }

  const addNote = async (text, topic) => {
    const { data, error } = await supabase.from('notes')
      .insert({ user_id: userId, topic, text, date: todayStr })
      .select()
      .single()
    if (!error && data) setNotes(prev => [data, ...prev])
  }

  const removeNote = async (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    await supabase.from('notes').delete().eq('id', id)
  }

  return {
    habits,
    notes,
    loading,
    isCompleted,
    completionsForHabit,
    toggleHabit,
    addHabit,
    removeHabit,
    addNote,
    removeNote,
  }
}