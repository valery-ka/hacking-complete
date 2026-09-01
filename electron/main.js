const { app, BrowserWindow, Menu } = require("electron");
const { registerAppCrashHandlers } = require("./crash-log");
const { unregisterMainProcessShortcuts } = require("./keyboard-guard");
const { createWindow, stopStaticServer } = require("./window");

// Allow Web Audio / Babylon unlock without a prior click (Chromium autoplay policy).
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
    app.quit();
} else {
    app.on("second-instance", () => {
        const [window] = BrowserWindow.getAllWindows();
        if (window) {
            if (window.isMinimized()) window.restore();
            window.focus();
        }
    });

    registerAppCrashHandlers();

    app.whenReady().then(() => {
        Menu.setApplicationMenu(null);
        createWindow();
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    app.on("before-quit", () => {
        unregisterMainProcessShortcuts();
        stopStaticServer();
    });
}
