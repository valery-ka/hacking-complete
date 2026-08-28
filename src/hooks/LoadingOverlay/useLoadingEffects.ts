import { useEffect } from "react";

import { useEngineContext } from "contexts";

import { RenderingPipeline } from "core/effects/RenderingPipeline";
import { PostProcessesPipeline } from "core/effects/PostProcessesPipeline";

export const useLoadingEffects = () => {
    const { engineSceneRef } = useEngineContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const defaultRenderingPipeline = new RenderingPipeline(scene);
        defaultRenderingPipeline.create(scene.activeCamera!);

        const postProcesses = new PostProcessesPipeline(scene, scene.activeCamera!);
        postProcesses.createGlitch01PostProcess();
        postProcesses.createGridLayoutPostProcess(7, 0.4);

        return () => {
            defaultRenderingPipeline.dispose();
            postProcesses.dispose();
        };
    }, []);
};
