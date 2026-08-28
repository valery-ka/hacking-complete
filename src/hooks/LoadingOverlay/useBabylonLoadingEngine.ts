import { useEffect } from "react";

import { Scene, Color4, FreeCamera, Vector3 } from "@babylonjs/core";

import { useEngineContext } from "contexts";
import { getSharedEngine } from "utils/babylon";

import { Nullable } from "types/common";

interface IUseBabylonEngine {
    engineCanvasRef: React.RefObject<Nullable<HTMLCanvasElement>>;
}

const BACKGROUND_COLOR = { r: 0.105, g: 0.09, b: 0.07, a: 1.0 };

export const useBabylonLoadingEngine = ({ engineCanvasRef }: IUseBabylonEngine) => {
    const { engineRef, engineSceneRef } = useEngineContext();

    useEffect(() => {
        const canvas = engineCanvasRef.current;
        if (!canvas) return;

        const engine = getSharedEngine(canvas, engineRef);

        const scene = new Scene(engine);
        const camera = new FreeCamera("loading-overlay-camera", new Vector3(0, 0, 0), scene);

        const { r, g, b, a } = BACKGROUND_COLOR;
        scene.clearColor = new Color4(r, g, b, a);

        engine.setHardwareScalingLevel(1.0);

        engine.runRenderLoop(() => {
            scene.render();
        });

        const handleResize = () => {
            engine.resize();
        };

        scene.metadata = { ...scene.metadata, canvas, engine };
        engineSceneRef.current = scene;

        window.addEventListener("resize", handleResize);

        return () => {
            engine.stopRenderLoop();
            camera.dispose();
            scene.dispose();
            engine.releaseEffects();
            engine.releaseComputeEffects();
            window.removeEventListener("resize", handleResize);
        };
    }, [engineCanvasRef, engineRef, engineSceneRef]);
};
