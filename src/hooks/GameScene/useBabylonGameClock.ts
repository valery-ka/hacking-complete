import { UtilityLayerRenderer } from "@babylonjs/core";

import { useEffect, useRef } from "react";
import { useGameState, useEngineContext, useVersesContext } from "contexts";

import { GameClock } from "core/engine/GameClock";
import { createPauseUI, animateOpacity, animateTextTyping } from "assets/ui/game-pause-layer";
import { setAutoAimUIVisible } from "utils/autoAim";
import { disposeUtilityLayer } from "utils/babylon";

const LOCK_TIME = 1000;

export const useBabylonGameClock = () => {
    const { engineSceneRef } = useEngineContext();
    const { isPaused, setIsPaused, inputLockedRef, playerIsDeadRef } = useGameState();
    const { currentVerseConfig, restartKey } = useVersesContext();

    const isPausedRef = useRef(isPaused);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const musicEngine = scene.metadata.audio_engine.getMusicAudio();
        const notMuteOnPause = currentVerseConfig?.music?.not_mute_on_pause ?? false;
        const pauseOverrideLayers = currentVerseConfig?.music?.pause_override_layers ?? null;

        musicEngine.gamePaused(false, notMuteOnPause, pauseOverrideLayers);
        setIsPaused(false);
    }, [currentVerseConfig, setIsPaused, restartKey, engineSceneRef]);

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const gameClock = new GameClock(scene);
        scene.metadata.gameClock = gameClock;

        return () => {
            gameClock.dispose();
        };
    }, []);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const utilityLayer = new UtilityLayerRenderer(scene);
        const ui = createPauseUI(utilityLayer);

        const musicEngine = scene.metadata.audio_engine.getMusicAudio();
        const commonEngine = scene.metadata.audio_engine.getCommonAudio();

        const notMuteOnPause = currentVerseConfig?.music?.not_mute_on_pause;
        const pauseOverrideLayers = currentVerseConfig?.music?.pause_override_layers;

        const showPauseUI = () => {
            if (scene.metadata.effects.rendering_pipeline)
                scene.metadata.effects.rendering_pipeline.renderingPipeline.depthOfField.fStop = 2.0;
            setAutoAimUIVisible(scene, false);
            animateOpacity(ui, true);
            animateTextTyping(ui);

            musicEngine.gamePaused(true, notMuteOnPause, pauseOverrideLayers);
            commonEngine.playSound("ui_pause");
        };

        const hidePauseUI = () => {
            if (scene.metadata.effects.rendering_pipeline)
                scene.metadata.effects.rendering_pipeline.renderingPipeline.depthOfField.fStop = 50;
            setAutoAimUIVisible(scene, true);
            animateOpacity(ui, false);

            musicEngine.gamePaused(false, notMuteOnPause, pauseOverrideLayers);
        };

        const pauseGame = () => {
            if (playerIsDeadRef.current || isPausedRef.current) return;

            showPauseUI();
            isPausedRef.current = true;
            scene.metadata.gameClock.setPaused(true);
            setIsPaused(true);
        };

        const togglePause = () => {
            if (inputLockedRef.current || playerIsDeadRef.current) return;

            inputLockedRef.current = true;

            setIsPaused((prev) => {
                const next = !prev;
                next ? showPauseUI() : hidePauseUI();
                isPausedRef.current = next;
                scene.metadata.gameClock.setPaused(next);
                return next;
            });

            setTimeout(() => {
                inputLockedRef.current = false;
            }, LOCK_TIME);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code !== "NumpadEnter" && e.code !== "Enter") return;

            togglePause();
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                pauseGame();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        scene.metadata.callbacks = {
            ...scene.metadata.callbacks,
            toggle_game_pause: () => togglePause(),
        };

        return () => {
            ui.dispose();
            disposeUtilityLayer(utilityLayer);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [restartKey, currentVerseConfig]);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const gameClock = scene.metadata.gameClock;
        gameClock.setPaused(isPaused);
    }, [isPaused, engineSceneRef]);
};
