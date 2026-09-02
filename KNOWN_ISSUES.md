# Known issues

This is an **early demo**. The list below is what players and testers actually hit. Code-structure work that does **not** change gameplay lives in [TODO.md](TODO.md).

---

## Native access violation on verse enter / restart

**Status:** open  
**Where:** packaged Electron app (Windows for sure; other desktops may be similar)  
**Where it is rare:** browser (`npm start` or the static `build/`) and **Docker** (nginx)

### What you see

- The game window **closes and comes back**, or the level **reloads**, when you **enter a verse** or **restart a verse**.
- Sometimes it happens once and then plays normally. Sometimes it repeats.
- After several crashes in a short window the app **stops auto-reloading** (rate limit: 5 reloads per 60 seconds) and you have to quit and start it again.

### What it is

The Electron **renderer** (Chromium + WebGL / GPU) can exit with:

- reason: `crashed` / `killed` / `abnormal-exit`
- exit code **`0xC0000005`** — Windows **`STATUS_ACCESS_VIOLATION`**

That is a **native** crash inside the GPU/renderer process, not a normal JavaScript exception. It is tied to tearing down and rebuilding a Babylon.js scene (verse switch / restart) while WebGL objects are still in use.

The main process is written to:

1. Log the crash and the last “heartbeat” (which verse, mesh counts, FPS)
2. **Reload** the window automatically so a tester is not stuck on a black screen

Reload is a **mitigation**, not a fix. The same scene still runs after reload; the crash can happen again.

### Why the browser / Docker build is safer

Those builds use a normal browser (or nginx + the browser you already have). There is **no Electron renderer**. A WebGL glitch there usually becomes a JS error or a lost context, not a process-killing access violation. For sharing a stable demo, **prefer Docker or a locally served `build/`**.

### Logs (native only)

| OS | Typical path |
|---|---|
| Windows | `%APPDATA%\HaсK [C]omplete\crash.log` (also try `%APPDATA%\hacking-complete\crash.log`) |
| macOS | `~/Library/Application Support/HaсK [C]omplete/crash.log` |
| Linux | `~/.config/hacking-complete/crash.log` |

Same folder may contain `crash-breadcrumbs.json` (last verse / restart key / GPU load before the crash) and Chromium dump files under the Electron `crashDumps` directory.

A line with `"accessViolation": true` and `exitCodeHex": "0xC0000005"` is this bug.

### Workarounds

1. Play in the **browser** or **Docker** — see [README.md](README.md).
2. If the native window reloads once, wait and continue; do not mash restart.
3. If it loops, quit the app and use a non-Electron build.
4. When reporting a crash, attach `crash.log` and `crash-breadcrumbs.json`.

---

## Other known limitations

- **Unsigned macOS build.** Gatekeeper will warn until the player right-clicks the app and chooses Open. There is no Apple Developer signature in this demo.
- **Windows SmartScreen** may warn on an unsigned installer / portable `.exe`. That is expected for a self-built fan demo.
- **`file://` will not work.** Always serve the web build over HTTP (dev server, Docker, or Electron’s local server).
- **Git LFS missing** after clone: audio/textures are stub pointer files until `git lfs pull`. The game looks empty or silent.
- Some verse/debug hooks exist only because the **native Babylon inspector is unreliable** in Electron (`useBabylonCustomEditorForDebugBecauseNativeDoesntWorkForUnknownReasons`). Browser debug is the intended workflow.
