import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ errorInfo });
        console.error("Error Boundary Caught an Error:", error, errorInfo);
    }

    private getErrorStackLines(): string[] {
        const { error } = this.state;
        if (!error || !error.stack) return [];

        return error.stack
            .split("\n")
            .slice(1, 3)
            .map((line) => line.trim())
            .filter(Boolean);
    }

    render(): ReactNode {
        const { hasError, error } = this.state;
        const { children, fallback } = this.props;

        if (hasError) {
            if (fallback) {
                return fallback;
            }

            const stackLines = this.getErrorStackLines();
            const emoji = "(╯°□°）╯︵";
            const normalTable = "┳━┳";
            const upsideDownTable = " ┻━┻";

            return (
                <div className="error-boundary">
                    <div className="error-boundary-content">
                        <div className="error-boundary-emoji">
                            <div className="glitch" data-text={`${emoji}${normalTable}`}>
                                {emoji}
                                {upsideDownTable}
                            </div>
                        </div>
                        <div className="error-boundary-text">{"Something went wrong :C"}</div>
                        <div className="error-boundary-error-details">
                            {error?.toString() || "Unknown error"}
                        </div>
                        {stackLines.length > 0 && (
                            <div className="error-boundary-error-lines">
                                {stackLines.map((line, index) => (
                                    <div key={index} className="error-boundary-error-line">
                                        {line}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return children;
    }
}
