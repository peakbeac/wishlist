/**
 * Fixed people and PINs for this wishlist.
 * Edit this file, then rebuild and redeploy to GitHub Pages.
 *
 * PINs are checked in the browser — fine for a private family list,
 * not for anything that needs real security.
 */

export type Person = {
  id: string
  name: string
  /** Short greeting shown on their list */
  blurb: string
  pin: string
}

export const SITE_NAME = 'Wishwell'
export const SITE_TAGLINE = 'Gifts worth getting right'

/** Change these names, blurbs, and PINs to match your family */
export const PEOPLE: Person[] = [
  {
    id: 'alex',
    name: 'Alex',
    blurb: 'Building kits, cozy reads, and kitchen gadgets.',
    pin: '1111',
  },
  {
    id: 'jordan',
    name: 'Jordan',
    blurb: 'Outdoors gear and anything with a good playlist.',
    pin: '2222',
  },
  {
    id: 'sam',
    name: 'Sam',
    blurb: 'Art supplies, board games, and snack experiments.',
    pin: '3333',
  },
  {
    id: 'casey',
    name: 'Casey',
    blurb: 'Home upgrades and recurring favorites.',
    pin: '4444',
  },
]

/** Admin can remove any item and see claimed one-time gifts */
export const ADMIN_PIN = '9999'

export function getPerson(id: string): Person | undefined {
  return PEOPLE.find((p) => p.id === id)
}
