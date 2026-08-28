import { Texture } from "@babylonjs/core";
import { createContext, ReactNode, useContext, useState, useRef } from "react";

import { ChapterLoadingOverlay } from "assets/ui/chapter-loading";

interface GameStateContextType {
    gameState: string;
    setGameState: React.Dispatch<React.SetStateAction<string>>;
    isPaused: boolean;
    setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
    menuTextureRef: React.RefObject<Texture | null>;
    chapterLoadingOverlayRef: React.RefObject<ChapterLoadingOverlay | null>;
    menuLockedRef: React.RefObject<boolean>;
    inputLockedRef: React.RefObject<boolean>;
    controlsLockedRef: React.RefObject<boolean>;
    playerIsDeadRef: React.RefObject<boolean>;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
    const [gameState, setGameState] = useState<string>("menu");
    const [isPaused, setIsPaused] = useState<boolean>(false);

    const menuTextureRef = useRef<Texture | null>(null);
    const chapterLoadingOverlayRef = useRef<ChapterLoadingOverlay | null>(null);
    const menuLockedRef = useRef<boolean>(false);
    const inputLockedRef = useRef<boolean>(false);
    const controlsLockedRef = useRef<boolean>(false);
    const playerIsDeadRef = useRef<boolean>(false);

    return (
        <GameStateContext.Provider
            value={{
                gameState,
                setGameState,
                menuTextureRef,
                chapterLoadingOverlayRef,
                menuLockedRef,
                isPaused,
                setIsPaused,
                inputLockedRef,
                controlsLockedRef,
                playerIsDeadRef,
            }}
        >
            {children}
        </GameStateContext.Provider>
    );
};

export const useGameState = () => {
    const ctx = useContext(GameStateContext);
    if (!ctx) throw new Error("useGameState must be inside provider");
    return ctx;
};
