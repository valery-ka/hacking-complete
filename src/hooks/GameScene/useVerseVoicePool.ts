import { useEffect } from "react";
import { Observer, Scene } from "@babylonjs/core";

import { useEngineContext, useVersesContext } from "contexts";
import { Nullable } from "types/common";

export const useVerseVoicePool = () => {
    const { engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const poolId = currentVerseConfig.settings.voice_pool;
        if (!poolId) return;

        const voiceAudio = scene.metadata.audio_engine?.getVoiceAudio();
        if (!voiceAudio?.hasSoundPool(poolId)) return;

        const delay = Math.max(0, currentVerseConfig.settings.voice_pool_delay ?? 5);
        let elapsed = 0;
        let state: "delaying" | "playing" = "delaying";
        let observer: Nullable<Observer<Scene>> = null;
        let disposed = false;

        const playNext = () => {
            if (disposed) return;

            const soundName = voiceAudio.playNextFromPool(poolId);
            if (!soundName) {
                state = "delaying";
                return;
            }

            state = "playing";

            const sound = voiceAudio.getSound(soundName);
            if (!sound) {
                state = "delaying";
                return;
            }

            sound.onEndedObservable.addOnce(() => {
                if (disposed) return;
                elapsed = 0;
                state = "delaying";
            });
        };

        observer = scene.onBeforeRenderObservable.add(() => {
            if (state !== "delaying") return;

            const gameClock = scene.metadata.gameClock;
            if (!gameClock || gameClock.paused) return;

            elapsed += gameClock.getGlobalDeltaTime();
            if (elapsed < delay) return;

            elapsed = 0;
            playNext();
        });

        return () => {
            disposed = true;

            if (observer) {
                scene.onBeforeRenderObservable.remove(observer);
                observer = null;
            }

            voiceAudio?.stopSoundPool?.(poolId);
        };
    }, [currentVerseConfig, restartKey, engineSceneRef]);
};
