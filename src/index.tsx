import ReactDOM from "react-dom/client";

import { App } from "./App";
import { AppProvider } from "contexts";
import { ErrorBoundary } from "components";
import { installRendererDiagnostics } from "utils/diagnostics";

// import "@babylonjs/inspector";
import "./styles/index.css";

installRendererDiagnostics();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <ErrorBoundary>
        <AppProvider>
            <App />
        </AppProvider>
    </ErrorBoundary>,
);
