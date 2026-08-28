import { useEffect, useRef } from "react";

import { useEngineContext } from "contexts";

import { BulletCollisionManager } from "core/bullet/BulletCollisionManager";

export const useBabylonCollisions = () => {
    const { engineSceneRef } = useEngineContext();

    const playerBulletCollisionManagerRef = useRef<BulletCollisionManager>(null);
    const enemyBulletCollisionManagerRef = useRef<BulletCollisionManager>(null);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        playerBulletCollisionManagerRef.current = new BulletCollisionManager(0);
        playerBulletCollisionManagerRef.current.initialize(scene);

        enemyBulletCollisionManagerRef.current = new BulletCollisionManager(1);
        enemyBulletCollisionManagerRef.current.initialize(scene);

        scene.metadata.collisions = {
            ...scene.metadata.collisions,
            player_bullets: playerBulletCollisionManagerRef.current,
            enemy_bullets: enemyBulletCollisionManagerRef.current,
        };

        return () => {
            playerBulletCollisionManagerRef.current?.dispose();
            enemyBulletCollisionManagerRef.current?.dispose();
            playerBulletCollisionManagerRef.current = null;
            enemyBulletCollisionManagerRef.current = null;
        };
    }, []);
};
