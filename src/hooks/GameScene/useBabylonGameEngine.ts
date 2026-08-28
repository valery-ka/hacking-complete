import * as CANNON from "cannon";
import "@babylonjs/core/Physics/physicsEngineComponent";

import { useEffect, useRef } from "react";

import { Scene, Color4, Vector3, CannonJSPlugin, Layer } from "@babylonjs/core";

import { useEngineContext, useGameState, useAudioEngine, useVersesContext } from "contexts";
import { breadcrumb } from "utils/diagnostics";
import { disposeMenuTexture } from "utils/babylon";

import { applyPhysicsSubsteps } from "utils/physicsSettings";
import { Nullable } from "types/common";

interface IUseBabylonEngine {
    engineCanvasRef: React.RefObject<Nullable<HTMLCanvasElement>>;
}

const BACKGROUND_COLOR_2 = { r: 0.31, g: 0.3, b: 0.25, a: 1.0 };
const HEARTBEAT_MS = 10_000;

export const useBabylonGameEngine = ({ engineCanvasRef }: IUseBabylonEngine) => {
    const { engineRef, engineSceneRef, isSceneReady } = useEngineContext();
    const { menuTextureRef, chapterLoadingOverlayRef } = useGameState();
    const { audioManagerRef } = useAudioEngine();
    const { selectedVerse, restartKey } = useVersesContext();

    const tempLayerRef = useRef<Nullable<Layer>>(null);

    useEffect(() => {
        const engine = engineRef.current;
        const canvas = engineCanvasRef.current;
        if (!canvas || !engine) return;

        const scene = new Scene(engine);

        const { r, g, b, a } = BACKGROUND_COLOR_2;
        scene.clearColor = new Color4(r, g, b, a);

        const texture = menuTextureRef.current;
        const url = texture?.url;
        const layer = url ? new Layer("bg", url, scene) : null;
        tempLayerRef.current = layer;
        breadcrumb("game.engine.created", { hasScreenshot: Boolean(url) });

        scene.enablePhysics(new Vector3(0, 0, 0), new CannonJSPlugin(true, 10, CANNON));

        engine.setHardwareScalingLevel(1.0);

        applyPhysicsSubsteps(scene);

        const handleResize = () => {
            engine.resize();
        };

        scene.metadata = {
            ...scene.metadata,
            canvas,
            engine,
            audio_engine: audioManagerRef.current,
            suspendRendering: false,
        };

        engineSceneRef.current = scene;

        window.addEventListener("resize", handleResize);

        // Must tolerate SceneOptimizer disposing the scene while this loop is still
        // registered (React cleans later hooks first). Never render a disposed scene.
        engine.runRenderLoop(() => {
            const currentScene = engineSceneRef.current;
            if (
                !currentScene ||
                currentScene.isDisposed ||
                currentScene.metadata?.suspendRendering
            ) {
                return;
            }
            const screenshotLayer = tempLayerRef.current;
            if (screenshotLayer && !screenshotLayer.isReady()) return;
            currentScene.render();
        });

        return () => {
            breadcrumb("game.engine.dispose");
            // Stop first — SceneOptimizer may already have disposed the scene.
            engine.stopRenderLoop();
            if (scene.metadata) scene.metadata.suspendRendering = true;
            tempLayerRef.current = null;
            disposeMenuTexture(menuTextureRef);
            window.removeEventListener("resize", handleResize);
        };
    }, [audioManagerRef, engineCanvasRef, engineRef, engineSceneRef, menuTextureRef]);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;
        if (!isSceneReady) return;

        const layer = tempLayerRef.current;
        tempLayerRef.current = null;
        layer?.dispose();

        const overlay = chapterLoadingOverlayRef.current;
        if (overlay) {
            chapterLoadingOverlayRef.current = null;
            overlay.dispose();
        }
        scene.metadata.suspendRendering = false;
        breadcrumb("game.engine.sceneReady", {
            verse: selectedVerse,
            restartKey,
            splitScreen: Boolean(scene.activeCameras?.length),
            cameras: scene.activeCameras?.length ?? (scene.activeCamera ? 1 : 0),
        });
    }, [chapterLoadingOverlayRef, engineSceneRef, isSceneReady, restartKey, selectedVerse]);

    // Survives native crashes: last heartbeat shows which verse/GPU load we died on.
    useEffect(() => {
        if (!isSceneReady) return;

        const tick = () => {
            const scene = engineSceneRef.current;
            const engine = engineRef.current;
            if (!scene || scene.isDisposed || !engine) return;

            breadcrumb("game.heartbeat", {
                verse: selectedVerse,
                restartKey,
                fps: Math.round(engine.getFps()),
                meshes: scene.meshes.length,
                materials: scene.materials.length,
                textures: scene.textures.length,
                enemies: scene.metadata?.enemies?.length ?? 0,
                activeCameras: scene.activeCameras?.length ?? (scene.activeCamera ? 1 : 0),
            });
        };

        tick();
        const id = window.setInterval(tick, HEARTBEAT_MS);
        return () => window.clearInterval(id);
    }, [engineRef, engineSceneRef, isSceneReady, restartKey, selectedVerse]);
};
