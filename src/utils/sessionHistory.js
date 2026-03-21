const KEY = 'sadhana_sessions_v1'
const MAX = 200

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

export function loadSessions() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * @param {ReturnType<typeof finalizeSessionState>} finalizedState
 * @returns {string} new session id
 */
export function saveSession(finalizedState) {
  const id = crypto.randomUUID()
  const record = {
    id,
    endedAt: new Date().toISOString(),
    sessionName: finalizedState.sessionName,
    totalQuestions: finalizedState.totalQuestions,
    timePerQuestion: finalizedState.timePerQuestion,
    questions: finalizedState.questions,
  }
  const list = loadSessions()
  list.unshift(record)
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)))
  return id
}

export function getSessionById(id) {
  return loadSessions().find((s) => s.id === id) ?? null
}

export function deleteSession(id) {
  const list = loadSessions().filter((s) => s.id !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
}
