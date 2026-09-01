const { BrowserWindow, globalShortcut } = require("electron");
const { toggleBorderlessFullscreen } = require("./fullscreen");

const RECOVERY_ACCELERATORS = [
    "F11",
    "CommandOrControl+Shift+R",
    "Alt+F4",
    "CommandOrControl+Shift+I",
];

const CHROMIUM_SHORTCUT_CODES = new Set([
    "KeyR",
    "KeyW",
    "KeyN",
    "KeyT",
    "KeyP",
    "KeyF",
    "KeyG",
    "KeyU",
    "KeyS",
    "KeyH",
    "KeyJ",
    "KeyI",
    "KeyL",
    "KeyM",
    "KeyQ",
    "KeyO",
    "Digit0",
    "Minus",
    "Equal",
    "NumpadAdd",
    "NumpadSubtract",
    "Numpad0",
]);

function isOurWindowFocused(window) {
    if (window.isDestroyed()) {
        return false;
    }

    return BrowserWindow.getFocusedWindow() === window;
}

function toggleDevTools(window) {
    const { webContents } = window;
    if (webContents.isDestroyed()) {
        return;
    }

    if (webContents.isDevToolsOpened()) {
        webContents.closeDevTools();
    } else {
        webContents.openDevTools({ mode: "detach" });
    }
}

function hardReload(window) {
    const { webContents } = window;
    if (webContents.isDestroyed()) {
        return;
    }

    webContents.reloadIgnoringCache();
}

function registerMainProcessShortcuts(window) {
    const handlers = [
        ["F11", () => toggleBorderlessFullscreen(window)],
        ["CommandOrControl+Shift+R", () => hardReload(window)],
        ["Alt+F4", () => window.close()],
        ["CommandOrControl+Shift+I", () => toggleDevTools(window)],
    ];

    for (const [accelerator, handler] of handlers) {
        if (globalShortcut.isRegistered(accelerator)) {
            continue;
        }

        globalShortcut.register(accelerator, () => {
            if (!isOurWindowFocused(window)) {
                return;
            }

            handler();
        });
    }
}

function unregisterMainProcessShortcuts() {
    for (const accelerator of RECOVERY_ACCELERATORS) {
        if (globalShortcut.isRegistered(accelerator)) {
            globalShortcut.unregister(accelerator);
        }
    }
}

/**
 * Allow only: F11 (fullscreen), Ctrl+Shift+R (hard reload),
 * Alt+F4 (quit), Ctrl+Shift+I (DevTools). Block other Chromium chords.
 *
 * Recovery shortcuts are registered in the main process via globalShortcut so
 * they keep working when the renderer has crashed. `before-input-event` only
 * blocks unwanted Chromium chords while the renderer is alive.
 *
 * Match `code`, not `key` — `key` follows keyboard layout.
 * @param {import("electron").BrowserWindow} window
 */
function attachKeyboardGuard(window) {
    const onFocus = () => registerMainProcessShortcuts(window);
    const onBlur = () => unregisterMainProcessShortcuts();
    const onClosed = () => {
        unregisterMainProcessShortcuts();
        window.removeListener("focus", onFocus);
        window.removeListener("blur", onBlur);
    };

    window.on("focus", onFocus);
    window.on("blur", onBlur);
    window.once("show", onFocus);
    window.once("closed", onClosed);

    if (window.isFocused()) {
        onFocus();
    }

    window.webContents.on("before-input-event", (event, input) => {
        if (input.type !== "keyDown") {
            return;
        }

        const { code } = input;
        const ctrl = Boolean(input.control || input.meta);
        const shift = Boolean(input.shift);
        const alt = Boolean(input.alt);

        const blocked =
            code === "F5" ||
            code === "F12" ||
            code === "BrowserBack" ||
            code === "BrowserForward" ||
            (alt && (code === "ArrowLeft" || code === "ArrowRight" || code === "Home")) ||
            (ctrl && CHROMIUM_SHORTCUT_CODES.has(code));

        if (blocked) {
            event.preventDefault();
        }
    });
}

module.exports = {
    attachKeyboardGuard,
    unregisterMainProcessShortcuts,
};
