import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const KEY = 'sadhana_sessions_v1'
const MAX = 200

function loadLocalSessions() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveLocalSessions(list) {
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)))
}

function useCloud(user) {
  return Boolean(isSupabaseConfigured && supabase && user?.id)
}

function mapRow(row) {
  return {
    id: row.id,
    endedAt: row.ended_at,
    sessionName: row.session_name,
    totalQuestions: row.total_questions,
    timePerQuestion: row.time_per_question,
    questions: row.questions,
  }
}

export function finalizeSessionState(state) {
  const cur = state.currentQuestion
  return {
    ...state,
    questions: state.questions.map((q) => {
      if (q.id !== cur) return q
      if (q.status === 'completed') return q
      return { ...q, status: 'attempted' }
    }),
  }
}

export async function mergeLocalSessionsToRemote(user) {
  if (!useCloud(user)) return
  const local = loadLocalSessions()
  for (const r of local) {
    const { data: existing } = await supabase
      .from('sessions')
      .select('id')
      .eq('id', r.id)
      .maybeSingle()
    if (existing) continue
    const { error } = await supabase.from('sessions').insert({
      id: r.id,
      user_id: user.id,
      ended_at: r.endedAt,
      session_name: r.sessionName,
      total_questions: r.totalQuestions,
      time_per_question: r.timePerQuestion,
      questions: r.questions,
    })
    if (error) console.error('merge session', r.id, error.message)
  }
}

export async function loadSessions(user) {
  if (useCloud(user)) {
    const { data, error } = await supabase
      .from('sessions')
      .select(
        'id, ended_at, session_name, total_questions, time_per_question, questions'
      )
      .eq('user_id', user.id)
      .order('ended_at', { ascending: false })
    if (error) {
      console.error('loadSessions', error.message)
      return loadLocalSessions()
    }
    return (data ?? []).map(mapRow)
  }
  return loadLocalSessions()
}

export async function saveSession(finalizedState, user) {
  const id = crypto.randomUUID()
  const record = {
    id,
    endedAt: new Date().toISOString(),
    sessionName: finalizedState.sessionName,
    totalQuestions: finalizedState.totalQuestions,
    timePerQuestion: finalizedState.timePerQuestion,
    questions: finalizedState.questions,
  }

  if (useCloud(user)) {
    const { error } = await supabase.from('sessions').insert({
      id: record.id,
      user_id: user.id,
      ended_at: record.endedAt,
      session_name: record.sessionName,
      total_questions: record.totalQuestions,
      time_per_question: record.timePerQuestion,
      questions: record.questions,
    })
    if (error) {
      console.error('saveSession cloud', error.message)
      const list = loadLocalSessions()
      list.unshift(record)
      saveLocalSessions(list)
      return id
    }
    return id
  }

  const list = loadLocalSessions()
  list.unshift(record)
  saveLocalSessions(list)
  return id
}

export async function getSessionById(id, user) {
  if (useCloud(user)) {
    const { data, error } = await supabase
      .from('sessions')
      .select(
        'id, ended_at, session_name, total_questions, time_per_question, questions'
      )
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    if (error) {
      console.error('getSessionById', error.message)
      return loadLocalSessions().find((s) => s.id === id) ?? null
    }
    return data ? mapRow(data) : null
  }
  return loadLocalSessions().find((s) => s.id === id) ?? null
}

export async function updateSessionName(id, sessionName, user) {
  const nextName = String(sessionName ?? '').trim()
  if (!nextName) return

  if (useCloud(user)) {
    const { error } = await supabase
      .from('sessions')
      .update({ session_name: nextName })
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) console.error('updateSessionName', error.message)
    return
  }

  const list = loadLocalSessions().map((s) =>
    s.id === id ? { ...s, sessionName: nextName } : s
  )
  saveLocalSessions(list)
}

export async function deleteSession(id, user) {
  if (useCloud(user)) {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) console.error('deleteSession', error.message)
    return
  }
  const list = loadLocalSessions().filter((s) => s.id !== id)
  saveLocalSessions(list)
}
