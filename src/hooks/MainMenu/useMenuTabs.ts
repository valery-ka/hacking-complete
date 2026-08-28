import { AdvancedDynamicTexture, Button } from "@babylonjs/gui/2D";

import { useEffect, useRef, useState } from "react";
import { useEngineContext, useAudioEngine, useGameState } from "contexts";

import {
    createMenuButton,
    animateButtonOpacity,
    animateButtonLinesOffset,
    animateButtonSlide,
} from "assets/ui/tab-button";
import { createSideMenuTabs } from "assets/ui/side-line";

interface ITabConfig {
    key: string;
    text: string;
    left: string;
    top: string;
    icons_path?: [string, string];
}

// const tabs: ITabConfig[] = [
//     {
//         key: "VERSES",
//         text: "VERSES",
//         left: "-255px",
//         top: "30px",
//         icons_path: ["textures/ui/verses_00.png", "textures/ui/verses_01.png"],
//     },
//     {
//         key: "INTEL",
//         text: "INTEL",
//         left: "0px",
//         top: "30px",
//         icons_path: ["textures/ui/intel_00.png", "textures/ui/intel_01.png"],
//     },
//     {
//         key: "SYSTEM",
//         text: "SYSTEM",
//         left: "255px",
//         top: "30px",
//         icons_path: ["textures/ui/system_00.png", "textures/ui/system_01.png"],
//     },
// ];

const tabs: ITabConfig[] = [
    {
        key: "VERSES",
        text: "VERSES",
        left: "-130px",
        top: "30px",
        icons_path: ["textures/ui/verses_00.png", "textures/ui/verses_01.png"],
    },
    {
        key: "SYSTEM",
        text: "SYSTEM",
        left: "130px",
        top: "30px",
        icons_path: ["textures/ui/system_00.png", "textures/ui/system_01.png"],
    },
];

interface IUseMenuTabs {
    texturesLoaded: boolean;
}

export const useMenuTabs = ({ texturesLoaded }: IUseMenuTabs) => {
    const { engineSceneRef } = useEngineContext();
    const { audioManagerRef } = useAudioEngine();
    const { menuLockedRef } = useGameState();

    const tabsRef = useRef<Record<string, Button>>({});
    const [selectedTab, setSelectedTab] = useState(tabs[0]?.key || "");
    const selectedTabRef = useRef(selectedTab);

    useEffect(() => {
        if (!texturesLoaded) return;

        const uiButtons = AdvancedDynamicTexture.CreateFullscreenUI("UI-Tab-Buttons");

        tabs.forEach(({ key, text, left, top, icons_path }) => {
            tabsRef.current[key] = createMenuButton(
                {
                    text,
                    top,
                    left,
                    topLine: true,
                    bottomLine: true,
                    selectorTexture: true,
                    icons_path,
                    onClick: () => {
                        if (menuLockedRef.current) return;
                        setSelectedTab(key);
                    },
                },
                uiButtons,
            );
        });

        createSideMenuTabs(uiButtons, 30);

        uiButtons.idealWidth = 2560;
        uiButtons.idealHeight = 1440;

        return () => {
            uiButtons.dispose();
        };
    }, [texturesLoaded]);

    // Keyboard controls
    const lastKeyboardSwitchRef = useRef(0);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (menuLockedRef.current) return;

            const now = Date.now();
            if (now - lastKeyboardSwitchRef.current < 100) return;
            lastKeyboardSwitchRef.current = now;

            const keys = Object.keys(tabsRef.current);
            const currentIndex = keys.indexOf(selectedTabRef.current);

            switch (e.code) {
                case "KeyQ": {
                    const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
                    setSelectedTab(keys[prevIndex]);
                    break;
                }
                case "KeyE": {
                    const nextIndex = (currentIndex + 1) % keys.length;
                    setSelectedTab(keys[nextIndex]);
                    break;
                }
                default:
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Gamepad controls
    useEffect(() => {
        if (selectedTab !== "VERSES" || !texturesLoaded) return;

        const scene = engineSceneRef.current;
        if (!scene) return;

        const INITIAL_DELAY = 300;
        const REPEAT_DELAY = 100;

        let holdDirection: "left" | "right" | null = null;
        let firstPressTime = 0;
        let lastTriggerTime = 0;

        const trigger = (direction: "left" | "right") => {
            const keys = Object.keys(tabsRef.current);
            const currentIndex = keys.indexOf(selectedTabRef.current);

            if (currentIndex === -1) return;

            switch (direction) {
                case "left": {
                    const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
                    setSelectedTab(keys[prevIndex]);
                    break;
                }
                case "right": {
                    const nextIndex = (currentIndex + 1) % keys.length;
                    setSelectedTab(keys[nextIndex]);
                    break;
                }
                default:
                    break;
            }
        };

        const gamepadObserver = scene.onBeforeRenderObservable.add(() => {
            if (menuLockedRef.current) return;

            const gamepadManager = scene.metadata.gamepad;
            if (!gamepadManager) return;

            const now = performance.now();

            const getDirection = (): typeof holdDirection => {
                if (gamepadManager.isButtonPressed(4)) return "left";
                if (gamepadManager.isButtonPressed(5)) return "right";
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
    }, []);

    useEffect(() => {
        if (!texturesLoaded) return;

        const audio = audioManagerRef.current?.getCommonAudio();

        const tabs = tabsRef.current;

        for (const key in tabs) {
            const btn = tabs[key];
            const to = key === selectedTab ? 1 : 0;

            animateButtonOpacity(btn, to, 100);
            animateButtonSlide(btn, to, 100);
            animateButtonLinesOffset(btn, to, 50);
        }

        selectedTabRef.current = selectedTab;

        audio?.playSound("ui_button_select");
    }, [selectedTab, texturesLoaded]);

    return { selectedTab };
};
