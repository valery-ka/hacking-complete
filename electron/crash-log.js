const { app, ipcMain, crashReporter } = require("electron");
const fs = require("fs");
const os = require("os");
const path = require("path");

const MAX_BREADCRUMBS = 80;

/** @type {Array<{ t: string, e: string, d?: unknown }>} */
let breadcrumbs = [];

function getCrashLogPath() {
    return path.join(app.getPath("userData"), "crash.log");
}

function getBreadcrumbsPath() {
    return path.join(app.getPath("userData"), "crash-breadcrumbs.json");
}

function persistBreadcrumbs() {
    try {
        fs.writeFileSync(getBreadcrumbsPath(), JSON.stringify(breadcrumbs, null, 2));
    } catch {
        // best-effort: a native crash should still see the previous write
    }
}

function loadBreadcrumbsFromDisk() {
    try {
        const parsed = JSON.parse(fs.readFileSync(getBreadcrumbsPath(), "utf8"));
        if (Array.isArray(parsed)) breadcrumbs = parsed.slice(-MAX_BREADCRUMBS);
    } catch {
        breadcrumbs = [];
    }
}

function formatExitCode(exitCode) {
    if (typeof exitCode !== "number") return { exitCode };
    const unsigned = exitCode < 0 ? exitCode >>> 0 : exitCode;
    return {
        exitCode,
        exitCodeHex: `0x${unsigned.toString(16).toUpperCase()}`,
        accessViolation: unsigned === 0xc0000005,
    };
}

function collectRuntimeInfo() {
    let gpu = null;
    try {
        gpu = app.getGPUFeatureStatus();
    } catch {
        gpu = null;
    }

    return {
        pid: process.pid,
        platform: process.platform,
        arch: process.arch,
        versions: process.versions,
        execPath: process.execPath,
        userData: app.getPath("userData"),
        crashDumps: app.getPath("crashDumps"),
        uptimeSec: Math.round(process.uptime()),
        memory: process.memoryUsage(),
        gpu,
        os: {
            type: os.type(),
            release: os.release(),
            totalmem: os.totalmem(),
            freemem: os.freemem(),
        },
        breadcrumbs: breadcrumbs.slice(),
        crashLogPath: getCrashLogPath(),
        breadcrumbsPath: getBreadcrumbsPath(),
    };
}

function logCrash(label, payload) {
    const body =
        payload instanceof Error
            ? { message: payload.message, stack: payload.stack }
            : payload;
    const line = `[${new Date().toISOString()}] ${label} ${JSON.stringify(body)}\n`;

    console.error(line.trim());
    try {
        fs.appendFileSync(getCrashLogPath(), line);
    } catch {
        fs.appendFile(getCrashLogPath(), line, () => {});
    }
}

function startNativeCrashReporter() {
    try {
        crashReporter.start({
            productName: app.getName() || "Hack Complete",
            uploadToServer: false,
            compress: true,
            ignoreSystemCrashHandler: false,
            extra: {
                electron: process.versions.electron || "",
                chrome: process.versions.chrome || "",
            },
        });
        logCrash("crashReporter.started", { crashDumps: app.getPath("crashDumps") });
    } catch (error) {
        logCrash("crashReporter.failed", error);
    }
}

function registerDiagnosticsIpc() {
    ipcMain.on("diagnostics:breadcrumb", (_event, payload) => {
        breadcrumbs.push({
            t: new Date().toISOString(),
            e: payload?.event ?? "unknown",
            d: payload?.data,
        });
        if (breadcrumbs.length > MAX_BREADCRUMBS) breadcrumbs.shift();
        persistBreadcrumbs();
    });

    ipcMain.on("diagnostics:error", (_event, payload) => {
        logCrash("renderer error", payload);
        persistBreadcrumbs();
    });
}

function registerAppCrashHandlers() {
    startNativeCrashReporter();
    loadBreadcrumbsFromDisk();
    registerDiagnosticsIpc();

    app.whenReady().then(() => {
        logCrash("app.ready", collectRuntimeInfo());
    });

    app.on("child-process-gone", (_event, details) => {
        logCrash("child-process-gone", {
            type: details.type,
            reason: details.reason,
            ...formatExitCode(details.exitCode),
            serviceName: details.serviceName,
            name: details.name,
            ...collectRuntimeInfo(),
        });
    });

    process.on("uncaughtException", (err) => {
        logCrash("main uncaughtException", err);
    });

    process.on("unhandledRejection", (reason) => {
        logCrash("main unhandledRejection", reason);
    });
}

/**
 * @param {import("electron").BrowserWindow} window
 */
function attachWindowCrashHandlers(window) {
    window.webContents.on("render-process-gone", (_event, details) => {
        logCrash("render-process-gone", {
            reason: details.reason,
            ...formatExitCode(details.exitCode),
            title: window.getTitle(),
            url: window.webContents.getURL(),
            ...collectRuntimeInfo(),
        });
    });

    window.webContents.on("unresponsive", () => {
        logCrash("renderer unresponsive", collectRuntimeInfo());
    });

    window.webContents.on("responsive", () => {
        logCrash("renderer responsive", {});
    });

    window.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
        logCrash("did-fail-load", { errorCode, errorDescription, validatedURL });
    });

    window.webContents.on("console-message", (_event, level, message, line, sourceId) => {
        if (level < 3) return;
        logCrash("renderer-console", { level, message, line, sourceId });
    });
}

module.exports = {
    logCrash,
    registerAppCrashHandlers,
    attachWindowCrashHandlers,
    getCrashLogPath,
};
