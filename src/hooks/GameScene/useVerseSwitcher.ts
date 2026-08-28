import {
    ArcRotateCamera,
    Observer,
    Scene,
    UtilityLayerRenderer,
    setAndStartTimer,
} from "@babylonjs/core";
import { useEffect } from "react";

import { useEngineContext, useGameState, useVersesContext } from "contexts";

import {
    assignMenuTexture,
    captureUIScene,
    disposeMenuTexture,
    disposeUtilityLayer,
} from "utils/babylon";
import { createHackingCompleteUI, animateOpacity } from "assets/ui/hacking-complete";

import { Enemy } from "core/enemy/Enemy";

import { PlayerShooter } from "core/player/PlayerShooter";
import { setAutoAimUIVisible } from "utils/autoAim";
import { markVerseCompleted, VERSES_ORDER } from "verses/verseProgression";

export const useVerseSwitcher = () => {
    const { setGameState, menuTextureRef, setIsPaused, inputLockedRef, controlsLockedRef } =
        useGameState();
    const { engineRef, engineSceneRef } = useEngineContext();
    const { selectedVerse, setSelectedVerse, restartKey, currentVerseConfig } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const engine = engineRef.current;
        if (!engine) return;

        controlsLockedRef.current = false;

        const utilityLayer = new UtilityLayerRenderer(scene);
        const ui = createHackingCompleteUI(utilityLayer);

        const audioEngine = scene.metadata.audio_engine?.getCommonAudio();

        const disposeTimer = () => {
            const timer = scene.metadata.timer;
            if (!timer) return;

            timer.timerText.dispose();
            timer.ui.dispose();
            timer.unsubscribe();
        };

        const finalizeVerse = () => {
            controlsLockedRef.current = true;

            setAutoAimUIVisible(scene, false);

            disposeTimer();

            const metadata = scene.metadata;
            metadata.players_shooter_classes.forEach((cls: PlayerShooter) => {
                cls.disposeBullets();
            });

            metadata.enemies_pool_class.enemies.forEach((enemy: Enemy) => {
                enemy.isInvincible = false;
                enemy?.shooter?.dispose();
            });

            for (let i = metadata.enemies.length - 1; i >= 0; i--) {
                const enemy = metadata.enemies[i];
                if (!enemy.name.includes("box")) {
                    enemy.metadata.callbacks.destroy(true, false);
                }
            }

            scene.animatables.forEach((anim) => {
                anim.pause();
            });
        };

        const timerObservers: Array<Observer<Scene> | null | undefined> = [];
        const trackedTimer = (options: {
            timeout: number;
            contextObservable: Scene["onBeforeRenderObservable"];
            onEnded: () => void | Promise<void>;
        }) => {
            const observer = setAndStartTimer(options);
            timerObservers.push(observer);
            return observer;
        };

        const musicEngine = scene.metadata.audio_engine?.getMusicAudio();
        const songName = currentVerseConfig?.music?.name;

        const handleKeyDown =
            process.env.NODE_ENV === "development"
                ? (e: KeyboardEvent) => {
                      if (e.code !== "NumpadSubtract") return;
                      e.preventDefault();
                      musicEngine?.stopChapterSong(
                          songName ?? "",
                          currentVerseConfig?.music?.fade_out_duration ?? 0,
                      );
                      setGameState("menu");
                      setIsPaused(false);
                  }
                : null;

        let observer: Observer<Scene> | undefined;
        const isFinalVerse = currentVerseConfig.settings.is_final_verse;
        const returnToMenu = currentVerseConfig.settings.return_to_menu;

        const finalVerse = () => {
            const camera = scene.getCameraByName("arc-rotate-camera-0") as ArcRotateCamera;

            if (camera) {
                const speed = 0.5;

                observer = scene.onBeforeRenderObservable.add(() => {
                    const deltaTime =
                        scene.metadata.gameClock?.getGlobalDeltaTime?.() ??
                        engine.getDeltaTime() / 1000;

                    camera.radius += speed * deltaTime;
                });
            }

            const showFinalVerseUI = scene.metadata?.callbacks?.show_final_verse_ui;

            trackedTimer({
                timeout: 2000,
                contextObservable: scene.onBeforeRenderObservable,
                onEnded: () => {
                    showFinalVerseUI?.();
                },
            });
        };

        const transitionToNextVerse = (nextVerse: (typeof VERSES_ORDER)[number]) => {
            trackedTimer({
                timeout: 250,
                contextObservable: scene.onBeforeRenderObservable,
                onEnded: () => {
                    audioEngine?.playSound("transition_before");
                },
            });

            trackedTimer({
                timeout: 500,
                contextObservable: scene.onBeforeRenderObservable,
                onEnded: () => {
                    if (scene.metadata.effects.rendering_pipeline)
                        scene.metadata.effects.rendering_pipeline.renderingPipeline.depthOfField.fStop = 2.0;
                    animateOpacity(ui);
                },
            });

            trackedTimer({
                timeout: 700,
                contextObservable: scene.onBeforeRenderObservable,
                onEnded: () => {
                    setIsPaused(true);
                },
            });

            trackedTimer({
                timeout: 750,
                contextObservable: scene.onBeforeRenderObservable,
                onEnded: async () => {
                    const texture = await captureUIScene(engine, scene.activeCamera!);
                    assignMenuTexture(menuTextureRef, texture);

                    trackedTimer({
                        timeout: 250,
                        contextObservable: scene.onBeforeRenderObservable,
                        onEnded: () => {
                            setIsPaused(false);
                            scene.metadata.suspendRendering = true;
                            setSelectedVerse(nextVerse);
                        },
                    });
                },
            });
        };

        const transitionToMainMenu = () => {
            const RETURN_TO_MENU_DELAY = 1000;

            // musicEngine?.stopChapterSong(songName ?? "");
            musicEngine?.stopMusic();

            const pp = scene.metadata?.effects?.post_processes0;

            trackedTimer({
                timeout: RETURN_TO_MENU_DELAY,
                contextObservable: scene.onBeforeRenderObservable,
                onEnded: () => {
                    audioEngine?.playSound("return_to_menu"); if (scene.metadata.effects.rendering_pipeline)
                        scene.metadata.effects.rendering_pipeline.renderingPipeline.depthOfField.fStop = 2.0;
                    setIsPaused(true);
                },
            });

            trackedTimer({
                timeout: RETURN_TO_MENU_DELAY + 80,
                contextObservable: scene.onBeforeRenderObservable,
                onEnded: () => {
                    pp?.enableDistortionEffect();
                    pp?.enableGlitch02PostProcess();
                },
            });

            trackedTimer({
                timeout: RETURN_TO_MENU_DELAY + 980,
                contextObservable: scene.onBeforeRenderObservable,
                onEnded: () => {
                    pp?.enablePixelationPostProcess();
                },
            });

            trackedTimer({
                timeout: RETURN_TO_MENU_DELAY + 1820,
                contextObservable: scene.onBeforeRenderObservable,
                onEnded: () => {
                    pp?.enableSquareShatterPostProcess();
                },
            });

            trackedTimer({
                timeout: RETURN_TO_MENU_DELAY + 2280,
                contextObservable: scene.onBeforeRenderObservable,
                onEnded: () => {
                    pp?.enableNegativePostProcess();
                },
            });

            trackedTimer({
                timeout: RETURN_TO_MENU_DELAY + 2630,
                contextObservable: scene.onBeforeRenderObservable,
                onEnded: () => {
                    pp?.enableShatteringPostProcess();
                },
            });

            trackedTimer({
                timeout: RETURN_TO_MENU_DELAY + 3210,
                contextObservable: scene.onBeforeRenderObservable,
                onEnded: () => {
                    setIsPaused(false);
                    scene.metadata.suspendRendering = true;
                    scene.getEngine()?.stopRenderLoop();
                    disposeMenuTexture(menuTextureRef);
                    setGameState("menu");
                },
            });
        };

        const switchToNextVerse = () => {
            markVerseCompleted(selectedVerse);
            finalizeVerse();

            const currentIndex = VERSES_ORDER.indexOf(selectedVerse);
            const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % VERSES_ORDER.length;

            inputLockedRef.current = true;

            if (isFinalVerse) {
                finalVerse();
                return;
            }

            if (returnToMenu || nextIndex === 0) {
                transitionToMainMenu();
            } else {
                transitionToNextVerse(VERSES_ORDER[nextIndex]);
            }
        };

        scene.metadata.callbacks ??= {};
        scene.metadata.callbacks = {
            ...scene.metadata.callbacks,
            swicth_verse: () => switchToNextVerse(),
            back_to_menu: () => {
                musicEngine?.stopChapterSong(
                    songName ?? "",
                    currentVerseConfig?.music?.fade_out_duration ?? 0,
                );
                scene.metadata.suspendRendering = true;
                scene.getEngine()?.stopRenderLoop();
                disposeMenuTexture(menuTextureRef);
                setGameState("menu");
            },
        };

        scene.metadata.controlsLockedRef = controlsLockedRef;

        if (handleKeyDown) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            ui.dispose();
            disposeUtilityLayer(utilityLayer);
            if (handleKeyDown) {
                document.removeEventListener("keydown", handleKeyDown);
            }

            timerObservers.forEach((timerObserver) => {
                if (timerObserver) scene.onBeforeRenderObservable.remove(timerObserver);
            });
            if (observer) scene.onBeforeRenderObservable.remove(observer);
        };
    }, [
        restartKey,
        selectedVerse,
        engineRef,
        engineSceneRef,
        inputLockedRef,
        controlsLockedRef,
        menuTextureRef,
        setGameState,
        setIsPaused,
        setSelectedVerse,
        currentVerseConfig,
    ]);
};
