import {
    createContext,
    useContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
    useMemo,
    useEffect,
} from "react";
import * as V from "verses";
import { VerseConfig } from "verses/verse.types";

import { Undefinable } from "types/common";

interface VersesContextType {
    selectedVerse: string;
    setSelectedVerse: Dispatch<SetStateAction<string>>;
    currentVerseConfig: VerseConfig;

    restartKey: number;
    restartVerse: () => void;
}

const VersesContext = createContext<Undefinable<VersesContextType>>(undefined);

interface VersesProviderProps {
    children: ReactNode;
}

export const VersesProvider = ({ children }: VersesProviderProps) => {
    const [selectedVerse, setSelectedVerse] = useState<string>("00");

    const currentVerseConfig = useMemo(
        () => V[`verse${selectedVerse}` as keyof typeof V],
        [selectedVerse],
    );

    useEffect(() => {
        console.log(
            `%cVERSE: ${selectedVerse}`,
            "font-size: 14px; font-weight: bold; color: #00ff00; background: #1a1a1a; padding: 4px 8px; border-radius: 4px;",
        );
    }, [selectedVerse]);

    const [restartKey, setRestartKey] = useState(0);

    const restartVerse = () => {
        setRestartKey((prev) => prev + 1);
    };

    return (
        <VersesContext.Provider
            value={{
                selectedVerse,
                setSelectedVerse,
                currentVerseConfig,
                restartKey,
                restartVerse,
            }}
        >
            {children}
        </VersesContext.Provider>
    );
};

export const useVersesContext = () => {
    const context = useContext(VersesContext);
    if (!context) {
        throw new Error("useVersesContext must be used within an VersesProvider");
    }
    return context;
};
