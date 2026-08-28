import { useEffect } from "react";
import { useAudioEngine } from "contexts";

export const useGameLoading = () => {
    const { audioEngineLoaded } = useAudioEngine();

    useEffect(() => {
        if (!audioEngineLoaded) return;

        console.log("game loaded");
    }, [audioEngineLoaded]);
};
