import { createContext, useContext, useRef, ReactNode, useState } from "react";
import { Engine, Scene } from "@babylonjs/core";

import { Undefinable, Nullable } from "types/common";

interface EngineContextType {
    engineRef: React.RefObject<Undefinable<Engine>>;
    engineSceneRef: React.RefObject<Undefinable<Scene>>;
    engineCanvasRef: React.RefObject<Nullable<HTMLCanvasElement>>;
    isSceneReady: boolean;
    setIsSceneReady: React.Dispatch<React.SetStateAction<boolean>>;
}

const EngineContext = createContext<Undefinable<EngineContextType>>(undefined);

interface EngineProviderProps {
    children: ReactNode;
}

export const EngineProvider = ({ children }: EngineProviderProps) => {
    const engineRef = useRef<Undefinable<Engine>>(undefined);
    const engineSceneRef = useRef<Undefinable<Scene>>(undefined);
    const engineCanvasRef = useRef<Nullable<HTMLCanvasElement>>(null);

    const [isSceneReady, setIsSceneReady] = useState(false);

    return (
        <EngineContext.Provider
            value={{
                engineRef,
                engineSceneRef,
                engineCanvasRef,
                isSceneReady,
                setIsSceneReady,
            }}
        >
            {children}
        </EngineContext.Provider>
    );
};

export const useEngineContext = () => {
    const context = useContext(EngineContext);
    if (context === undefined) {
        throw new Error("useEngineContext must be used within an EngineProvider");
    }
    return context;
};
