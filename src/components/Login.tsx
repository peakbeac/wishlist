import { useState, type FormEvent } from 'react'
import { PEOPLE, SITE_NAME, SITE_TAGLINE } from '../config'
import { loginAsAdmin, loginAsPerson } from '../lib/session'
import type { Session } from '../types'

type Props = {
  onLogin: (session: Session) => void
}

export function Login({ onLogin }: Props) {
  const [personId, setPersonId] = useState(PEOPLE[0]?.id ?? '')
  const [pin, setPin] = useState('')
  const [asAdmin, setAsAdmin] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (asAdmin) {
      const session = loginAsAdmin(pin)
      if (!session) {
        setError('That admin PIN is not right.')
        return
      }
      onLogin(session)
      return
    }
    const session = loginAsPerson(personId, pin)
    if (!session) {
      setError('That PIN does not match this person.')
      return
    }
    onLogin(session)
  }

  return (
    <div className="login-page">
      <div className="login-atmosphere" aria-hidden="true" />
      <main className="login-card">
        <p className="brand">{SITE_NAME}</p>
        <h1>Sign in to shop &amp; share</h1>
        <p className="lede">{SITE_TAGLINE}. Pick who you are, enter your PIN, then browse everyone’s lists.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={asAdmin}
              onChange={(e) => setAsAdmin(e.target.checked)}
            />
            <span>Admin (remove items)</span>
          </label>

          {!asAdmin && (
            <label>
              <span>I am</span>
              <select value={personId} onChange={(e) => setPersonId(e.target.value)}>
                {PEOPLE.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label>
            <span>{asAdmin ? 'Admin PIN' : 'Your PIN'}</span>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              required
            />
          </label>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" className="btn primary">
            Enter Wishwell
          </button>
        </form>
      </main>
    </div>
  )
}
