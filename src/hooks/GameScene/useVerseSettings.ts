import { useEffect } from "react";

import { useVersesContext, useEngineContext } from "contexts";

export const useVerseSettings = () => {
    const { engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        scene.metadata.verse_settings = currentVerseConfig.settings;
    }, [currentVerseConfig, restartKey]);
};
