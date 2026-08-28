import { useEffect } from "react";

import { useEngineContext, useVersesContext } from "contexts";

import { EnemiesPool } from "core/enemy/EnemiesPool";

export const useBabylonEnemy = () => {
    const { engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;
        const enemiesConfig = currentVerseConfig.enemies;
        scene.metadata.enemies = [];

        const enemies = new EnemiesPool(scene);
        enemies.create(enemiesConfig);

        return () => {
            enemies.dispose();
        };
    }, [currentVerseConfig, restartKey]);
};
