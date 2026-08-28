import { useEffect } from "react";
import { useEngineContext, useVersesContext } from "contexts";
import { InstancedMesh, Mesh, ShadowGenerator, TransformNode } from "@babylonjs/core";

export const useBabylonSceneOptimizer = () => {
    const { engineSceneRef, setIsSceneReady } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const walls = scene.metadata.walls;
        const shadows = scene.metadata.shadows;

        const wallGroups: { [key: string]: Mesh[] } = {};
        const toDispose: TransformNode[] = [];

        const mergedGroups = <Mesh[]>[];

        walls.forEach((wall: Mesh) => {
            if (wall.metadata.mergeable === true) {
                const baseName = wall.name.replace(/-\d+$/, "");

                if (!wallGroups[baseName]) {
                    wallGroups[baseName] = [];
                }

                const parent = wall.parent as TransformNode;
                if (parent) {
                    toDispose.push(parent);
                }

                wallGroups[baseName].push(wall);
            }
        });

        mergedGroups.forEach((mesh) => {
            if (mesh && !mesh.isDisposed()) {
                mesh.dispose();
            }
        });

        Object.values(wallGroups).forEach((group: Mesh[]) => {
            const merged = Mesh.MergeMeshes(group, true, true, undefined, false, false);
            if (merged) {
                merged.name = "static-merged-group";
                mergedGroups.push(merged);
                shadows.forEach((generator: ShadowGenerator) => {
                    const light = generator.getLight();
                    const staticShadow = light?.metadata?.config?.shadowType === "static";

                    if (staticShadow) {
                        generator.addShadowCaster(merged);
                    }
                });
            }
        });

        toDispose.forEach((transformNode) => {
            if (transformNode && !transformNode.isDisposed()) {
                transformNode.dispose();
            }
        });

        scene.metadata.suspendRendering = false;
        setIsSceneReady(true);

        return () => {
            scene.metadata.suspendRendering = true;
            mergedGroups.forEach((mesh) => {
                if (mesh && !mesh.isDisposed()) {
                    mesh.dispose();
                }
            });

            setIsSceneReady(false);
        };
    }, [currentVerseConfig, restartKey]);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const meshAddedObserver = scene.onNewMeshAddedObservable.add((mesh) => {
            if (mesh instanceof InstancedMesh) {
                mesh.alwaysSelectAsActiveMesh = true;
            }
        });

        return () => {
            scene.onNewMeshAddedObservable.remove(meshAddedObserver);
        };
    }, []);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        return () => {
            // React cleans this hook BEFORE useBabylonGameEngine. Stop drawing
            // immediately or the render loop hits freed GPU objects → 0xC0000005.
            if (scene.metadata) scene.metadata.suspendRendering = true;
            try {
                scene.getEngine()?.stopRenderLoop();
            } catch {
                // engine may already be tearing down
            }

            if (scene.isDisposed) {
                document.exitPointerLock();
                return;
            }

            const meta = scene.metadata;
            if (!meta) {
                scene.dispose();
                document.exitPointerLock();
                return;
            }

            for (const key in meta.bullet_assets) {
                meta.bullet_assets[key].dispose();
                meta.bullet_assets[key] = null;
            }
            meta.bullet_assets = {};

            meta.callbacks = null;

            for (let i = 0; i < meta.cameras.length; i++) {
                const camera = meta.cameras[i];
                camera.dispose();
                meta.cameras[i] = null;
            }
            meta.cameras = null;

            meta.collisions.enemy_bullets.dispose();
            meta.collisions.player_bullets.dispose();
            meta.collisions = {};

            meta.configs.camera = [];
            meta.configs = {};

            for (let i = 0; i < meta.enemies.length; i++) {
                const enemy = meta.enemies[i];
                enemy.dispose();
                meta.enemies[i] = null;
            }
            meta.enemies = [];

            for (const key in meta.effects) {
                meta.effects[key] = null;
            }
            meta.effects = {};

            for (const key in meta.effects_assets) {
                meta.effects_assets[key].dispose();
                meta.effects_assets[key] = null;
            }
            meta.effects_assets = {};

            meta.enemies_pool_class = null;
            meta.triggers_class = null;

            for (const key in meta.enemy_assets) {
                meta.enemy_assets[key].dispose();
                meta.enemy_assets[key] = null;
            }
            meta.enemy_assets = {};

            meta.engine = null;

            meta.gameClock = null;

            for (let i = 0; i < meta.grounds.length; i++) {
                const ground = meta.grounds[i];
                ground.dispose();
                meta.grounds[i] = null;
            }
            meta.grounds = [];

            meta.killing_counter = 0;

            for (let i = 0; i < meta.lights.length; i++) {
                const light = meta.lights[i];
                light.dispose();
                meta.lights[i] = null;
            }
            meta.lights = [];

            for (const key in meta.player_assets) {
                meta.player_assets[key].dispose?.();
                meta.player_assets[key] = null;
            }
            meta.player_assets = {};

            for (let i = 0; i < meta?.players?.length; i++) {
                const player = meta.players[i];
                player.dispose();
                meta.players[i] = null;
            }
            if (meta?.players) meta.players = [];
            if (meta?.players_shooter_classes) meta.players_shooter_classes = [];

            for (const key in meta.textures) {
                meta.textures[key].dispose();
                meta.textures[key] = null;
            }
            meta.textures = {};

            scene.metadata.verse_settings = {};

            for (const key in meta.wall_assets) {
                meta.wall_assets[key].dispose();
                meta.wall_assets[key] = null;
            }
            meta.wall_assets = {};

            for (let i = 0; i < meta.walls.length; i++) {
                const light = meta.walls[i];
                light.dispose();
                meta.walls[i] = null;
            }
            meta.walls = [];

            meta.walls_class = null;

            meta.audio_engine = null;

            scene.dispose();

            document.exitPointerLock();
        };
    }, []);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        return () => {
            const meta = scene.metadata;

            if (meta?.callbacks) meta.callbacks = null;

            const effects = meta?.effects;
            effects?.post_processes0?.dispose?.();
            effects?.post_processes1?.dispose?.();
            effects?.rendering_pipeline?.dispose?.();

            for (let i = 0; i < meta?.cameras?.length; i++) {
                const camera = meta.cameras[i];
                camera.dispose();
                meta.cameras[i] = null;
            }
            if (meta?.cameras) meta.cameras = null;

            if (meta?.configs?.camera) meta.configs.camera = [];
            if (meta?.configs) meta.configs = {};

            for (let i = 0; i < meta?.enemies?.length; i++) {
                const enemy = meta.enemies[i];
                enemy.dispose();
                meta.enemies[i] = null;
            }
            if (meta?.enemies) meta.enemies = [];

            if (meta?.enemies_pool_class) meta.enemies_pool_class = null;
            if (meta?.triggers_class) meta.triggers_class = null;

            for (let i = 0; i < meta?.grounds?.length; i++) {
                const ground = meta.grounds[i];
                ground.dispose();
                meta.grounds[i] = null;
            }
            if (meta?.grounds) meta.grounds = [];

            if (meta?.killing_counter) meta.killing_counter = 0;

            for (let i = 0; i < meta?.lights?.length; i++) {
                const light = meta.lights[i];
                light.dispose();
                meta.lights[i] = null;
            }
            if (meta?.lights) meta.lights = [];

            for (let i = 0; i < meta?.players?.length; i++) {
                const player = meta.players[i];
                player.dispose();
                meta.players[i] = null;
            }
            if (meta?.players) meta.players = [];
            if (meta?.players_shooter_classes) meta.players_shooter_classes = [];

            if (meta?.verse_settings) meta.verse_settings = {};

            for (let i = 0; i < meta?.walls?.length; i++) {
                const wall = meta.walls[i];
                wall.dispose();
                meta.walls[i] = null;
            }
            if (meta?.walls) meta.walls = [];

            if (meta?.walls_class) meta.walls_class = null;
        };
    }, [currentVerseConfig, restartKey]);
};
