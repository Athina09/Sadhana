import {
  createContext,
  useContext,
  useReducer,
  useMemo,
} from 'react'

const SessionContext = createContext(null)

function buildQuestions(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    status: 'unseen',
    markedImportant: false,
    markedReview: false,
    secondsSpent: null,
  }))
}

function sessionReducer(state, action) {
  switch (action.type) {
    case 'START_SESSION': {
      const { sessionName, totalQuestions, timePerQuestion } = action.payload
      return {
        sessionName,
        totalQuestions,
        currentQuestion: 1,
        timePerQuestion,
        isPaused: false,
        questions: buildQuestions(totalQuestions),
      }
    }
    case 'TOGGLE_PAUSE':
      return { ...state, isPaused: !state.isPaused }
    case 'NEXT': {
      if (state.currentQuestion >= state.totalQuestions) return state
      const cur = state.currentQuestion
      const next = cur + 1
      return {
        ...state,
        currentQuestion: next,
        questions: state.questions.map((q) =>
          q.id === cur && q.status !== 'completed'
            ? { ...q, status: 'attempted' }
            : q
        ),
      }
    }
    case 'COMPLETE_QUESTION': {
      const { secondsSpent } = action.payload
      const cur = state.currentQuestion
      const spent = Math.max(0, Math.floor(Number(secondsSpent) || 0))
      const questions = state.questions.map((q) =>
        q.id === cur ? { ...q, status: 'completed', secondsSpent: spent } : q
      )
      if (cur < state.totalQuestions) {
        return {
          ...state,
          questions,
          currentQuestion: cur + 1,
          isPaused: false,
        }
      }
      return {
        ...state,
        questions,
        isPaused: true,
      }
    }
    case 'PREV': {
      if (state.currentQuestion <= 1) return state
      return {
        ...state,
        currentQuestion: state.currentQuestion - 1,
      }
    }
    case 'TOGGLE_IMPORTANT': {
      const id = action.payload
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === id ? { ...q, markedImportant: !q.markedImportant } : q
        ),
      }
    }
    case 'TOGGLE_REVIEW': {
      const id = action.payload
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === id ? { ...q, markedReview: !q.markedReview } : q
        ),
      }
    }
    case 'MARK_CURRENT_ATTEMPTED': {
      const cur = state.currentQuestion
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === cur ? { ...q, status: 'attempted' } : q
        ),
      }
    }
    case 'END_SESSION':
      return {
        sessionName: '',
        totalQuestions: 0,
        currentQuestion: 1,
        timePerQuestion: 120,
        isPaused: false,
        questions: [],
      }
    default:
      return state
  }
}

const emptyState = {
  sessionName: '',
  totalQuestions: 0,
  currentQuestion: 1,
  timePerQuestion: 120,
  isPaused: false,
  questions: [],
}

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, emptyState)

  const value = useMemo(() => ({ state, dispatch }), [state])

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
