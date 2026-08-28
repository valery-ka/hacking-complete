import { useEffect } from "react";

import { useEngineContext, useVersesContext } from "contexts";

import { Shadows } from "core/engine/Shadows";

export const useBabylonShadows = () => {
    const { engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        scene.metadata.shadows = [];

        const shadowsConfig = currentVerseConfig.shadows;
        const shadows = new Shadows(scene);

        shadows.create(shadowsConfig);

        return () => {
            shadows.dispose();
        };
    }, [currentVerseConfig, restartKey]);
};
