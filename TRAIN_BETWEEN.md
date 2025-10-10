This project uses Expo Router. A new screen was added at `app/train-between.tsx`.

How to open in the app

- Start the dev server: `npm run dev` (or `npx expo start`).
- In the app, navigate to the route `/train-between` (Expo Router maps `app/train-between.tsx` to this path).

How to run TypeScript check (Windows PowerShell)

If `npx` is blocked by PowerShell execution policy, run the local tsc directly with Node:

node ./node_modules/typescript/bin/tsc --noEmit

Or temporarily bypass script restrictions in PowerShell (run as Administrator):

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; npx tsc --noEmit

Notes

- The screen fetches the backend API:
  https://fastapi-backend-production-23ac.up.railway.app/irctc/train_btwn_stations/?fromstationcode=KUDL&tostationscode=TNA&dateofjourney=2025-10-11

- Inputs: station codes (auto-capitalized) and date (YYYY-MM-DD). The result rendering attempts to map common response fields; if the backend returns different JSON structure, adjust `renderItem` mapping in `app/train-between.tsx`.