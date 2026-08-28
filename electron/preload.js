const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronDiagnostics", {
    breadcrumb: (event, data) => {
        ipcRenderer.send("diagnostics:breadcrumb", { event, data });
    },
    error: (payload) => {
        ipcRenderer.send("diagnostics:error", payload);
    },
});
