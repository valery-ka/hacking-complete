import { useEffect } from "react";
import { useEngineContext, useVersesContext } from "contexts";

import { UtilityLayerRenderer } from "@babylonjs/core";
import {
    createSelfDestructionUI,
    animate,
    updateTimer,
    updateWiggle,
} from "assets/ui/self-destruction";
import { REFERENCE_HEIGHT, REFERENCE_WIDTH } from "core_constants";
import { disposeUtilityLayer } from "utils/babylon";

export const useSelfDestructionLayout = () => {
    const { currentVerseConfig, restartKey } = useVersesContext();
    const { engineRef, engineSceneRef } = useEngineContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const engine = engineRef.current;
        if (!engine) return;

        const utilityLayer = new UtilityLayerRenderer(scene);
        const ui = createSelfDestructionUI(utilityLayer);

        ui.idealWidth = REFERENCE_WIDTH;
        ui.idealHeight = REFERENCE_HEIGHT;
        ui.renderAtIdealSize = true;

        const showSelfDestructUI = () => {
            animate(ui, true);
        };

        const updateSelfDestructUI = (value: string) => {
            updateTimer(ui, value);
            updateWiggle(ui);
        };

        const hideSelfDestructUI = () => {
            animate(ui, false);
        };

        scene.metadata.callbacks = {
            ...scene.metadata.callbacks,
            show_self_destruct_ui: () => showSelfDestructUI(),
            hide_self_destruct_ui: () => hideSelfDestructUI(),
            update_self_destruct_ui: (value: string) => updateSelfDestructUI(value),
        };

        // utilityLayer.utilityLayerScene?.debugLayer?.show({ embedMode: true, overlay: true });

        return () => {
            ui.dispose();
            disposeUtilityLayer(utilityLayer);
        };
    }, [currentVerseConfig, restartKey]);
};
