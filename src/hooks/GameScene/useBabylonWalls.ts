import { useEffect } from "react";

import { useEngineContext, useVersesContext } from "contexts";

import { Walls } from "core/static/Walls";

export const useBabylonWalls = () => {
    const { engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        scene.metadata.walls = [];

        const walls = new Walls(scene);
        const wallsConfig = currentVerseConfig.walls;

        walls.create(wallsConfig);

        return () => {
            walls.dispose();
        };
    }, [currentVerseConfig, restartKey]);
};
