import { useEffect, useLayoutEffect, useRef } from "react";

import { useEngineContext, useVersesContext, useAudioEngine } from "contexts";

import {
    CategoryVolume,
    MusicSettings,
    MusicTransitionDuration,
    musicConfigToCategoryVolume,
    MUSIC_LAYER_KEYS,
} from "types/music/MusicConfig.types";

export const useVerseMusic = () => {
    const { engineSceneRef } = useEngineContext();

    const { currentVerseConfig, restartKey } = useVersesContext();
    const { currentSong, setCurrentSong, currentLayersVolume, setCurrentLayersVolume } =
        useAudioEngine();
    const layersVolumeDurationRef = useRef<MusicTransitionDuration>(0);
    const prevVerseSongRef = useRef("");
    const prevVerseFadeOutRef = useRef(0);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        scene.metadata.callbacks ??= {};
        scene.metadata.callbacks = {
            ...scene.metadata.callbacks,
            update_music_layers_volume: (volume: CategoryVolume, duration: number = 0) => {
                layersVolumeDurationRef.current = duration;
                setCurrentLayersVolume(volume);
            },
        };
    }, [engineSceneRef, setCurrentLayersVolume, restartKey, currentVerseConfig]);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const musicEngine = scene.metadata.audio_engine.getMusicAudio();
        musicEngine.setInStage(true);

        return () => {
            musicEngine.setInStage(false);
        };
    }, []);

    // Stop the previous verse track before applying the next verse's fade_out_duration.
    // currentVerseConfig updates one render before currentSong, so the currentSong effect
    // cleanup would otherwise call stopChapterSong with the wrong duration.
    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const musicConfig = currentVerseConfig.music;
        const musicEngine = scene.metadata.audio_engine.getMusicAudio();
        const newSong = musicConfig?.name ?? "";
        const oldSong = prevVerseSongRef.current;

        if (oldSong && oldSong !== newSong) {
            musicEngine.stopChapterSong(oldSong, prevVerseFadeOutRef.current);
        }

        prevVerseSongRef.current = newSong;
        prevVerseFadeOutRef.current = musicConfig?.fade_out_duration ?? 0;

        if (musicConfig) {
            setCurrentSong(newSong);
            musicEngine.setFadeOutDuration(musicConfig.fade_out_duration ?? 0);
        } else {
            setCurrentSong("");
            musicEngine.setFadeOutDuration(0);
        }
    }, [currentVerseConfig, engineSceneRef, setCurrentSong]);

    // set song settings
    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const musicConfig = currentVerseConfig.music;
        const musicEngine = scene.metadata.audio_engine.getMusicAudio();

        const transitionDuration = musicConfig?.transition_duration ?? 0;
        const eightBitFadeOut = musicConfig?.["8_bit_fade_out"];
        const layersVolumeDuration: MusicTransitionDuration =
            eightBitFadeOut?.enabled && eightBitFadeOut.duration > 0
                ? { default: transitionDuration, "8-bit": eightBitFadeOut.duration }
                : transitionDuration;

        const setSongLayersVolume = () => {
            if (musicConfig) {
                const newVolume = musicConfigToCategoryVolume(musicConfig);

                layersVolumeDurationRef.current = layersVolumeDuration;

                setCurrentLayersVolume((prev) => {
                    if (JSON.stringify(prev) === JSON.stringify(newVolume)) {
                        return prev;
                    }
                    return newVolume;
                });
            } else {
                layersVolumeDurationRef.current = 0;
                setCurrentLayersVolume({});
            }
        };

        setSongLayersVolume();

        const notMuteOnPause = musicConfig?.not_mute_on_pause ?? false;
        const pauseOverrideLayers = musicConfig?.pause_override_layers ?? null;

        musicEngine.resetMusicSessionState();
        musicEngine.disableHighpass();
        musicEngine.disableLowpass();
        musicEngine.gamePaused(false, notMuteOnPause, pauseOverrideLayers);

        if (musicConfig) {
            musicEngine.applyInitialLayersVolume(
                musicConfigToCategoryVolume(musicConfig),
                layersVolumeDuration,
            );
        }
    }, [currentVerseConfig, restartKey]);

    // Stop boss/manual music only when leaving the verse, not on level restart
    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const musicConfig = currentVerseConfig.music;

        return () => {
            if (musicConfig?.stop_all_music_on_finish) {
                scene?.metadata?.audio_engine?.getMusicAudio()?.stopMusic();
            }
        };
    }, [currentVerseConfig]);

    // get and play song
    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        if (currentSong === "") return;

        const musicConfig = currentVerseConfig.music;
        const musicEngine = scene.metadata.audio_engine.getMusicAudio();

        if (musicConfig) {
            const play_one_shot = musicConfig.play_one_shot ?? false;

            MUSIC_LAYER_KEYS.forEach((key) => {
                const layer = musicConfig[key];
                if (!layer) return;

                const versions = Object.values(layer);

                versions.forEach((version: unknown) => {
                    const musicVariant = version as MusicSettings;

                    const one_shot = musicVariant.one_shot ?? "";
                    const one_shot_volume = musicVariant.one_shot_volume ?? 0;

                    const full = musicVariant.full ?? "";
                    const full_volume = musicVariant.full_volume ?? 0;

                    if (!one_shot && !full) return;

                    musicEngine.playMusic(
                        one_shot,
                        one_shot_volume,
                        full,
                        full_volume,
                        scene.onBeforeRenderObservable,
                        play_one_shot,
                        musicConfig?.disable_delayed_start ?? false,
                    );
                });
            });
        } else {
            musicEngine.stopMusic();
        }

    }, [currentSong]);

    // switch layers volume
    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const musicEngine = scene.metadata.audio_engine.getMusicAudio();
        musicEngine.setLayersVolume(currentLayersVolume, layersVolumeDurationRef.current);
        layersVolumeDurationRef.current = 0;
    }, [currentLayersVolume]);

    // filters
    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const musicEngine = scene.metadata.audio_engine.getMusicAudio();

        return () => {
            musicEngine.resetMusicSessionState();
            musicEngine.disableHighpass();
            musicEngine.disableLowpass();
            musicEngine.gamePaused(false);
            prevVerseSongRef.current = "";
            prevVerseFadeOutRef.current = 0;
            setCurrentSong("");
        };
    }, []);

    // radio mode
    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const musicEngine = scene.metadata.audio_engine.getMusicAudio();
        musicEngine.initRadioMode();

        return () => {
            musicEngine.stopMusic(true);
        };
    }, []);
};
