import { useEffect } from "react";

import { useEngineContext } from "contexts";

import { RenderingPipeline } from "core/effects/RenderingPipeline";
import { PostProcessesPipeline } from "core/effects/PostProcessesPipeline";

export const useMenuEffects = () => {
    const { engineSceneRef } = useEngineContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const defaultRenderingPipeline = new RenderingPipeline(scene);
        defaultRenderingPipeline.create(scene.activeCamera!);
        // defaultRenderingPipeline.enableFXAA();

        const postProcesses = new PostProcessesPipeline(scene, scene.activeCamera!);
        postProcesses.createGridLayoutPostProcess();

        return () => {
            defaultRenderingPipeline.dispose();
            postProcesses.dispose();
        };
    }, []);
};
