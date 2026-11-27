import type { Session, WishlistItem } from '../types'

type Props = {
  item: WishlistItem
  session: Session
  onClaim?: (item: WishlistItem) => void
  onRemove?: (item: WishlistItem) => void
}

export function ItemCard({ item, session, onClaim, onRemove }: Props) {
  const claimed = Boolean(item.claimedBy)
  const isAdmin = session.role === 'admin'

  return (
    <article className={`item-card ${claimed ? 'claimed' : ''}`}>
      <div className="item-main">
        <h3>{item.title}</h3>
        {item.notes && <p className="item-notes">{item.notes}</p>}
        {claimed && isAdmin && (
          <p className="claim-meta">Claimed by {item.claimedBy}</p>
        )}
        {claimed && !isAdmin && (
          <p className="claim-meta">You claimed this — it’s hidden from everyone else.</p>
        )}
      </div>
      <div className="item-actions">
        {item.kind === 'one-time' && !claimed && onClaim && (
          <button type="button" className="btn primary compact" onClick={() => onClaim(item)}>
            Claim &amp; buy
          </button>
        )}
        {item.kind === 'one-time' && !claimed && !onClaim && item.url && (
          <a className="btn ghost compact" href={item.url} target="_blank" rel="noreferrer">
            Open link
          </a>
        )}
        {item.kind === 'recurring' && (
          <a className="btn primary compact" href={item.url} target="_blank" rel="noreferrer">
            Buy link
          </a>
        )}
        {item.kind === 'one-time' && claimed && item.url && (
          <a className="btn ghost compact" href={item.url} target="_blank" rel="noreferrer">
            Open link
          </a>
        )}
        {isAdmin && onRemove && (
          <button type="button" className="btn danger compact" onClick={() => onRemove(item)}>
            Remove
          </button>
        )}
      </div>
    </article>
  )
}
