import { useEffect, useRef, useState } from "react";

import { useEngineContext, useGameState, useVersesContext } from "contexts";

import {
    assignMenuTexture,
    captureUIScene,
    disposeMenuTexture,
    disposeUtilityLayer,
} from "utils/babylon";
import { breadcrumb } from "utils/diagnostics";
import {
    createHackingFailedUI,
    animateOpacity,
    animateRootOpacity,
} from "assets/ui/hacking-failed";

import { Enemy } from "core/enemy/Enemy";
import { Engine, Scene, UtilityLayerRenderer } from "@babylonjs/core";
import { createMenuButton, animateButtonOpacity, animateButtonSlide } from "assets/ui/tab-button";
import { Button, Control } from "@babylonjs/gui";

import { PlayerShooter } from "core/player/PlayerShooter";
import { setAutoAimUIVisible } from "utils/autoAim";

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
        key: "RESTART",
        text: "Reboot",
        left: "0px",
        top: "250px",
        width: "750px",
        vAlign: Control.VERTICAL_ALIGNMENT_CENTER,
        icons_path: ["textures/ui/square_00.png", "textures/ui/square_01.png"],
    },
    {
        key: "EXIT",
        text: "Terminate",
        left: "0px",
        top: "315px",
        width: "750px",
        vAlign: Control.VERTICAL_ALIGNMENT_CENTER,
        icons_path: ["textures/ui/square_00.png", "textures/ui/square_01.png"],
    },
];

export const useVerseRestart = () => {
    const { menuTextureRef, playerIsDeadRef, setIsPaused, setGameState } = useGameState();
    const { engineRef, engineSceneRef } = useEngineContext();
    const { selectedVerse, restartVerse, restartKey, currentVerseConfig } = useVersesContext();

    const buttonsRef = useRef<Record<string, Button>>({});
    const [selectedButton, setSelectedButton] = useState(buttons[0]?.key || "");
    const selectedButtonRef = useRef(selectedButton);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const audioEngine = scene.metadata.audio_engine?.getCommonAudio();
        audioEngine?.playSound("ui_button_select");
    }, [selectedButton]);

    const rebootVerse = (scene: Scene, engine: Engine) => {
        setTimeout(async () => {
            breadcrumb("verse.reboot.capture", { verse: selectedVerse });
            const texture = await captureUIScene(engine, scene.activeCamera!);
            assignMenuTexture(menuTextureRef, texture);

            scene.metadata.suspendRendering = true;
            breadcrumb("verse.reboot.teardown", { verse: selectedVerse });

            const metadata = scene.metadata;
            metadata.players_shooter_classes.forEach((cls: PlayerShooter) => {
                cls.disposeBullets();
            });

            metadata.enemies_pool_class.enemies.forEach((enemy: Enemy) => {
                enemy.isInvincible = false;
                enemy?.shooter?.dispose(false);
            });

            const musicEngine = scene.metadata.audio_engine.getMusicAudio();

            const audioEngine = scene.metadata.audio_engine?.getCommonAudio();
            audioEngine?.playSound("ui_button_start");

            musicEngine.disableLowpass();
            musicEngine.gamePaused(
                false,
                currentVerseConfig?.music?.not_mute_on_pause,
                currentVerseConfig?.music?.pause_override_layers ?? null,
            );

            restartVerse();
            breadcrumb("verse.reboot.restarted", { verse: selectedVerse });
        }, 0);
    };

    const toMainMenu = (scene: Scene) => {
        const audioEngine = scene.metadata.audio_engine?.getCommonAudio();
        const musicEngine = scene.metadata.audio_engine?.getMusicAudio();
        const songName = currentVerseConfig?.music?.name;

        musicEngine?.stopChapterSong(
            songName ?? "",
            currentVerseConfig?.music?.fade_out_duration ?? 0,
        );

        scene.metadata.suspendRendering = true;
        scene.getEngine()?.stopRenderLoop();
        disposeMenuTexture(menuTextureRef);
        setGameState("menu");
        setIsPaused(false);

        audioEngine?.playSound("transition_before");
        audioEngine?.playSound("ui_button_start");
    };

    const onButtonClick = (key: string, scene: Scene, engine: Engine) => {
        if (!playerIsDeadRef.current) return;

        const currentSelection = selectedButtonRef.current;

        if (key === currentSelection) {
            if (key === "RESTART") {
                rebootVerse(scene, engine);
            } else if (key === "EXIT") {
                toMainMenu(scene);
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
                    onButtonClick(currentKey, engineSceneRef.current, engineRef.current);
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
                    onButtonClick(currentKey, engineSceneRef.current, engineRef.current);
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

        const engine = engineRef.current;
        if (!engine) return;

        lockedRef.current = true;
        playerIsDeadRef.current = false;

        const musicEngine = scene.metadata.audio_engine.getMusicAudio();

        const notMuteOnPause = currentVerseConfig?.music?.not_mute_on_pause;
        const pauseOverrideLayers = currentVerseConfig?.music?.pause_override_layers;

        const utilityLayer = new UtilityLayerRenderer(scene);
        const ui = createHackingFailedUI(scene, utilityLayer);

        const showRestartUI = () => {
            if (scene.metadata.effects.rendering_pipeline)
                scene.metadata.effects.rendering_pipeline.renderingPipeline.depthOfField.fStop = 2.0;
            setAutoAimUIVisible(scene, false);
            animateOpacity(ui.uiMain);
            animateOpacity(ui.uiText);

            musicEngine.gamePaused(true, notMuteOnPause, pauseOverrideLayers);

            setIsPaused(true);
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
                    onClick: () => onButtonClick(key, scene, engine),
                },
                ui.uiText,
            );
        });

        setButtonsVisibility(Object.values(buttonsRef.current), false);

        scene.metadata.playerIsDeadRef = playerIsDeadRef;

        scene.metadata.callbacks ??= {};
        scene.metadata.callbacks = {
            ...scene.metadata.callbacks,
            show_restart_ui: () => showRestartUI(),
        };

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            ui.uiMain.dispose();
            ui.uiText.dispose();
            disposeUtilityLayer(utilityLayer);
        };
    }, [selectedVerse, restartKey]);

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
};
