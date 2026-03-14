# Diziel Admin Dashboard (Frontend) — Production Deploy

## Requirements
- Node.js 18+ (recommended 20)

## Environment
- Update `.env.production` (or create it) with your production API URL.
  - `VITE_BACKEND_URL=https://YOUR-API-DOMAIN`

## Build
```bash
npm ci
npm run build
```

## Deploy
### Vercel / Netlify
- Build command: `npm run build`
- Output directory: `dist`

### Static server (Nginx)
- Upload the `dist/` folder and serve it as a SPA.
- Make sure you route all paths to `index.html`.
