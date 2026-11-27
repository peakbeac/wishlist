import { useState, type FormEvent } from 'react'
import { addItem } from '../lib/storage'
import type { ItemKind } from '../types'

type Props = {
  ownerId: string
  ownerName: string
}

export function AddItemForm({ ownerId, ownerName }: Props) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [kind, setKind] = useState<ItemKind>('one-time')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      await addItem({ ownerId, title, url, notes, kind })
      setTitle('')
      setUrl('')
      setNotes('')
      setMessage('Added to your list.')
    } catch {
      setMessage('Could not add that item. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="panel add-panel">
      <h2>Add to {ownerName}’s list</h2>
      <p className="section-lede">
        One-time gifts can be claimed by a single buyer. Recurring ideas (gift cards,
        favorites) stay open for anyone.
      </p>
      <form className="add-form" onSubmit={handleSubmit}>
        <label>
          <span>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="LEGO Botanical Collection"
            required
          />
        </label>
        <label>
          <span>Buy link</span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
            required
          />
        </label>
        <label>
          <span>Notes (optional)</span>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Size M, color blue…"
          />
        </label>
        <fieldset className="kind-fieldset">
          <legend>Type</legend>
          <label className="radio">
            <input
              type="radio"
              name="kind"
              checked={kind === 'one-time'}
              onChange={() => setKind('one-time')}
            />
            <span>One-time</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="kind"
              checked={kind === 'recurring'}
              onChange={() => setKind('recurring')}
            />
            <span>Recurring</span>
          </label>
        </fieldset>
        {message && <p className="form-note">{message}</p>}
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Saving…' : 'Add item'}
        </button>
      </form>
    </section>
  )
}
