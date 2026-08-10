# HALO Music

Static music UI with Cloudflare Pages Functions authentication and a dedicated
D1 database.

## Create the database

```powershell
npx wrangler d1 create halo-music-db
```

Copy the returned `database_id` into `wrangler.toml`, then initialize it:

```powershell
npx wrangler d1 execute halo-music-db --remote --file schema.sql
```

## Local development

```powershell
npm install
npx wrangler d1 execute halo-music-db --local --file schema.sql
npm run dev
```

The public can search and browse. Registration/login is backed by D1 and an
HttpOnly session cookie; only authenticated users can start playback in the UI.
Favorites and custom playlists are cached locally for offline resilience and
synced to the authenticated user's D1 library.

## Playlist import

Signed-in users can paste a public playlist share link from NetEase Cloud
Music, Qishui Music, or QQ Music. The Pages Function resolves official short
links, fetches the playlist server-side, and converts tracks into the HALO
library format. Existing HALO JSON file imports remain available from the same
dialog.

NetEase song details are fetched in batches. QQ Music uses the request signing
and pagination strategy from `GoMusic`; to stay within Pages Function request
limits, imports are capped at the first 1,200 QQ tracks. Qishui pages are read
from embedded page data with an HTML-structure fallback.
