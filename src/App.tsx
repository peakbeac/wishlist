import { useEffect, useMemo, useState } from 'react'
import { AddItemForm } from './components/AddItemForm'
import { ClaimModal } from './components/ClaimModal'
import { Login } from './components/Login'
import { WishlistView } from './components/WishlistView'
import { PEOPLE, SITE_NAME, getPerson } from './config'
import { clearSession, loadSession } from './lib/session'
import { claimItem, isCloudMode, removeItem, subscribeItems } from './lib/storage'
import { filterVisibleItems } from './lib/visibility'
import type { Session, WishlistItem } from './types'
import './App.css'

export default function App() {
  const [session, setSession] = useState<Session | null>(() => loadSession())
  const [items, setItems] = useState<WishlistItem[]>([])
  const [activeOwnerId, setActiveOwnerId] = useState(PEOPLE[0]?.id ?? '')
  const [claimTarget, setClaimTarget] = useState<WishlistItem | null>(null)

  useEffect(() => {
    return subscribeItems(setItems)
  }, [])

  const visibleForActive = useMemo(() => {
    if (!session) return []
    const owned = items.filter((item) => item.ownerId === activeOwnerId)
    return filterVisibleItems(owned, session)
  }, [items, activeOwnerId, session])

  if (!session) {
    return <Login onLogin={setSession} />
  }

  const self = session.role === 'person' ? getPerson(session.personId) : null
  const viewingOwn =
    session.role === 'person' && session.personId === activeOwnerId

  async function handleClaim(name: string) {
    if (!claimTarget || !session) return
    const personId = session.role === 'person' ? session.personId : null
    await claimItem(claimTarget.id, name, personId)
  }

  async function handleRemove(item: WishlistItem) {
    const label = item.claimedBy
      ? `"${item.title}" (claimed by ${item.claimedBy})`
      : `"${item.title}"`
    if (!window.confirm(`Remove ${label}?`)) return
    await removeItem(item.id)
  }

  function logout() {
    clearSession()
    setSession(null)
    setClaimTarget(null)
  }

  return (
    <div className="app-shell">
      <div className="page-atmosphere" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-block">
          <p className="brand">{SITE_NAME}</p>
          <p className="who">
            {session.role === 'admin'
              ? 'Signed in as admin'
              : `Signed in as ${self?.name ?? 'guest'}`}
          </p>
        </div>
        <button type="button" className="btn ghost compact" onClick={logout}>
          Sign out
        </button>
      </header>

      {!isCloudMode() && (
        <p className="demo-banner" role="status">
          Demo mode — data stays in this browser until you add Firebase (see README).
        </p>
      )}

      <nav className="people-nav" aria-label="Wishlists">
        {PEOPLE.map((person) => (
          <button
            key={person.id}
            type="button"
            className={`person-tab ${activeOwnerId === person.id ? 'active' : ''}`}
            onClick={() => setActiveOwnerId(person.id)}
          >
            {person.name}
          </button>
        ))}
      </nav>

      <main className="main-grid">
        <WishlistView
          ownerId={activeOwnerId}
          items={visibleForActive}
          session={session}
          onClaim={viewingOwn ? undefined : setClaimTarget}
          onRemove={handleRemove}
        />

        {viewingOwn && self && (
          <AddItemForm ownerId={self.id} ownerName={self.name} />
        )}

        {session.role === 'admin' && (
          <section className="panel admin-note">
            <h2>Admin</h2>
            <p className="section-lede">
              You can see claimed one-time gifts and remove any item. Switch people
              above to manage each list.
            </p>
          </section>
        )}
      </main>

      {claimTarget && (
        <ClaimModal
          item={claimTarget}
          defaultName={self?.name ?? ''}
          onClose={() => setClaimTarget(null)}
          onClaim={handleClaim}
        />
      )}
    </div>
  )
}
