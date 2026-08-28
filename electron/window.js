const { app, BrowserWindow, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const { PORT, isDev, getBuildPath } = require("./config");
const { attachWindowCrashHandlers } = require("./crash-log");
const { attachKeyboardGuard } = require("./keyboard-guard");
const { startStaticServer } = require("./static-server");

/** @type {import("http").Server | null} */
let staticServer = null;

function stopStaticServer() {
    if (staticServer) {
        staticServer.close();
        staticServer = null;
    }
}

async function createWindow() {
    if (!isDev) {
        const buildPath = getBuildPath();
        const indexPath = path.join(buildPath, "index.html");

        if (!fs.existsSync(indexPath)) {
            dialog.showErrorBox(
                "Build not found",
                "Production build is missing.\n\nRun:\n  npm run build\n\nThen start Electron again.",
            );
            app.quit();
            return;
        }

        staticServer = await startStaticServer(buildPath);
    }

    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 960,
        minHeight: 540,
        autoHideMenuBar: true,
        fullscreen: isDev ? false : true,
        frame: false,
        resizable: false,
        backgroundColor: "#1b1712",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
        },
    });

    attachWindowCrashHandlers(window);
    attachKeyboardGuard(window);

    await window.loadURL(`http://127.0.0.1:${PORT}`);

    if (isDev) {
        window.webContents.openDevTools({ mode: "detach" });
    }

    window.on("closed", () => {
        stopStaticServer();
    });
}

module.exports = {
    createWindow,
    stopStaticServer,
};
