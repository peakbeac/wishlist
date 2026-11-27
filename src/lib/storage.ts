import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { firebaseConfigured, getDb } from './firebase'
import type { ItemKind, WishlistItem } from '../types'

const LOCAL_KEY = 'wishwell-items-v1'

function uid(): string {
  return crypto.randomUUID()
}

function readLocal(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return []
    return JSON.parse(raw) as WishlistItem[]
  } catch {
    return []
  }
}

function writeLocal(items: WishlistItem[]): void {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent('wishwell-local-change'))
}

export function isCloudMode(): boolean {
  return firebaseConfigured
}

export function subscribeItems(onChange: (items: WishlistItem[]) => void): Unsubscribe {
  const db = getDb()
  if (db) {
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => {
      const items: WishlistItem[] = snap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          ownerId: String(data.ownerId ?? ''),
          title: String(data.title ?? ''),
          url: String(data.url ?? ''),
          notes: String(data.notes ?? ''),
          kind: data.kind === 'recurring' ? 'recurring' : 'one-time',
          claimedBy: data.claimedBy ? String(data.claimedBy) : null,
          claimedByPersonId: data.claimedByPersonId
            ? String(data.claimedByPersonId)
            : null,
          claimedAt: data.claimedAt ? String(data.claimedAt) : null,
          createdAt: String(data.createdAt ?? new Date().toISOString()),
        }
      })
      onChange(items)
    })
  }

  const emit = () => onChange(readLocal())
  emit()
  const handler = () => emit()
  window.addEventListener('wishwell-local-change', handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener('wishwell-local-change', handler)
    window.removeEventListener('storage', handler)
  }
}

export async function addItem(input: {
  ownerId: string
  title: string
  url: string
  notes: string
  kind: ItemKind
}): Promise<void> {
  const payload = {
    ownerId: input.ownerId,
    title: input.title.trim(),
    url: input.url.trim(),
    notes: input.notes.trim(),
    kind: input.kind,
    claimedBy: null as string | null,
    claimedByPersonId: null as string | null,
    claimedAt: null as string | null,
    createdAt: new Date().toISOString(),
  }

  const db = getDb()
  if (db) {
    await addDoc(collection(db, 'items'), payload)
    return
  }

  const item: WishlistItem = { id: uid(), ...payload }
  writeLocal([item, ...readLocal()])
}

export async function claimItem(
  itemId: string,
  claimedBy: string,
  claimedByPersonId: string | null,
): Promise<void> {
  const name = claimedBy.trim()
  if (!name) throw new Error('Enter your name to claim this gift.')

  const patch = {
    claimedBy: name,
    claimedByPersonId,
    claimedAt: new Date().toISOString(),
  }

  const db = getDb()
  if (db) {
    await updateDoc(doc(db, 'items', itemId), patch)
    return
  }

  const items = readLocal()
  const next = items.map((item) => {
    if (item.id !== itemId) return item
    if (item.kind !== 'one-time') return item
    if (item.claimedBy) return item
    return { ...item, ...patch }
  })
  writeLocal(next)
}

export async function removeItem(itemId: string): Promise<void> {
  const db = getDb()
  if (db) {
    await deleteDoc(doc(db, 'items', itemId))
    return
  }

  writeLocal(readLocal().filter((item) => item.id !== itemId))
}
