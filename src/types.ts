export type ItemKind = 'one-time' | 'recurring'

export type WishlistItem = {
  id: string
  ownerId: string
  title: string
  url: string
  notes: string
  kind: ItemKind
  /** Free-text buyer name (shown to admin) */
  claimedBy: string | null
  /** Logged-in person who claimed (keeps surprise for everyone else) */
  claimedByPersonId: string | null
  claimedAt: string | null
  createdAt: string
}

export type Session =
  | { role: 'person'; personId: string }
  | { role: 'admin' }
