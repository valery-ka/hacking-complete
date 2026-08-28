import { useEffect } from "react";

import { useEngineContext, useVersesContext } from "contexts";

import { Ground } from "core/static/Ground";

export const useBabylonGround = () => {
    const { engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const groundConfigs = currentVerseConfig.ground;
        const ground = new Ground(scene);

        ground.create(groundConfigs);

        return () => {
            ground.dispose();
        };
    }, [currentVerseConfig, restartKey]);
};
