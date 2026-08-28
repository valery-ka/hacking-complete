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

/**
 * Allow only: F11 (fullscreen), Ctrl+Shift+R (hard reload),
 * Alt+F4 (quit), Ctrl+Shift+I (DevTools). Block other Chromium chords.
 * Match `code`, not `key` — `key` follows keyboard layout.
 * @param {import("electron").BrowserWindow} window
 */
function attachKeyboardGuard(window) {
    window.webContents.on("before-input-event", (event, input) => {
        if (input.type !== "keyDown") {
            return;
        }

        const { code } = input;
        const ctrl = Boolean(input.control || input.meta);
        const shift = Boolean(input.shift);
        const alt = Boolean(input.alt);

        if (code === "F11" && !ctrl && !alt) {
            event.preventDefault();
            window.setFullScreen(!window.isFullScreen());
            return;
        }

        if (ctrl && shift && !alt && code === "KeyR") {
            event.preventDefault();
            window.webContents.reloadIgnoringCache();
            return;
        }

        if (alt && !ctrl && !shift && code === "F4") {
            event.preventDefault();
            window.close();
            return;
        }

        if (ctrl && shift && !alt && code === "KeyI") {
            event.preventDefault();
            const { webContents } = window;
            if (webContents.isDevToolsOpened()) {
                webContents.closeDevTools();
            } else {
                webContents.openDevTools({ mode: "detach" });
            }
            return;
        }

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
};
