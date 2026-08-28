# HaсK [C]omplete

Babylon.js + React game with a desktop build via Electron.

## Requirements

- **Node.js** 18+
- **Git LFS** ([installation](https://git-lfs.com))
- **npm** (comes with Node.js)

## Quick Start

```bash
git clone <repo-url>
cd hacking-complete

git lfs install
git lfs pull

npm install
npm start
```

The game opens in the browser at [http://127.0.0.1:5051](http://127.0.0.1:5051).

## Scripts

| Command | Description |
|---|---|
| `npm start` | Dev server (browser) |
| `npm run build` | Production build to `build/` |
| `npm run electron:dev` | Electron + hot reload via CRA dev-server |
| `npm run electron:build` | Build and run Electron locally |
| `npm run electron:pack` | Package without installer (`release/`) |
| `npm run electron:dist` | Full installer for the current OS |
| `npm run electron:dist:win` | Windows NSIS + portable |
| `npm run verify:setup` | Verify that LFS assets are downloaded |

## Electron

Production Electron mode:

1. Builds the React app (`npm run build`)
2. Starts a local HTTP server on `127.0.0.1:5051` (same as the dev server)
3. Opens the game window

This is required for `fetch()` and the Web Audio API to work correctly with files from `public/`.

`homepage: "./"` in `package.json` ensures relative paths in the CRA build.

## Asset Structure

```
public/
  sounds/          # OGG/MP3 — via Git LFS
  textures/        # PNG — via Git LFS
```

**Not committed** (see `.gitignore`):

- `public/sounds/**/Audio/` — WAV masters
- `public/sounds/**/*.flp` — FL Studio projects
- `public/sounds/music/radio/raw/` and `lufs/` — source/normalized copies

Only files actually used by the game are kept in the repository.

## Git LFS

Audio and textures are stored in Git LFS (see `.gitattributes`).

After `git clone`, run:

```bash
git lfs install
git lfs pull
```

`npm install` automatically verifies that LFS files are downloaded (`scripts/check-lfs.js`).

To temporarily skip the check:

```bash
# Windows
set SKIP_LFS_CHECK=1 && npm install

# macOS / Linux
SKIP_LFS_CHECK=1 npm install
```

## Initial Repository Setup (for maintainers)

If you are starting history from scratch:

```bash
git lfs install
git lfs track "public/sounds/**/*.ogg"
git lfs track "public/sounds/**/*.mp3"
git lfs track "public/textures/**/*.png"

# .gitattributes is already in the repo — verify it before committing
git add .gitattributes
git add public/sounds public/textures
git add .

git commit -m "Initial commit"
git push
```

If you are migrating existing binaries to LFS before a new history:

```bash
git lfs migrate import --include="public/sounds/**/*.ogg,public/sounds/**/*.mp3,public/textures/**/*.png"
```

## Project Structure

```
electron/          # Electron main process
scripts/           # Utility scripts (check-lfs)
public/            # Static assets (copied to build/)
src/               # React + Babylon.js code
config-overrides.js
release/           # Finished installers (not in git)
build/             # CRA production build (not in git)
```

## Troubleshooting

**`Git LFS assets were not downloaded` after clone**

```bash
git lfs pull
npm install
```

**Electron: `Build not found`**

```bash
npm run build
npm run electron:start
```

**Port 5051 is in use**

Change `PORT` in the `package.json` scripts and the `PORT` constant in `electron/main.js`.
