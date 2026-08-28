import { useEffect } from "react";
import { useEngineContext } from "contexts";

/**
 * Shared Engine survives GameScene unmounts (menu ↔ game). Do not call
 * releaseEffects / wipe texture caches here — that races the still-running
 * render loop (cleanup runs before useBabylonGameEngine stops it) and can
 * native-crash Electron with ACCESS_VIOLATION.
 */
export const useBabylonEngineCleaner = () => {
    const { engineRef } = useEngineContext();

    useEffect(() => {
        void engineRef;
    }, [engineRef]);
};
