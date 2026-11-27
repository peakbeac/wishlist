import { ADMIN_PIN, PEOPLE } from '../config'
import type { Session } from '../types'

const SESSION_KEY = 'wishwell-session'

export function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (parsed.role === 'admin') return parsed
    if (parsed.role === 'person' && PEOPLE.some((p) => p.id === parsed.personId)) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

export function saveSession(session: Session): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

export function loginAsPerson(personId: string, pin: string): Session | null {
  const person = PEOPLE.find((p) => p.id === personId)
  if (!person || person.pin !== pin.trim()) return null
  const session: Session = { role: 'person', personId }
  saveSession(session)
  return session
}

export function loginAsAdmin(pin: string): Session | null {
  if (pin.trim() !== ADMIN_PIN) return null
  const session: Session = { role: 'admin' }
  saveSession(session)
  return session
}
