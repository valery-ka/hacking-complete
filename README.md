# HaсK [C]omplete

Open-source **Babylon.js** recreation of the hacking mini-game from *NieR:Automata*.

This is an **early demo**. Gameplay is playable end-to-end (verses, bosses, plane / cylinder / sphere stages, keyboard and gamepad), but the codebase is still a prototype: some systems are duplicated, and the **native desktop build can crash** on verse load or restart. The **browser** build (local dev server or Docker) is the stable way to play.

**Not affiliated with Square Enix or PlatinumGames.** *NieR:Automata* and related marks belong to their owners. This repository is a fan project.

Source: [github.com/valery-ka/hacking-complete](https://github.com/valery-ka/hacking-complete)

---

## Play (pick one)

| How | Stability | Who it is for |
|---|---|---|
| **Browser** (`npm start`) | Best | Development and everyday play |
| **Docker** (nginx on port 7777) | Best | Sharing a browser build without installing Node |
| **Native Electron** (installer / portable) | Can crash | GameJolt, sending an `.exe` to a friend |

On native Windows/macOS/Linux, the Chromium renderer may hit an **access violation** (`0xC0000005`) when **entering a verse or restarting a verse**. The window often **reloads by itself**. That crash is **rare in the browser / Docker** build. Details: [KNOWN_ISSUES.md](KNOWN_ISSUES.md).

Code-quality follow-ups that should not change gameplay: [TODO.md](TODO.md).

---

## Requirements

- **Node.js** 18+ (22 is fine)
- **Git LFS** ([install](https://git-lfs.com)) — audio and textures are stored in LFS
- **npm** (comes with Node.js)
- **Docker** (optional) — only if you want the containerized browser build

---

## 1. Browser (recommended)

```bash
git clone https://github.com/valery-ka/hacking-complete.git
cd hacking-complete

git lfs install
git lfs pull

npm install
npm start
```

Open [http://127.0.0.1:5051](http://127.0.0.1:5051).

This is a Create React App dev server plus Babylon.js. It uses the same WebGL path as the packaged game, but **without** Electron’s native renderer, so the access-violation crash almost never appears.

Production web build (static files in `build/`):

```bash
npm run build
```

Serve `build/` over HTTP (do not open `index.html` as a `file://` URL — `fetch()` and audio will fail). Docker below does this for you.

---

## 2. Docker (recommended packaged browser build)

Same engine as the browser playthrough: **no Electron**, so the native access violation **usually does not happen**.

Pull LFS assets **on the host** first (`git lfs pull`). The image copies `public/` from your working tree; pointer files instead of real `.ogg` / `.png` will ship a broken game.

```bash
git lfs pull

docker compose up --build
```

Then open [http://127.0.0.1:7777](http://127.0.0.1:7777).

Equivalent without Compose:

```bash
docker build -t hacking-complete:latest .
docker run --rm -p 7777:7777 hacking-complete:latest
```

The image is a multi-stage build: Node 22 compiles the React app, then **nginx 1.28** serves it on port **7777** (see `nginx.conf`).

Stop Compose with `Ctrl+C`, or `docker compose down`.

---

## 3. Native desktop (Electron)

Use this when you need a GameJolt download or an installer for someone who will not run Node/Docker.

```bash
git lfs pull
npm install

# development window (CRA + Electron, hot reload)
npm run electron:dev

# production window from a local `build/` (no installer)
npm run electron:build
```

Production mode:

1. Builds the React app (`npm run build`)
2. Serves it from a local HTTP server on `127.0.0.1:5051` (needed for `fetch()` and Web Audio)
3. Opens a borderless fullscreen window

`homepage: "./"` in `package.json` keeps asset paths relative in the CRA output.

### Access violation on native

The packaged app **can die with `STATUS_ACCESS_VIOLATION` (`0xC0000005`)** in the GPU/renderer process, most often when a **verse starts or restarts**. Electron then **auto-reloads** the window (up to 5 times per 60 seconds). If it keeps looping, close the app and play in the **browser or Docker** instead.

See [KNOWN_ISSUES.md](KNOWN_ISSUES.md) for logs and workarounds.

### Installers and portable builds

Artifacts land in `release/` (gitignored).

| Command | Output |
|---|---|
| `npm run electron:dist` | Installer(s) for **this** OS |
| `npm run electron:dist:win` | Windows **NSIS setup** + **portable** `.exe` |
| `npm run electron:dist:linux` | Linux **zip** (AppImage is built on Linux / GitHub Actions) |
| `npm run electron:dist:mac` | macOS **DMG** (must run on macOS) |

**Cross-compilation:** this Windows machine can produce **Windows** installers and a **Linux zip**. **macOS DMG** and **Linux AppImage** need macOS / Linux (or GitHub Actions). CI (`.github/workflows/release.yml`) builds all three when you push a `v*` tag or run the workflow by hand.

Suggested files to upload to [GameJolt](https://gamejolt.com) or send to testers (all under `release/`):

- `HackComplete-1.0.0-win-setup.exe` — Windows installer (choose install directory)
- `HackComplete-1.0.0-win-portable.exe` — single-file Windows build, no install
- `HackComplete-1.0.0-linux-x64.zip` — Linux (unpack and run `HackComplete`). An **AppImage** is produced on Linux or by GitHub Actions (Windows cannot create AppImage because it needs symlinks).
- `HackComplete-1.0.0-web.zip` — HTML5 / browser (unzip and host so `index.html` is at the zip root; GameJolt HTML5, or any static host). This is the **stable** packaged build.
- `HackComplete-<version>-mac-*.dmg` — macOS (build on a Mac, or run the **Release builds** GitHub Action). Unsigned: right-click → Open the first time.

On macOS Gatekeeper may block an unsigned DMG until the player explicitly opens it. Windows SmartScreen may warn on the `.exe` files for the same reason.

To rebuild the HTML5 zip after `npm run build` (GameJolt expects `index.html` at the zip root):

```bash
# Windows PowerShell
Compress-Archive -Path build\* -DestinationPath release\HackComplete-1.0.0-web.zip -Force
```

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Dev server (browser) on port 5051 |
| `npm run build` | Production web build → `build/` |
| `npm run electron:dev` | Electron + hot reload via the CRA server |
| `npm run electron:build` | Build web app and run Electron locally |
| `npm run electron:pack` | Unpackaged app dir in `release/` (no installer) |
| `npm run electron:dist` | Installer for the current OS |
| `npm run electron:dist:win` | Windows NSIS + portable |
| `npm run electron:dist:linux` | Linux zip (`release/`). AppImage: Linux host or CI |
| `npm run electron:dist:mac` | macOS DMG |
| `npm run verify:setup` | Check that Git LFS assets are real files, not pointers |

---

## Git LFS

Audio and textures live in Git LFS (see `.gitattributes`). After clone:

```bash
git lfs install
git lfs pull
```

`npm install` runs `scripts/check-lfs.js`. To skip that check:

```bash
# Windows
set SKIP_LFS_CHECK=1 && npm install

# macOS / Linux
SKIP_LFS_CHECK=1 npm install
```

---

## Asset layout

```
public/
  sounds/          # OGG/MP3 — Git LFS
  textures/        # PNG — Git LFS
```

**Not committed** (see `.gitignore`):

- `public/sounds/**/Audio/` — WAV masters
- `public/sounds/**/*.flp` — FL Studio projects
- `public/sounds/music/radio/raw/` and `lufs/` — source / normalized copies

---

## Project layout

```
electron/          # Electron main process (window, crash log, static server)
scripts/           # LFS check and small utilities
public/            # Static assets copied into build/
src/               # React + Babylon.js game
  core/            # Player, enemies, bullets, walls, effects
  verses/          # Per-verse configs
  hooks/           # Scene and menu wiring
Dockerfile         # Browser image (Node build → nginx)
docker-compose.yml
release/           # Installers (not in git)
build/             # CRA production output (not in git)
```

---

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

**Port 5051 is already in use**

Change `PORT` in `package.json` scripts and the `PORT` constant in `electron/config.js`.

**Native app restarts itself when a level loads**

That is the access-violation workaround. Prefer the browser or Docker build. See [KNOWN_ISSUES.md](KNOWN_ISSUES.md).

**Docker image has no sound / missing textures**

`git lfs pull` on the host, then rebuild: `docker compose up --build`.

---

## License

Code in this repository is released under the [MIT License](LICENSE).

This is an unofficial fan project and is not a commercial product.
