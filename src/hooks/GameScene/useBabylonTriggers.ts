import { useEffect } from "react";
import { useEngineContext, useVersesContext } from "contexts";

import { Triggers } from "core/triggers/Triggers";

export const useBabylonTriggers = () => {
    const { engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        scene.metadata.triggers = [];

        const walls = currentVerseConfig.walls;
        const enemies = currentVerseConfig.enemies;
        const invTriggers = currentVerseConfig.triggers;

        const startEnemyPools = currentVerseConfig.settings.start_enemy_pools;
        const finishPool = currentVerseConfig.settings.finish_pool;
        const poolsByKilling = currentVerseConfig.settings.pools_by_killing;

        const triggers = new Triggers(scene, invTriggers, finishPool);
        triggers.create(enemies, startEnemyPools, walls, poolsByKilling, currentVerseConfig.music);

        return () => {
            triggers.dispose();
        };
    }, [currentVerseConfig, restartKey]);
};
