import { useEffect, useRef, useState } from "react";

import { useEngineContext, useGameState, useVersesContext } from "contexts";

import { applyEmissiveColorFactor, disposeUtilityLayer } from "utils/babylon";
import {
    createHackingFinishedUI,
    animateOpacity,
    animateRootOpacity,
} from "assets/ui/hacking-finished";

import { ArcRotateCamera, Color4, Observer, Scene, UtilityLayerRenderer } from "@babylonjs/core";
import { createMenuButton, animateButtonOpacity, animateButtonSlide } from "assets/ui/tab-button";
import { Button, Control } from "@babylonjs/gui";

import { SupportedLight } from "types/engine/Light.types";

import { setAutoAimUIVisible } from "utils/autoAim";

import { ErrorBoundary } from "components";

const BACKGROUND_COLOR_1 = { r: 0.0, g: 0.0, b: 0.0, a: 1.0 };
const BACKGROUND_COLOR_2 = { r: 0.31, g: 0.3, b: 0.25, a: 1.0 };

interface IButtonConfig {
    key: string;
    text: string;
    left: string;
    top: string;
    width: string;
    vAlign?: number;
    icons_path?: [string, string];
}

const buttons: IButtonConfig[] = [
    {
        key: "EXIT",
        text: "Finish",
        left: "0px",
        top: "315px",
        width: "750px",
        vAlign: Control.VERTICAL_ALIGNMENT_CENTER,
        icons_path: ["textures/ui/square_00.png", "textures/ui/square_01.png"],
    },
];

export const useFinalVerse = () => {
    const { engineSceneRef } = useEngineContext();
    const { restartKey, currentVerseConfig } = useVersesContext();

    // settings
    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const isFinalVerse = currentVerseConfig.settings.is_final_verse;
        if (!isFinalVerse) return;

        const mainLight = scene.getLightByName("directional-light-aboveground");

        const spotLight = scene.getLightByName("spot-light-aboveground");
        spotLight?.setEnabled(false);

        let lastExecutionTime = 0;
        const FPS = 10;
        const FRAME_INTERVAL_MS = 1000 / FPS;

        const effectsState = {
            isWireDisabled: false,
            isDefaultDisabled: false,
            isAudioDisabled: false,
            isLightAttached: false,
        };

        const applyCameraPostProcess = () => {
            const players = scene.metadata.players;
            if (!players.length) return;

            const player = players[0];
            if (!player) return;

            player.metadata.callbacks.self_destruct_effects();
        };

        const nodeConfigs = [
            {
                name: "enemy-node-5-sphere",
                effectName: "wire",
                onAppear: () => {
                    effectsState.isWireDisabled = false;
                },
                onDisappear: () => {
                    applyCameraPostProcess();
                    scene?.metadata?.callbacks?.apply_wireframe?.(false);

                    effectsState.isWireDisabled = true;
                },
            },
            {
                name: "enemy-node-20-sphere",
                effectName: "default",
                onAppear: () => {
                    effectsState.isDefaultDisabled = false;
                },
                onDisappear: () => {
                    applyCameraPostProcess();
                    scene?.metadata?.callbacks?.restore_material?.();

                    effectsState.isDefaultDisabled = true;
                },
            },
            {
                name: "enemy-node-35-sphere",
                effectName: "light",
                onAppear: () => {
                    effectsState.isLightAttached = true;
                },
                onDisappear: () => {
                    applyCameraPostProcess();

                    mainLight!.intensity = 0.075;
                    spotLight?.setEnabled(true);

                    const light = scene.lights[2] as SupportedLight;

                    const playerAssets = scene.metadata.player_assets;
                    if (playerAssets) {
                        const lightMaterial = playerAssets.light_material;
                        const darkMaterial = playerAssets.dark_material;

                        applyEmissiveColorFactor(light, lightMaterial);
                        applyEmissiveColorFactor(light, darkMaterial);
                    }

                    const wallAssets = scene.metadata.wall_assets;
                    if (wallAssets) {
                        const boxWallBaseMaterial = wallAssets.box_wall_base.material;
                        const boxWallDarkMaterial = wallAssets.box_wall_dark.material;
                        const boxWallLightMaterial = wallAssets.box_wall_light.material;
                        const boxWallUiMaterial = wallAssets.box_wall_ui.material;
                        const cylinderWallDarkMaterial = wallAssets.cylinder_wall_dark.material;
                        const cylinderWallLightMaterial = wallAssets.cylinder_wall_light.material;

                        applyEmissiveColorFactor(light, boxWallBaseMaterial);
                        applyEmissiveColorFactor(light, boxWallDarkMaterial);
                        applyEmissiveColorFactor(light, boxWallLightMaterial);
                        applyEmissiveColorFactor(light, boxWallUiMaterial);
                        applyEmissiveColorFactor(light, cylinderWallDarkMaterial);
                        applyEmissiveColorFactor(light, cylinderWallLightMaterial);
                    }

                    const enemyAssets = scene.metadata.enemy_assets;
                    if (enemyAssets) {
                        const factor = scene.metadata.verse_settings.emimissive_color_factor;

                        const lightMaterial = enemyAssets.light_material;
                        const darkMaterial = enemyAssets.dark_material;
                        const slightlyDarkMaterial = enemyAssets.slightly_dark_material;
                        const blackMaterial = enemyAssets.black_material;

                        applyEmissiveColorFactor(light, lightMaterial, true, factor);
                        applyEmissiveColorFactor(light, darkMaterial, true, factor);
                        applyEmissiveColorFactor(light, slightlyDarkMaterial, true, factor);
                        applyEmissiveColorFactor(light, blackMaterial, true, factor);
                    }

                    const ground = scene.metadata.grounds[1];
                    if (ground) {
                        applyEmissiveColorFactor(light, ground.material);
                    }

                    const { r, g, b, a } = BACKGROUND_COLOR_1;
                    scene.clearColor = new Color4(r, g, b, a);

                    effectsState.isLightAttached = false;
                },
            },
            {
                name: "enemy-node-50-sphere",
                effectName: "audio",
                onAppear: () => {
                    effectsState.isAudioDisabled = false;
                    scene.metadata.audio_engine?.resetSharedSFXVolumeMultiplier();
                },
                onDisappear: () => {
                    applyCameraPostProcess();

                    scene.metadata.audio_engine?.fadeSharedSFXVolume(0, 5000);
                    effectsState.isAudioDisabled = true;
                },
            },
        ];

        const nodeStates = new Map();

        nodeConfigs.forEach((config) => {
            nodeStates.set(config.name, {
                wasPresent: false,
                disappearanceLogged: false,
            });
        });

        const observeNodes = () => {
            nodeConfigs.forEach((config) => {
                const node = scene.getNodeByName(config.name);
                const state = nodeStates.get(config.name);

                if (!node) {
                    if (state.wasPresent && !state.disappearanceLogged) {
                        config.onDisappear();
                        state.disappearanceLogged = true;
                    }
                    state.wasPresent = false;
                } else {
                    if (!state.wasPresent) {
                        config.onAppear();
                        state.disappearanceLogged = false;
                    }
                    state.wasPresent = true;
                }
            });
        };

        const observeFinalStage = scene.onBeforeRenderObservable.add(() => {
            const currentTime = performance.now();
            if (currentTime - lastExecutionTime >= FRAME_INTERVAL_MS) {
                observeNodes();
                lastExecutionTime = currentTime;
            }
        });

        return () => {
            scene.onBeforeRenderObservable.remove(observeFinalStage);
            scene?.metadata?.audio_engine?.resetSharedSFXVolumeMultiplier();

            const { r, g, b, a } = BACKGROUND_COLOR_2;
            scene.clearColor = new Color4(r, g, b, a);
        };
    }, [currentVerseConfig, restartKey]);

    // layout
    const { playerIsDeadRef, setIsPaused, setGameState } = useGameState();
    const { engineRef } = useEngineContext();
    const { selectedVerse } = useVersesContext();

    const buttonsRef = useRef<Record<string, Button>>({});
    const [selectedButton, setSelectedButton] = useState(buttons[0]?.key || "");
    const selectedButtonRef = useRef(selectedButton);

    const [fatalError, setFatalError] = useState<Error>();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const audioEngine = scene.metadata.audio_engine?.getCommonAudio();
        audioEngine?.playSound("ui_button_select");
    }, [selectedButton]);

    const forceSystemExit = (scene: Scene) => {
        const audioManager = scene.metadata.audio_engine;
        const audioEngine = audioManager?.getCommonAudio();
        const musicEngine = audioManager?.getMusicAudio();

        musicEngine?.stopChapterSong("Durka_Five");

        audioManager?.resetSharedSFXVolumeMultiplier();

        scene.metadata.suspendRendering = true;
        scene.getEngine()?.stopRenderLoop();
        setGameState("menu");
        setIsPaused(false);

        audioEngine?.playSound("transition_before");
        audioEngine?.playSound("ui_button_start");

        // setFatalError(new Error("Critical Error!"));
    };

    const processTerminalSelection = (key: string, scene: Scene) => {
        if (!playerIsDeadRef.current) return;

        const currentSelection = selectedButtonRef.current;

        if (key === currentSelection) {
            if (key === "EXIT") {
                forceSystemExit(scene);
            } else {
                console.warn("Unknown action");
            }
        }
        setSelectedButton(key);
    };

    const setButtonsVisibility = (buttons: Button[], value: boolean) => {
        buttons.forEach((btn) => {
            btn.isHitTestVisible = value;
            btn.metadata.layer2.isHitTestVisible = value;
            btn.metadata.layer3.isHitTestVisible = value;
            btn.metadata.layer4.isHitTestVisible = value;

            btn.isVisible = value;
            btn.metadata.layer2.isVisible = value;
            btn.metadata.layer3.isVisible = value;
            btn.metadata.layer4.isVisible = value;
            btn.metadata.icon1.isVisible = value;
            btn.metadata.icon2.isVisible = value;
            btn.metadata.texture.isVisible = value;
        });
    };

    const lockedRef = useRef(true);
    const lastSwitchRef = useRef(0);

    const handleKeyDown = (event: KeyboardEvent) => {
        const now = Date.now();
        if (now - lastSwitchRef.current < 100) return;
        lastSwitchRef.current = now;

        if (!playerIsDeadRef.current || lockedRef.current) return;

        const buttonKeys = Object.keys(buttonsRef.current);
        if (buttonKeys.length === 0) return;

        const currentIndex = buttonKeys.indexOf(selectedButtonRef.current);
        let newIndex = currentIndex;

        switch (event.code) {
            case "KeyW":
            case "ArrowUp":
                newIndex = (currentIndex - 1 + buttonKeys.length) % buttonKeys.length;
                break;
            case "KeyS":
            case "ArrowDown":
                newIndex = (currentIndex + 1) % buttonKeys.length;
                break;
            case "Enter":
            case "NumpadEnter":
            case "Space":
                if (event.repeat) return;

                const currentKey = buttonKeys[currentIndex];
                if (currentKey && engineSceneRef.current && engineRef.current) {
                    processTerminalSelection(currentKey, engineSceneRef.current);
                }
                lockedRef.current = true;

                break;
            default:
                return;
        }

        if (newIndex !== currentIndex) {
            setSelectedButton(buttonKeys[newIndex]);
        }
    };

    // Gamepad controls
    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const INITIAL_DELAY = 300;
        const REPEAT_DELAY = 100;

        let holdDirection: "up" | "down" | null = null;
        let firstPressTime = 0;
        let lastTriggerTime = 0;
        let gameStarted = false;

        const trigger = (direction: "up" | "down") => {
            if (!playerIsDeadRef.current || lockedRef.current) return;

            const buttonKeys = Object.keys(buttonsRef.current);
            if (buttonKeys.length === 0) return;

            const currentIndex = buttonKeys.indexOf(selectedButtonRef.current);
            let newIndex = currentIndex;

            switch (direction) {
                case "up":
                    newIndex = (currentIndex - 1 + buttonKeys.length) % buttonKeys.length;
                    break;
                case "down":
                    newIndex = (currentIndex + 1) % buttonKeys.length;
                    break;
                default:
                    return;
            }

            if (newIndex !== currentIndex) {
                setSelectedButton(buttonKeys[newIndex]);
            }
        };

        const gamepadObserver = scene.onBeforeRenderObservable.add(() => {
            const gamepadManager = scene.metadata.gamepad;
            if (!gamepadManager) return;

            const now = performance.now();

            const startGameFired =
                gamepadManager.isButtonPressed(0) || gamepadManager.isButtonPressed(9);

            if (startGameFired && !gameStarted) {
                gameStarted = true;

                if (!playerIsDeadRef.current || lockedRef.current) return;

                const buttonKeys = Object.keys(buttonsRef.current);
                if (buttonKeys.length === 0) return;

                const currentIndex = buttonKeys.indexOf(selectedButtonRef.current);
                const currentKey = buttonKeys[currentIndex];
                if (currentKey && engineSceneRef.current && engineRef.current) {
                    processTerminalSelection(currentKey, engineSceneRef.current);
                }
                lockedRef.current = true;
            }

            if (!startGameFired) {
                gameStarted = false;
            }

            const getDirection = (): typeof holdDirection => {
                if (gamepadManager.isButtonPressed(12)) return "up";
                if (gamepadManager.isButtonPressed(13)) return "down";
                return null;
            };

            const currentDirection = getDirection();

            if (!currentDirection) {
                holdDirection = null;
                return;
            }

            if (holdDirection !== currentDirection) {
                holdDirection = currentDirection;
                firstPressTime = now;
                lastTriggerTime = now;
                trigger(currentDirection);
                return;
            }

            const timeHeld = now - firstPressTime;

            if (timeHeld < INITIAL_DELAY) return;

            if (now - lastTriggerTime > REPEAT_DELAY) {
                lastTriggerTime = now;
                trigger(currentDirection);
            }
        });

        return () => {
            scene.onBeforeRenderObservable.remove(gamepadObserver);
        };
    }, [selectedVerse, restartKey]);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const isFinalVerse = currentVerseConfig.settings.is_final_verse;
        if (!isFinalVerse) return;

        const engine = engineRef.current;
        if (!engine) return;

        lockedRef.current = true;
        playerIsDeadRef.current = false;

        const utilityLayer = new UtilityLayerRenderer(scene);
        const ui = createHackingFinishedUI(scene, utilityLayer);

        let observer: Observer<Scene>;

        const showFinalVerseUI = () => {
            // if (scene.metadata.effects.rendering_pipeline)
            //     scene.metadata.effects.rendering_pipeline.renderingPipeline.depthOfField.fStop = 2.0;
            setAutoAimUIVisible(scene, false);
            animateOpacity(ui.uiMain);
            animateOpacity(ui.uiText);
            document.exitPointerLock();

            setButtonsVisibility(Object.values(buttonsRef.current), true);
            animateRootOpacity(ui.uiText.rootContainer);

            document.addEventListener("keydown", handleKeyDown);

            lockedRef.current = false;
        };

        buttons.forEach(({ key, text, left, width, top, icons_path }) => {
            buttonsRef.current[key] = createMenuButton(
                {
                    text,
                    top,
                    left,
                    width,
                    selectorTexture: true,
                    icons_path: icons_path,
                    vAlign: Control.VERTICAL_ALIGNMENT_CENTER,
                    onClick: () => processTerminalSelection(key, scene),
                },
                ui.uiText,
            );
        });

        setButtonsVisibility(Object.values(buttonsRef.current), false);

        scene.metadata.playerIsDeadRef = playerIsDeadRef;

        scene.metadata.callbacks ??= {};
        scene.metadata.callbacks = {
            ...scene.metadata.callbacks,
            show_final_verse_ui: () => showFinalVerseUI(),
        };

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            ui.uiMain.dispose();
            ui.uiText.dispose();
            disposeUtilityLayer(utilityLayer);
        };
    }, [selectedVerse, restartKey, currentVerseConfig]);

    useEffect(() => {
        const buttons = buttonsRef.current;

        for (const key in buttons) {
            const btn = buttons[key];
            const to = key === selectedButton ? 1 : 0;

            animateButtonOpacity(btn, to, 100);
            animateButtonSlide(btn, to, 100);

            selectedButtonRef.current = selectedButton;
        }
    }, [selectedVerse, selectedButton, restartKey]);

    if (fatalError) {
        throw fatalError;
    }
};
