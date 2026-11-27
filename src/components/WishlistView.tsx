import { getPerson } from '../config'
import type { Session, WishlistItem } from '../types'
import { ItemCard } from './ItemCard'

type Props = {
  ownerId: string
  items: WishlistItem[]
  session: Session
  onClaim?: (item: WishlistItem) => void
  onRemove: (item: WishlistItem) => void
}

export function WishlistView({ ownerId, items, session, onClaim, onRemove }: Props) {
  const owner = getPerson(ownerId)
  const oneTime = items.filter((i) => i.kind === 'one-time')
  const recurring = items.filter((i) => i.kind === 'recurring')

  return (
    <div className="wishlist-view">
      <header className="list-header">
        <h2>{owner?.name ?? 'Someone'}’s wishlist</h2>
        {owner?.blurb && <p className="section-lede">{owner.blurb}</p>}
      </header>

      <section className="panel">
        <div className="section-heading">
          <h3>One-time</h3>
          <p>Claim before you buy — once reserved, it disappears for everyone else.</p>
        </div>
        {oneTime.length === 0 ? (
          <p className="empty">Nothing open here right now.</p>
        ) : (
          <div className="item-list">
            {oneTime.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                session={session}
                onClaim={!item.claimedBy && onClaim ? onClaim : undefined}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="section-heading">
          <h3>Recurring</h3>
          <p>Always welcome — gift cards, favorites, no claim needed.</p>
        </div>
        {recurring.length === 0 ? (
          <p className="empty">No recurring ideas yet.</p>
        ) : (
          <div className="item-list">
            {recurring.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                session={session}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
