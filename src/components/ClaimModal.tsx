import { useState, type FormEvent } from 'react'
import type { WishlistItem } from '../types'

type Props = {
  item: WishlistItem
  defaultName: string
  onClose: () => void
  onClaim: (name: string) => Promise<void>
}

export function ClaimModal({ item, defaultName, onClose, onClaim }: Props) {
  const [name, setName] = useState(defaultName)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await onClaim(name)
      if (item.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer')
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not claim this item.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="claim-title">Claim this gift</h2>
        <p>
          You’re reserving <strong>{item.title}</strong> so nobody else buys the same
          one-time gift. Enter your name, then we’ll open the buy link.
        </p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Your name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jamie"
              required
              autoFocus
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={busy}>
              {busy ? 'Claiming…' : 'Claim & open link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
