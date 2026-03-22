import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthPanel() {
  const { user, loading, isConfigured, signIn, signUp, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!isConfigured) {
    return (
      <div className="mt-8 rounded-2xl border border-zinc-700/80 bg-black/35 px-4 py-3 text-center text-xs text-zinc-400 backdrop-blur-sm">
        Add <code className="text-zinc-300">VITE_SUPABASE_URL</code> and{' '}
        <code className="text-zinc-300">VITE_SUPABASE_ANON_KEY</code> in{' '}
        <code className="text-zinc-300">.env</code>, then run the SQL in{' '}
        <code className="text-zinc-300">supabase/migrations/001_sessions.sql</code>{' '}
        in the Supabase SQL editor.
      </div>
    )
  }

  if (loading) {
    return (
      <p className="mt-8 text-center text-xs text-zinc-500">Checking account…</p>
    )
  }

  if (user) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/25 px-4 py-4 text-center">
        <p className="text-sm text-emerald-100/90">
          Signed in as <span className="font-medium">{user.email}</span>
        </p>
        <p className="text-xs text-zinc-500">History syncs via Supabase.</p>
        <button
          type="button"
          onClick={() => {
            setError('')
            signOut()
          }}
          className="rounded-xl border border-zinc-600 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-500"
        >
          Sign out
        </button>
      </div>
    )
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signIn(email.trim(), password)
      setPassword('')
    } catch (err) {
      setError(err.message ?? 'Sign in failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleSignUp(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signUp(email.trim(), password)
      setPassword('')
      setError('If email confirmation is on, check your inbox.')
    } catch (err) {
      setError(err.message ?? 'Sign up failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-zinc-700/80 bg-black/40 px-4 py-4 backdrop-blur-sm sm:px-5">
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-zinc-500">
        Supabase — sign in to sync history
      </p>
      <form className="flex flex-col gap-3" onSubmit={handleSignIn}>
        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-zinc-600 bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-zinc-600 bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none"
        />
        {error && (
          <p className="text-center text-xs text-amber-300/95">{error}</p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-emerald-600/80 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            Sign in
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleSignUp}
            className="rounded-xl border border-zinc-600 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-200 hover:border-zinc-500 disabled:opacity-50"
          >
            Create account
          </button>
        </div>
      </form>
    </div>
  )
}
