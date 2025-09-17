# Bob Empire — Global AI Commerce (Flat Build)

This flat package is ready to upload to **GitHub** and deploy on **Vercel**.
It uses **Supabase** for auth/data, includes **140 AI agents**, a **Super AI** command interface,
global platform connectors (placeholders), **PWA** support, and a dark UI (black background, white text).

## Quick Start
1) Create a new GitHub repository and upload all files (flat, no extra folders).
2) On Vercel → Import the repo → In Project Settings → Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
3) Deploy. Open the app and use the **Chat** tab to control Super AI:
   - `/run 1 hello`
   - `/connect all`
   - `/turbo on`
4) Admin password (default): **Bob@Bob0000** (change later in Settings).

## Notes
- Connectors are placeholders; add your API keys later.
- Remote config is stored in Supabase table `config` if available; otherwise falls back to `localStorage`.
