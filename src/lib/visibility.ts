import type { Session, WishlistItem } from '../types'

/**
 * One-time claimed items are hidden from everyone except:
 * - the logged-in person who claimed them
 * - admin (can remove / audit)
 *
 * Recurring items are always visible.
 * Owners do not see who claimed their one-time gifts (keeps the surprise).
 */
export function filterVisibleItems(
  items: WishlistItem[],
  session: Session,
): WishlistItem[] {
  return items.filter((item) => {
    if (item.kind === 'recurring') return true
    if (!item.claimedBy) return true
    if (session.role === 'admin') return true
    if (
      session.role === 'person' &&
      item.claimedByPersonId &&
      item.claimedByPersonId === session.personId
    ) {
      return true
    }
    return false
  })
}
