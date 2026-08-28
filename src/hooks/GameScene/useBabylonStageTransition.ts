import { useEffect } from "react";
import { useEngineContext, useGameState, useVersesContext } from "contexts";
import { Camera, PostProcess, Scene, Texture } from "@babylonjs/core";
import { disposeMenuTexture } from "utils/babylon";

const EFFECT_DURATION = 250;

const getTransitionCameras = (scene: Scene): Camera[] => {
    const splitCameras = scene.activeCameras?.filter((camera) => camera.name !== "ui-camera");
    if (splitCameras?.length) return splitCameras;
    return scene.activeCamera ? [scene.activeCamera] : [];
};

export const useBabylonStageTransition = () => {
    const { engineSceneRef, engineCanvasRef, isSceneReady } = useEngineContext();
    const { menuTextureRef, inputLockedRef } = useGameState();
    const { selectedVerse, restartKey } = useVersesContext();

    useEffect(() => {
        if (!isSceneReady) return;

        const scene = engineSceneRef.current;
        const canvas = engineCanvasRef.current;
        const menuTexture = menuTextureRef.current;

        if (!scene || !menuTexture || !canvas) return;

        const cameras = getTransitionCameras(scene);
        if (!cameras.length) return;

        inputLockedRef.current = true;

        if (document.pointerLockElement !== canvas) {
            canvas.requestPointerLock();
        }

        const audioEngine = scene.metadata.audio_engine?.getCommonAudio();

        let startTime: number | null = null;
        let animationFrameId: number;
        let currentProgress = 1;
        let finished = false;

        const postProcesses = cameras.map((camera) => {
            const { x, y, width, height } = camera.viewport;

            const postProcess = new PostProcess(
                "transition",
                "transition",
                ["progress", "viewportOffset", "viewportScale"],
                ["menuTexture"],
                1.0,
                camera,
                Texture.BILINEAR_SAMPLINGMODE,
                scene.getEngine(),
                false,
            );

            postProcess.onApply = (effect) => {
                effect.setTexture("menuTexture", menuTexture);
                effect.setFloat("progress", currentProgress);
                effect.setFloat2("viewportOffset", x, y);
                effect.setFloat2("viewportScale", width, height);
            };

            return postProcess;
        });

        const disposePostProcesses = () => {
            postProcesses.forEach((postProcess) => postProcess.dispose());
        };

        const finishTransition = () => {
            if (finished) return;
            finished = true;
            disposePostProcesses();
            // Last consumer of the freeze-frame; free the base64 Texture from the shared engine.
            disposeMenuTexture(menuTextureRef);
            setTimeout(() => {
                inputLockedRef.current = false;
            }, 1000);
        };

        const animate = (time: number) => {
            if (!startTime) {
                startTime = time;
                audioEngine?.playSound("transition_after");
            }
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / EFFECT_DURATION, 1);

            currentProgress = 1 - progress;

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                finishTransition();
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            disposePostProcesses();
            if (!finished) {
                disposeMenuTexture(menuTextureRef);
            }
        };
    }, [
        selectedVerse,
        isSceneReady,
        restartKey,
        engineSceneRef,
        engineCanvasRef,
        menuTextureRef,
        inputLockedRef,
    ]);
};
