import { useEffect } from "react";

import { useEngineContext, useVersesContext } from "contexts";

import { EffectsAssetsManager } from "core/effects/EffectsMaterialsAssets";
import { EnemyAssetsManager } from "core/enemy/EnemyAssetsManager";
import { BulletAssetsManager } from "core/bullet/BulletAssetsManager";
import { WallAssetsManager } from "core/static/WallAssetsManager";
import { PlayerAssetsManager } from "core/player/PlayerAssetsManager";

export const useBabylonAssets = () => {
    const { engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        BulletAssetsManager.initialize(scene);
        return () => {
            BulletAssetsManager.dispose(scene);
        };
    }, [currentVerseConfig, restartKey]);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        EffectsAssetsManager.initialize(scene);
        EnemyAssetsManager.initialize(scene);
        WallAssetsManager.initialize(scene);
        PlayerAssetsManager.initialize(scene);
    }, []);
};
