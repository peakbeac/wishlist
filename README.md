# Wishwell

A small family wishlist site: browse everyone’s lists, claim one-time gifts so nobody doubles up, and keep recurring ideas open for anyone.

## Features

- **Fixed people** with separate PINs (`src/config.ts`)
- **One-time** items — buyer enters their name to claim; claimed gifts are hidden from everyone else
- **Recurring** items — always visible, no claim
- **Add portal** — when you sign in as yourself, you can add items to your own list
- **Admin PIN** — see claimed items and remove anything
- **GitHub Pages** hosting with optional **Firebase** for shared data across devices

## Quick start (demo mode)

```bash
npm install
npm run dev
```

Without Firebase env vars, data is stored in **this browser only** (fine for trying the UI). Default PINs are in `src/config.ts` (`1111`–`4444`, admin `9999`).

## Configure your family

Edit `src/config.ts`:

- `PEOPLE` — ids, display names, blurbs, PINs
- `ADMIN_PIN` — for removing items
- `SITE_NAME` / `SITE_TAGLINE` if you want

## Shared data (Firebase) for GitHub Pages

GitHub Pages is static, so claims and new items need a backend. Firebase Firestore (free Spark plan) works well.

1. Create a Firebase project → add a **Web** app.
2. Create a **Firestore** database.
3. Publish the rules in `firestore.rules` (Console → Firestore → Rules).
4. Copy `.env.example` to `.env.local` and paste the web config values.
5. For GitHub Actions deploy, add the same `VITE_FIREBASE_*` values as **repository secrets**.

## Deploy to GitHub Pages

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Merge to `main` (or run the **Deploy to GitHub Pages** workflow).
3. Site URL: `https://<user>.github.io/wishlist/`

If the repo name is not `wishlist`, change `VITE_BASE` in `vite.config.ts` / the workflow to `/<repo>/`.

## Scripts

| Command           | What it does                     |
|-------------------|----------------------------------|
| `npm run dev`     | Local development server         |
| `npm run build`   | Production build to `dist`       |
| `npm run preview` | Preview the production build     |
