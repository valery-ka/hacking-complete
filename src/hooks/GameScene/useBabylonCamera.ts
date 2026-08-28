import { useEffect } from "react";

import { useEngineContext, useVersesContext } from "contexts";

import { Camera } from "core/engine/Camera";
import { ArcRotateCamera, Vector3, Viewport } from "@babylonjs/core";

export const useBabylonCamera = () => {
    const { engineSceneRef } = useEngineContext();
    const { restartKey, currentVerseConfig } = useVersesContext();

    const createUICamera = () => {
        const camera = new ArcRotateCamera("ui-camera", 0, 0, 0, new Vector3(10e10, 10e10, 10e10));
        camera.mode = 1;
        // Keep default bits so UtilityLayer UIs (pause/death/finish) still render,
        // plus 0x10000000 for split-screen-only HUD (e.g. auto-aim).
        camera.layerMask = 0x0fffffff | 0x10000000;
        return camera;
    };

    useEffect(() => {
        const scene = engineSceneRef.current;
        const canvas = scene?.metadata.canvas;
        if (!canvas || !scene) return;

        const audioEngine = scene.metadata.audio_engine;

        const cameraConfig = currentVerseConfig.camera;
        const settingsConfig = currentVerseConfig.settings;

        scene.metadata.cameras = [];

        const camera0 = new Camera(scene);
        const camera00 = camera0.create(cameraConfig[0], 0);

        let camera11;
        let camera1: Camera;
        let uiCamera: ArcRotateCamera;

        if (settingsConfig.split_screen.enabled) {
            camera1 = new Camera(scene);
            camera11 = camera1.create(cameraConfig[1], 1);

            if (settingsConfig.split_screen.type === "vertical") {
                camera00.viewport = new Viewport(0, 0.5, 1, 0.5);
                camera11.viewport = new Viewport(0, 0, 1, 0.5);
            } else if (settingsConfig.split_screen.type === "horizontal") {
                camera00.viewport = new Viewport(0, 0, 0.5, 1);
                camera11.viewport = new Viewport(0.5, 0, 0.5, 1);
            }

            uiCamera = createUICamera();
            scene.activeCameras = [camera00, camera11, uiCamera];

            audioEngine?.setSpatialAudioEnabled(false);
        } else {
            scene.activeCamera = camera00;
            audioEngine?.setSpatialAudioEnabled(true);
            audioEngine?.attachSpatialListener(camera00);
        }

        scene.metadata = { ...scene.metadata, configs: { camera: cameraConfig } };

        // let currentCameraIndex = 0;

        // const switchActiveCamera = (e: KeyboardEvent) => {
        //     const activeCamera = scene.activeCamera;

        //     if (e.code === "Digit2") {
        //         const cameras = scene.cameras;
        //         currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
        //         scene.activeCamera = cameras[currentCameraIndex];
        //     } else if (e.code === "Digit3" && activeCamera?.name === "debug-camera") {
        //         if (activeCamera.inputs.attachedToElement) {
        //             activeCamera.detachControl();
        //         } else {
        //             activeCamera.attachControl();
        //         }
        //     }
        // };

        // document.addEventListener("keydown", switchActiveCamera);

        return () => {
            audioEngine?.detachSpatialListener();
            camera0.dispose();
            if (camera1) camera1.dispose();
            if (uiCamera) uiCamera.dispose();

            // document.removeEventListener("keydown", switchActiveCamera);
        };
    }, [restartKey, currentVerseConfig]);
};
