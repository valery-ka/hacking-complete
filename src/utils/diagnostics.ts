const MAX_BREADCRUMBS = 80;

export type DiagnosticBreadcrumb = {
    t: string;
    e: string;
    d?: unknown;
};

const breadcrumbs: DiagnosticBreadcrumb[] = [];

declare global {
    interface Window {
        electronDiagnostics?: {
            breadcrumb: (event: string, data?: unknown) => void;
            error: (payload: unknown) => void;
        };
    }
}

const sendToElectron = (channel: "breadcrumb" | "error", payload: unknown) => {
    try {
        const bridge = window.electronDiagnostics;
        if (channel === "breadcrumb") {
            const entry = payload as DiagnosticBreadcrumb;
            bridge?.breadcrumb(entry.e, entry.d);
            return;
        }
        bridge?.error(payload);
    } catch {
        // Browser / tests: IPC is optional.
    }
};

export const getBreadcrumbs = (): DiagnosticBreadcrumb[] => breadcrumbs.slice();

export const breadcrumb = (event: string, data?: unknown) => {
    const entry: DiagnosticBreadcrumb = {
        t: new Date().toISOString(),
        e: event,
        d: data,
    };
    breadcrumbs.push(entry);
    if (breadcrumbs.length > MAX_BREADCRUMBS) breadcrumbs.shift();
    sendToElectron("breadcrumb", entry);
};

export const reportDiagnosticError = (payload: unknown) => {
    sendToElectron("error", {
        ...(typeof payload === "object" && payload !== null ? payload : { payload }),
        breadcrumbs: breadcrumbs.slice(),
    });
};

export const isControlAlive = (control?: object | null): boolean => {
    if (!control) return false;
    const candidate = control as {
        isDisposed?: boolean | (() => boolean);
        _isDisposed?: boolean;
    };
    if (typeof candidate.isDisposed === "function") return !candidate.isDisposed();
    if (candidate.isDisposed === true) return false;
    if (candidate._isDisposed === true) return false;
    return true;
};

export const isTextureAlive = (texture?: object | null): boolean => isControlAlive(texture);

export const installRendererDiagnostics = () => {
    breadcrumb("renderer.boot", {
        href: window.location.href,
        userAgent: navigator.userAgent,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
        language: navigator.language,
    });

    window.addEventListener("error", (event) => {
        const payload = {
            type: "window.error",
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error instanceof Error ? event.error.stack : undefined,
        };
        breadcrumb("window.error", payload);
        reportDiagnosticError(payload);
    });

    window.addEventListener("unhandledrejection", (event) => {
        const reason = event.reason;
        const payload = {
            type: "unhandledrejection",
            message: reason instanceof Error ? reason.message : String(reason),
            stack: reason instanceof Error ? reason.stack : undefined,
        };
        breadcrumb("unhandledrejection", payload);
        reportDiagnosticError(payload);
    });

    document.addEventListener("visibilitychange", () => {
        breadcrumb("visibility", { state: document.visibilityState });
    });

    const canvas = () => document.getElementById("babylon-canvas") as HTMLCanvasElement | null;
    const onContextLost = () => breadcrumb("webgl.contextLost");
    const onContextRestored = () => breadcrumb("webgl.contextRestored");

    const bindCanvas = () => {
        const el = canvas();
        if (!el || (el as HTMLCanvasElement & { __diagBound?: boolean }).__diagBound) return;
        (el as HTMLCanvasElement & { __diagBound?: boolean }).__diagBound = true;
        el.addEventListener("webglcontextlost", onContextLost, false);
        el.addEventListener("webglcontextrestored", onContextRestored, false);
    };

    bindCanvas();
    window.addEventListener("load", bindCanvas);
};
