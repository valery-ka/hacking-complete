import { useEffect } from "react";

import { useEngineContext, useVersesContext } from "contexts";
import { AdvancedDynamicTexture } from "@babylonjs/gui";

import { createHPBar } from "assets/ui/hp-bar";
import { REFERENCE_HEIGHT, REFERENCE_WIDTH } from "core_constants";

export const useBabylonBossGUI = () => {
    const { engineSceneRef } = useEngineContext();
    const { restartKey, currentVerseConfig } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const isBossVerse = currentVerseConfig.settings.is_boss;
        if (!isBossVerse) return;

        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI-Boss-HP-Bar");

        ui.idealWidth = REFERENCE_WIDTH;
        ui.idealHeight = REFERENCE_HEIGHT;
        ui.renderAtIdealSize = true;

        const hpContainer = createHPBar(ui);
        scene.metadata.hp_bar = hpContainer;

        return () => {
            hpContainer.dispose();
            ui.dispose();

            scene.metadata.hp_bar = null;
        };
    }, [currentVerseConfig, restartKey]);
};
