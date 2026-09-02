import {
    AdvancedDynamicTexture,
    ScrollViewer,
    StackPanel,
    Control,
    Button,
    Rectangle,
} from "@babylonjs/gui";
import { useEffect, useRef, useState } from "react";

import { useAudioEngine, useEngineContext } from "contexts";

import { createSideLineVersesTab } from "assets/ui/side-line";
import { fadeInUI } from "assets/ui/animations";

import { LS_KEYS, REFERENCE_HEIGHT, REFERENCE_WIDTH } from "core_constants";
import { getAutoAimDifficulty } from "utils/autoAim";
import {
    applyPhysicsSubsteps,
    getPhysicsSubstepsSetting,
    setPhysicsSubstepsSetting,
} from "utils/physicsSettings";
import {
    getUnlockAllVersesSetting,
    setUnlockAllVersesSetting,
} from "verses/verseProgression";

import {
    createMenuButton,
    animateButtonOpacity,
    animateButtonSlide,
    animateButtonLinesOffset,
    animateFromLeft,
} from "assets/ui/tab-button";

interface IUseSystemTab {
    selectedTab: string;
    texturesLoaded: boolean;
    setHintText: (text: string) => void;
}

interface IButtonConfig {
    key: string;
    text: string;
    left: string;
    top: string;
    width: string;
    vAlign?: number;
    hAlign?: number;
    icons_path?: [string, string];
    hint?: string;
    withSlider?: boolean;
    toggleOptions?: string[];
}

const buttons: IButtonConfig[] = [
    {
        key: "DIFFICULTY",
        text: "Difficulty",
        hint: "Adjust difficulty",
        left: "90px",
        top: "10px",
        width: "1000px",
        vAlign: Control.VERTICAL_ALIGNMENT_TOP,
        hAlign: Control.HORIZONTAL_ALIGNMENT_LEFT,
        icons_path: ["textures/ui/square_00.png", "textures/ui/square_01.png"],
        toggleOptions: ["Easy", "Normal"],
    },
    {
        key: "GENERAL_VOLUME",
        text: "General volume",
        hint: "Adjust general audio volume",
        left: "90px",
        top: "95px",
        width: "1000px",
        vAlign: Control.VERTICAL_ALIGNMENT_TOP,
        hAlign: Control.HORIZONTAL_ALIGNMENT_LEFT,
        icons_path: ["textures/ui/square_00.png", "textures/ui/square_01.png"],
        withSlider: true,
    },
    {
        key: "MUSIC",
        text: "Music volume",
        hint: "Adjust music volume",
        left: "90px",
        top: "180px",
        width: "1000px",
        vAlign: Control.VERTICAL_ALIGNMENT_TOP,
        hAlign: Control.HORIZONTAL_ALIGNMENT_LEFT,
        icons_path: ["textures/ui/square_00.png", "textures/ui/square_01.png"],
        withSlider: true,
    },
    {
        key: "SOUNDS",
        text: "Sounds volume",
        hint: "Adjust sound effects volume",
        left: "90px",
        top: "265px",
        width: "1000px",
        vAlign: Control.VERTICAL_ALIGNMENT_TOP,
        hAlign: Control.HORIZONTAL_ALIGNMENT_LEFT,
        icons_path: ["textures/ui/square_00.png", "textures/ui/square_01.png"],
        withSlider: true,
    },
    {
        key: "VOICE",
        text: "Voice volume",
        hint: "Adjust voice volume",
        left: "90px",
        top: "350px",
        width: "1000px",
        vAlign: Control.VERTICAL_ALIGNMENT_TOP,
        hAlign: Control.HORIZONTAL_ALIGNMENT_LEFT,
        icons_path: ["textures/ui/square_00.png", "textures/ui/square_01.png"],
        withSlider: true,
    },
    {
        key: "UNLOCK_ALL_VERSES",
        text: "Unlock All Verses",
        hint: "Unlock every verse without saving progress",
        left: "90px",
        top: "435px",
        width: "1000px",
        vAlign: Control.VERTICAL_ALIGNMENT_TOP,
        hAlign: Control.HORIZONTAL_ALIGNMENT_LEFT,
        icons_path: ["textures/ui/square_00.png", "textures/ui/square_01.png"],
        toggleOptions: ["ON", "OFF"],
    },
    {
        key: "PHYSICS_SUBSTEPS",
        text: "Physics substeps",
        hint: "Experimental: Enable, if you have physics issues (if disabled, clipping through walls may occur below 100 FPS)",
        left: "90px",
        top: "520px",
        width: "1000px",
        vAlign: Control.VERTICAL_ALIGNMENT_TOP,
        hAlign: Control.HORIZONTAL_ALIGNMENT_LEFT,
        icons_path: ["textures/ui/square_00.png", "textures/ui/square_01.png"],
        toggleOptions: ["ON", "OFF"],
    },
];

const BUTTON_HEIGHT = 50;
const CONTENT_BOTTOM_PADDING = 10;

// Selected buttons draw a line above and below their box, keep room for them while scrolling.
const SCROLL_MARGIN = 15;

const buttonTops = buttons.map(({ top }) => parseFloat(top));
const FIRST_BUTTON_TOP = Math.min(...buttonTops);
const LAST_BUTTON_TOP = Math.max(...buttonTops);

const SIDE_LINE_HEIGHT = LAST_BUTTON_TOP - FIRST_BUTTON_TOP + BUTTON_HEIGHT;
const CONTENT_HEIGHT = LAST_BUTTON_TOP + BUTTON_HEIGHT + CONTENT_BOTTOM_PADDING;

export const useSystemTab = ({ selectedTab, texturesLoaded, setHintText }: IUseSystemTab) => {
    const { audioManagerRef } = useAudioEngine();
    const { engineRef, engineSceneRef } = useEngineContext();

    const buttonsRef = useRef<Record<string, Button>>({});
    const [selectedButton, setSelectedButton] = useState(buttons[0]?.key || "");
    const selectedButtonRef = useRef(selectedButton);

    const scrollViewerRef = useRef<ScrollViewer | null>(null);

    useEffect(() => {
        setSelectedButton(buttons[0]?.key || "");

        if (selectedTab !== "SYSTEM" || !texturesLoaded) return;

        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI-System");

        ui.idealWidth = REFERENCE_WIDTH;
        ui.idealHeight = REFERENCE_HEIGHT;
        ui.renderAtIdealSize = true;

        const mainContainer = new Rectangle("ui-main-container-system");
        mainContainer.width = "60%";
        mainContainer.height = "100%";
        mainContainer.paddingTop = "275px";
        mainContainer.paddingRight = "0px";
        mainContainer.paddingBottom = "250px";
        mainContainer.paddingLeft = "90px";
        mainContainer.background = "#00000000";
        mainContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        mainContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        mainContainer.thickness = 0;

        ui.addControl(mainContainer);

        const scrollViewer = new ScrollViewer("scroll-viewer-system");
        scrollViewer.thickness = 0;
        scrollViewer.width = "100%";
        scrollViewer.height = "100%";
        scrollViewer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        scrollViewer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        // The wheel adjusts the selected slider / toggle, so it must not scroll the list:
        // scrolling is driven by keyboard and gamepad navigation only.
        scrollViewer.wheelPrecision = 0;

        scrollViewer.color = "#49463D";
        scrollViewer.barSize = 0;
        scrollViewer.barColor = "#A9A288";
        scrollViewer.barBackground = "#49463D";
        scrollViewerRef.current = scrollViewer;

        mainContainer.addControl(scrollViewer);

        const contentPanel = new Rectangle("content-panel-system");
        contentPanel.width = "100%";
        contentPanel.height = `${CONTENT_HEIGHT}px`;
        contentPanel.thickness = 0;
        contentPanel.background = "#00000000";
        contentPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        contentPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        scrollViewer.addControl(contentPanel);

        buttons.forEach(
            ({
                key,
                text,
                left,
                width,
                top,
                icons_path,
                vAlign,
                hAlign,
                withSlider,
                toggleOptions,
            }) => {
                buttonsRef.current[key] = createMenuButton(
                    {
                        text,
                        top,
                        left,
                        width,
                        selectorTexture: true,
                        icons_path: icons_path,
                        vAlign: vAlign,
                        hAlign: hAlign,
                        topLine: true,
                        bottomLine: true,
                        withSilder: withSlider,
                        toggleOptions: toggleOptions,
                        onClick: () => setSelectedButton(key),
                    },
                    contentPanel as unknown as AdvancedDynamicTexture,
                );
                animateFromLeft(buttonsRef.current[key], 0, 90, 200);
            },
        );

        const sideLines = new StackPanel("ui-side-lines-system");
        sideLines.isVertical = false;
        sideLines.top = `${FIRST_BUTTON_TOP}px`;
        sideLines.left = "0px";
        sideLines.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        sideLines.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        contentPanel.addControl(sideLines);

        createSideLineVersesTab(sideLines, SIDE_LINE_HEIGHT);

        fadeInUI(ui, 200);

        return () => {
            scrollViewerRef.current = null;
            ui.dispose();
        };
    }, [selectedTab, texturesLoaded]);

    const ensureButtonVisible = (key: string) => {
        const scrollViewer = scrollViewerRef.current;
        const button = buttonsRef.current[key];
        if (!scrollViewer?.host || !button) return;

        // First / last button sit at the content edges.
        const index = buttons.findIndex((b) => b.key === key);
        if (index <= 0) {
            scrollViewer.verticalBar.value = 0;
            return;
        }

        if (index === buttons.length - 1) {
            scrollViewer.verticalBar.value = scrollViewer.verticalBar.maximum;
            return;
        }

        // The *InPixels props are declared sizes; only the measures hold post-layout positions.
        type Measured = { _currentMeasure: { top: number; height: number } };
        const viewMeasure = (scrollViewer as unknown as Measured)._currentMeasure;
        const viewTop = viewMeasure.top;
        const viewBottom = viewMeasure.top + viewMeasure.height;

        const ratio = scrollViewer.host.idealRatio || 1;
        const margin = SCROLL_MARGIN * ratio;

        const targetMeasure = (button as unknown as Measured)._currentMeasure;
        const targetTop = targetMeasure.top - margin;
        const targetBottom = targetMeasure.top + targetMeasure.height + margin;

        let deltaPixels = 0;
        if (targetBottom > viewBottom) {
            deltaPixels = targetBottom - viewBottom;
        } else if (targetTop < viewTop) {
            deltaPixels = targetTop - viewTop;
        } else {
            return;
        }

        // Same metrics Babylon uses in ScrollViewer._setWindowPosition.
        const { _clientHeight, _window } = scrollViewer as unknown as {
            _clientHeight: number;
            _window: { _currentMeasure: { height: number } };
        };
        const endTop = _clientHeight - _window._currentMeasure.height;
        if (endTop >= 0) return;

        const nextValue = scrollViewer.verticalBar.value - (deltaPixels * ratio) / endTop;

        scrollViewer.verticalBar.value = Math.min(
            scrollViewer.verticalBar.maximum,
            Math.max(0, nextValue),
        );
    };

    useEffect(() => {
        if (selectedTab !== "SYSTEM" || !texturesLoaded) return;

        const buttons = buttonsRef.current;

        for (const key in buttons) {
            const btn = buttons[key];
            const to = key === selectedButton ? 1 : 0;

            animateButtonOpacity(btn, to, 100);
            animateButtonSlide(btn, to, 150);
            animateButtonLinesOffset(btn, to, 100);

            selectedButtonRef.current = selectedButton;
        }

        ensureButtonVisible(selectedButton);
        scrollViewerRef.current?.markAsDirty();
    }, [selectedButton, selectedTab]);

    useEffect(() => {
        const audio = audioManagerRef.current?.getCommonAudio();
        audio?.playSound("ui_button_select");
    }, [selectedButton]);

    useEffect(() => {
        if (selectedTab !== "SYSTEM") return;

        const button = buttons.find((b) => b.key === selectedButtonRef.current);

        if (button) {
            setHintText(button.hint!);
        }
    }, [selectedButton, selectedTab]);

    //
    const clampIndex = (v: number, max: number) => Math.max(-1, Math.min(v, max));

    const musicVolumeToIndex = (volume: number) => {
        if (volume <= 0) return -1;
        return Math.round(volume * 10 - 1);
    };

    const sfxVolumeToIndex = (volume: number) => {
        if (volume <= 0) return -1;
        return Math.round((volume / 2) * 10 - 1);
    };

    const indexToMusicVolume = (index: number) => {
        if (index < 0) return 0;
        return (index + 1) / 10;
    };

    const indexToSFXVolume = (index: number) => {
        if (index < 0) return 0;
        return ((index + 1) / 10) * 2;
    };

    const updateSliderVisual = (bars: Rectangle[], value: number) => {
        bars.forEach((bar, index) => {
            const isActive = index <= value;

            bar.height = isActive ? bar.metadata.active_height : bar.metadata.inactive_height;
        });
    };

    const updateToggleVisual = (toggleContainer: Rectangle, value: any) => {
        const textBlock = toggleContainer.metadata.text;
        textBlock.text = value;
    };

    const applyAudioFromIndex = (index: number) => {
        const audio = audioManagerRef.current;
        if (!audio) return;

        const action = selectedButtonRef.current;

        switch (action) {
            case "GENERAL_VOLUME":
                audio.setGeneralVolume(indexToMusicVolume(index));
                break;

            case "MUSIC":
                audio.setMusicEngineVolume(indexToMusicVolume(index));
                break;

            case "SOUNDS":
                audio.setSharedSFXVolume(indexToSFXVolume(index));
                break;

            case "VOICE":
                audio.setVoiceEngineVolume(indexToMusicVolume(index));
                break;
        }
    };

    const applyToggleValue = (option: string) => {
        const action = selectedButtonRef.current;

        switch (action) {
            case "DIFFICULTY":
                localStorage.setItem(LS_KEYS.DIFFICULTY, option);
                break;
            case "UNLOCK_ALL_VERSES":
                if (option === "ON" || option === "OFF") {
                    setUnlockAllVersesSetting(option);
                }
                break;
            case "PHYSICS_SUBSTEPS":
                if (option === "ON" || option === "OFF") {
                    setPhysicsSubstepsSetting(option);
                    applyPhysicsSubsteps(engineSceneRef.current);
                }
                break;
        }
    };

    useEffect(() => {
        if (selectedTab !== "SYSTEM") return;

        const audio = audioManagerRef.current;

        const onMount = () => {
            const buttons = buttonsRef.current;

            Object.entries(buttons).forEach(([key, btn]) => {
                if (btn?.metadata?.slider && audio) {
                    const slider = btn.metadata.slider;
                    const { bars } = slider.metadata;

                    let index = -1;

                    switch (key) {
                        case "GENERAL_VOLUME":
                            index = musicVolumeToIndex(audio.getGeneralVolume());
                            break;

                        case "MUSIC":
                            index = musicVolumeToIndex(audio.getMusicEngineVolume());
                            break;

                        case "SOUNDS":
                            index = sfxVolumeToIndex(audio.getSharedSFXVolume());
                            break;

                        case "VOICE":
                            index = musicVolumeToIndex(audio.getVoiceEngineVolume());
                            break;
                    }

                    index = clampIndex(index, slider.metadata.max);

                    slider.metadata.value = index;
                    updateSliderVisual(bars, index);
                }

                if (btn?.metadata?.toggle) {
                    const toggle = btn.metadata.toggle;

                    let value = "N/A";

                    switch (key) {
                        case "DIFFICULTY":
                            value = getAutoAimDifficulty();
                            break;
                        case "UNLOCK_ALL_VERSES":
                            value = getUnlockAllVersesSetting();
                            break;
                        case "PHYSICS_SUBSTEPS":
                            value = getPhysicsSubstepsSetting();
                            break;
                    }

                    toggle.metadata.value = value;
                    updateToggleVisual(toggle, value);
                }
            });
        };

        onMount();
    }, [selectedTab]);

    // Keyboard events
    const lastSwitchRef = useRef(0);

    useEffect(() => {
        if (selectedTab !== "SYSTEM") return;

        const audio = audioManagerRef.current?.getCommonAudio();

        const handleKeyDown = (event: KeyboardEvent) => {
            const btn = buttonsRef.current[selectedButtonRef.current];
            const buttonKeys = Object.keys(buttonsRef.current);
            if (buttonKeys.length === 0) return;

            const currentIndex = buttonKeys.indexOf(selectedButtonRef.current);
            let newIndex = currentIndex;
            const now = Date.now();

            switch (event.code) {
                case "KeyW":
                case "ArrowUp":
                case "KeyS":
                case "ArrowDown":
                    if (now - lastSwitchRef.current < 100) return;
                    lastSwitchRef.current = now;

                    if (event.code === "KeyW" || event.code === "ArrowUp") {
                        newIndex = (currentIndex - 1 + buttonKeys.length) % buttonKeys.length;
                    } else {
                        newIndex = (currentIndex + 1) % buttonKeys.length;
                    }

                    setSelectedButton(buttonKeys[newIndex]);
                    return;

                case "KeyD":
                case "ArrowRight":
                case "KeyA":
                case "ArrowLeft":
                    if (btn?.metadata?.slider) {
                        const slider = btn.metadata.slider;
                        const { bars } = slider.metadata;
                        let value = slider.metadata.value;

                        if (event.code === "KeyD" || event.code === "ArrowRight") {
                            value = clampIndex(value + 1, slider.metadata.max);
                        } else {
                            value = clampIndex(value - 1, slider.metadata.max);
                        }

                        slider.metadata.value = value;
                        updateSliderVisual(bars, value);
                        applyAudioFromIndex(value);
                        audio?.playSound("ui_button_select");
                    }

                    if (btn?.metadata?.toggle) {
                        const toggle = btn.metadata.toggle;
                        const currentValue = toggle.metadata.value;
                        const values = toggle.metadata.values;

                        const currentIndex = values.indexOf(currentValue);

                        if (currentIndex !== -1) {
                            let newIndex;

                            if (event.code === "KeyD" || event.code === "ArrowRight") {
                                newIndex = (currentIndex + 1) % values.length;
                            } else {
                                newIndex = (currentIndex - 1 + values.length) % values.length;
                            }

                            const newValue = values[newIndex];
                            toggle.metadata.value = newValue;

                            updateToggleVisual(toggle, newValue);
                            applyToggleValue(newValue);
                        }

                        audio?.playSound("ui_button_select");
                    }
                    break;

                default:
                    return;
            }
        };

        const handleWheel = (event: WheelEvent) => {
            const btn = buttonsRef.current[selectedButtonRef.current];
            if (!btn) return;

            if (btn.metadata?.slider) {
                const slider = btn.metadata.slider;
                const { bars } = slider.metadata;

                let value = slider.metadata.value;

                if (event.deltaY < 0) {
                    value = clampIndex(value + 1, slider.metadata.max);
                } else {
                    value = clampIndex(value - 1, slider.metadata.max);
                }

                if (value !== slider.metadata.value) {
                    slider.metadata.value = value;
                    updateSliderVisual(bars, value);
                    applyAudioFromIndex(value);
                    audio?.playSound("ui_button_select");
                }
            }

            if (btn.metadata?.toggle) {
                const toggle = btn.metadata.toggle;
                const currentValue = toggle.metadata.value;
                const values = toggle.metadata.values;

                const currentIndex = values.indexOf(currentValue);

                if (currentIndex !== -1) {
                    let newIndex;

                    if (event.deltaY < 0) {
                        newIndex = (currentIndex + 1) % values.length;
                    } else {
                        newIndex = (currentIndex - 1 + values.length) % values.length;
                    }

                    const newValue = values[newIndex];
                    toggle.metadata.value = newValue;

                    updateToggleVisual(toggle, newValue);
                    applyToggleValue(newValue);
                    audio?.playSound("ui_button_select");
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("wheel", handleWheel);
        };
    }, [selectedTab]);

    // gamepad events
    useEffect(() => {
        if (selectedTab !== "SYSTEM") return;

        const scene = engineSceneRef.current;
        if (!scene) return;

        const engine = engineRef.current;
        if (!engine) return;

        const audio = audioManagerRef.current?.getCommonAudio();

        const INITIAL_DELAY = 500;
        const REPEAT_DELAY = 100;

        let holdDirection: "up" | "down" | "left" | "right" | null = null;
        let firstPressTime = 0;
        let lastTriggerTime = 0;

        let waitingForRelease = true;

        const trigger = (direction: "up" | "down" | "left" | "right") => {
            const buttonKeys = Object.keys(buttonsRef.current);
            if (buttonKeys.length === 0) return;

            const currentIndex = buttonKeys.indexOf(selectedButtonRef.current);
            let newIndex = currentIndex;

            if (direction === "up" || direction === "down") {
                if (direction === "up") {
                    newIndex = (currentIndex - 1 + buttonKeys.length) % buttonKeys.length;
                } else {
                    newIndex = (currentIndex + 1) % buttonKeys.length;
                }

                if (newIndex !== currentIndex) {
                    setSelectedButton(buttonKeys[newIndex]);
                    audio?.playSound("ui_button_select");
                }
                return;
            }

            const btn = buttonsRef.current[selectedButtonRef.current];
            if (btn?.metadata?.slider) {
                const slider = btn.metadata.slider;
                const { bars } = slider.metadata;
                let value = slider.metadata.value;

                if (direction === "right") {
                    value = clampIndex(value + 1, slider.metadata.max);
                } else if (direction === "left") {
                    value = clampIndex(value - 1, slider.metadata.max);
                } else {
                    return;
                }

                slider.metadata.value = value;
                updateSliderVisual(bars, value);
                applyAudioFromIndex(value);
                audio?.playSound("ui_button_select");
            }

            if (btn?.metadata?.toggle) {
                const toggle = btn.metadata.toggle;
                const currentValue = toggle.metadata.value;
                const values = toggle.metadata.values;

                const currentIndex = values.indexOf(currentValue);

                if (currentIndex !== -1) {
                    let newIndex;

                    if (direction === "right") {
                        newIndex = (currentIndex + 1) % values.length;
                    } else if (direction === "left") {
                        newIndex = (currentIndex - 1 + values.length) % values.length;
                    } else {
                        return;
                    }

                    const newValue = values[newIndex];
                    toggle.metadata.value = newValue;

                    updateToggleVisual(toggle, newValue);
                    applyToggleValue(newValue);
                }

                audio?.playSound("ui_button_select");
            }
        };

        const gamepadObserver = scene.onBeforeRenderObservable.add(() => {
            const gamepadManager = scene.metadata.gamepad;
            if (!gamepadManager) return;

            const now = performance.now();

            const anyPressed =
                gamepadManager.isButtonPressed(12) ||
                gamepadManager.isButtonPressed(13) ||
                gamepadManager.isButtonPressed(14) ||
                gamepadManager.isButtonPressed(15);

            if (waitingForRelease) {
                if (!anyPressed) {
                    waitingForRelease = false;
                }
                return;
            }

            const getDirection = (): typeof holdDirection => {
                if (gamepadManager.isButtonPressed(12)) return "up";
                if (gamepadManager.isButtonPressed(13)) return "down";
                if (gamepadManager.isButtonPressed(14)) return "left";
                if (gamepadManager.isButtonPressed(15)) return "right";
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
    }, [selectedTab]);
};
