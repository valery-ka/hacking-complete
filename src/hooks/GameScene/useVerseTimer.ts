import { useEffect } from "react";

import { AdvancedDynamicTexture, TextBlock } from "@babylonjs/gui";

import { useEngineContext, useVersesContext } from "contexts";

const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(centiseconds).padStart(2, "0")}`;
};

const COLOR_1 = "#e7e2d5";
const COLOR_2 = "#E17E6C";

export const useVerseTimer = () => {
    const { engineSceneRef } = useEngineContext();
    const { restartKey, currentVerseConfig } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const timerCount = currentVerseConfig.settings.timer;
        if (!timerCount) return;

        const player = scene.metadata.players[0];
        if (!player) return;

        const ui = AdvancedDynamicTexture.CreateFullscreenUI("VerseTimer");
        ui.renderAtIdealSize = true;

        const timerText = new TextBlock();
        timerText.color = COLOR_1;
        timerText.fontSize = 24;
        timerText.text = formatTime(timerCount);

        ui.addControl(timerText);

        timerText.linkWithMesh(player);

        timerText.linkOffsetX = 100;
        timerText.linkOffsetY = 0;

        timerText.fontWeight = "700";
        timerText.fontFamily = "monospace";
        timerText.scaleY = 0.9;

        timerText.shadowBlur = 2;

        const gameClock = scene.metadata.gameClock;

        let timeLeft = timerCount;
        let colorChanged = false;

        const unsubscribe = gameClock.subscribe((dt: number) => {
            timeLeft -= gameClock.getGlobalDeltaTime() * 1000;

            timerText.text = formatTime(Math.max(0, timeLeft));

            if (timeLeft <= 5000 && !colorChanged) {
                timerText.color = COLOR_2;
                colorChanged = true;
            }

            if (timeLeft <= 0) {
                timerText.text = "00:00:00";
                player?.metadata?.callbacks?.destroy?.(false, true);
            }
        });

        const timerMeta = { ui, timerText, unsubscribe };

        scene.metadata.timer = timerMeta;

        return () => {
            unsubscribe();
            timerText.dispose();
            ui.dispose();
        };
    }, [currentVerseConfig, restartKey]);
};
