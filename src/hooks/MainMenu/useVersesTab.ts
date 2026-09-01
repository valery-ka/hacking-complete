import {
    AdvancedDynamicTexture,
    ScrollViewer,
    StackPanel,
    Grid,
    Control,
    Rectangle,
    Button,
    TextBlock,
} from "@babylonjs/gui";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGameState, useVersesContext, useEngineContext, useAudioEngine } from "contexts";
import {
    addChapterText,
    createVerseButton,
    animateButtonOpacity,
    animateButtonSlide,
} from "assets/ui/verses-tab";
import { createSideLineVersesTab } from "assets/ui/side-line";
import {
    fadeInControl,
    animateFromLeft,
    animateTextTyping,
    stopTextTypingAnimation,
} from "assets/ui/animations";
import { breadcrumb } from "utils/diagnostics";
import { REFERENCE_HEIGHT, REFERENCE_WIDTH } from "core_constants";
import {
    ChapterLoadingOverlay,
    createChapterLoadingOverlay,
} from "assets/ui/chapter-loading";
import { assignMenuTexture, captureUIScene } from "utils/babylon";
import { Engine, Scene } from "@babylonjs/core";
import { useControlsUI } from "./useControlsUI";
import {
    getUnlockedVerseIds,
    isVerseUnlocked,
    versesLayout,
} from "verses/verseProgression";
import { getChapterForVerse } from "verses/chapterMusic";

interface IUseVersesTab {
    selectedTab: string;
    texturesLoaded: boolean;
    setHintText: (text: string) => void;
}

const formatLevelNumber = (index: number) => String(index + 1).padStart(2, "0");

export const useVersesTab = ({ selectedTab, texturesLoaded, setHintText }: IUseVersesTab) => {
    const { engineRef, engineSceneRef } = useEngineContext();
    const { setGameState, menuTextureRef, chapterLoadingOverlayRef, menuLockedRef } =
        useGameState();
    const { setSelectedVerse } = useVersesContext();
    const { audioManagerRef } = useAudioEngine();

    const unlockedVerseIds = useMemo(() => getUnlockedVerseIds(), [selectedTab]);
    const unlockedVerses = useMemo(() => new Set(unlockedVerseIds), [unlockedVerseIds]);
    const visibleVersesLayout = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(versesLayout)
                    .map(([chapter, verses]) => [
                        chapter,
                        verses.filter((verse) => unlockedVerses.has(verse)),
                    ])
                    .filter(([_, verses]) => verses.length > 0),
            ) as Record<string, string[]>,
        [unlockedVerses],
    );
    const chapterKeys = useMemo(() => Object.keys(visibleVersesLayout), [visibleVersesLayout]);

    const versesRef = useRef<Record<string, Button>>({});

    const [verseToSelect, setVerseToSelect] = useState("00");
    const verseToSelectRef = useRef(verseToSelect);

    const scrollViewerRef = useRef<ScrollViewer | null>(null);

    /**
     * Decodes the chapter's music before the verse starts, so switching or restarting verses inside
     * the chapter never has to. The overlay is screenshot into the freeze-frame, then disposed
     * before the menu scene is torn down so GUI timers cannot touch a dead GPU texture.
     */
    const loadChapterMusic = async (verseId: string, scene: Scene) => {
        const musicEngine = audioManagerRef.current?.getMusicAudio();
        const chapter = getChapterForVerse(verseId);
        if (!musicEngine || !chapter) return;

        let overlay: ChapterLoadingOverlay | null = null;

        await musicEngine.setActiveChapter(chapter, (loaded, total) => {
            if (total === 0) return;

            overlay ??= createChapterLoadingOverlay(scene);
            overlay.setProgress(loaded, total);
            chapterLoadingOverlayRef.current = overlay;
        });

        await chapterLoadingOverlayRef.current?.waitUntilReady();
    };

    const startGame = async (engine: Engine, scene: Scene, verse?: string) => {
        if (menuLockedRef.current) return;
        const verseToStart = verse ?? verseToSelectRef.current;
        if (!isVerseUnlocked(verseToStart)) return;

        menuLockedRef.current = true;
        breadcrumb("menu.startGame.begin", { verse: verseToStart });

        await loadChapterMusic(verseToStart, scene);
        breadcrumb("menu.startGame.musicReady", { verse: verseToStart });

        if (engine && scene && scene.activeCamera) {
            const texture = await captureUIScene(engine, scene.activeCamera);
            assignMenuTexture(menuTextureRef, texture);
        }
        breadcrumb("menu.startGame.captured", {
            verse: verseToStart,
            hasTexture: Boolean(menuTextureRef.current?.url),
        });

        // Overlay is bound to the menu scene. Dispose it before React unmounts the
        // menu, otherwise typing intervals keep writing into a disposed GUI/GPU texture.
        chapterLoadingOverlayRef.current?.dispose();
        chapterLoadingOverlayRef.current = null;
        breadcrumb("menu.startGame.overlayDisposed", { verse: verseToStart });

        setSelectedVerse(verseToStart);
        setGameState("game");
        breadcrumb("menu.startGame.switched", { verse: verseToStart });

        const audio = audioManagerRef.current?.getCommonAudio();
        audio?.playSound("ui_button_start");
    };

    useControlsUI({ show: selectedTab === "VERSES", verseId: verseToSelect });

    // verses
    useEffect(() => {
        if (selectedTab !== "VERSES" || !texturesLoaded) return;
        menuLockedRef.current = false;
        versesRef.current = {};

        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI-Verses");

        ui.idealWidth = REFERENCE_WIDTH;
        ui.idealHeight = REFERENCE_HEIGHT;
        ui.renderAtIdealSize = true;

        const mainContainer = new StackPanel("main-container");
        mainContainer.isVertical = false;
        mainContainer.width = "60%";
        mainContainer.height = "100%";
        mainContainer.paddingTop = "275px";
        mainContainer.paddingRight = "0px";
        mainContainer.paddingBottom = "250px";
        mainContainer.paddingLeft = "90px";
        mainContainer.background = "#00000000";
        mainContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        mainContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        ui.addControl(mainContainer);

        const scrollViewer = new ScrollViewer("scroll-viewer");
        scrollViewer.thickness = 0;
        scrollViewer.width = "100%";
        scrollViewer.wheelPrecision = 0;
        scrollViewer.paddingTop = "40px";
        scrollViewer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        scrollViewer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        scrollViewer.color = "#49463D";
        scrollViewer.barSize = 0;
        scrollViewer.barColor = "#A9A288";
        scrollViewer.barBackground = "#49463D";
        scrollViewerRef.current = scrollViewer;

        mainContainer.addControl(scrollViewer);

        const contentPanel = new StackPanel("content-panel");
        contentPanel.isVertical = true;
        contentPanel.width = "100%";
        contentPanel.verticalAlignment = StackPanel.VERTICAL_ALIGNMENT_TOP;
        contentPanel.horizontalAlignment = StackPanel.HORIZONTAL_ALIGNMENT_LEFT;

        scrollViewer.addControl(contentPanel);

        const backgroundContentPanel = new Rectangle("background-content-panel");
        backgroundContentPanel.width = "98%";
        backgroundContentPanel.height = "100%";
        backgroundContentPanel.paddingLeft = "90px";
        backgroundContentPanel.thickness = 0;
        backgroundContentPanel.background = "#A9A288";

        contentPanel.addControl(backgroundContentPanel);

        const tableHeader = new Rectangle("table-header");
        tableHeader.width = "100%";
        tableHeader.height = "40px";
        tableHeader.thickness = 0;
        tableHeader.background = "#49463D";
        tableHeader.paddingLeft = "90px";
        tableHeader.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        tableHeader.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        mainContainer.addControl(tableHeader);

        let isAlive = true;
        const typingTargets: TextBlock[] = [];

        const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

        (async () => {
            for (const [chapterLabel, verses] of Object.entries(visibleVersesLayout)) {
                if (!isAlive || !contentPanel.host) break;

                const chapterRow = new Grid("chapter-row");
                chapterRow.addColumnDefinition(200);
                chapterRow.addColumnDefinition(1, true);
                chapterRow.height = "100px";

                animateFromLeft(chapterRow, 0, 90, 100);

                chapterRow.paddingBottom = "30px";
                chapterRow.background = "#D5CCAC";
                chapterRow.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

                chapterRow.alpha = 0;
                fadeInControl(chapterRow, 100);

                const { chapterText, chapterShadow } = addChapterText(chapterLabel);

                typingTargets.push(chapterText);
                animateTextTyping(chapterText, chapterShadow, chapterText.text, {
                    speed: 30,
                });

                chapterText.height = "40px";
                chapterText.left = "25px";

                chapterShadow.height = "40px";
                chapterShadow.top = "5px";
                chapterShadow.left = "30px";

                chapterText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                chapterShadow.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

                chapterRow.addControl(chapterText, 0, 0);
                chapterRow.addControl(chapterShadow, 0, 0);

                const buttonsRow = new StackPanel("buttons-row");
                buttonsRow.isVertical = false;
                buttonsRow.spacing = 10;
                buttonsRow.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                buttonsRow.paddingLeft = "350px";

                (async () => {
                    for (let i = 0; i < verses.length; i++) {
                        if (!isAlive || !contentPanel.host) break;

                        const verse = verses[i];
                        const levelNumber = formatLevelNumber(i);

                        versesRef.current[verse] = createVerseButton(
                            {
                                text: levelNumber,
                                onClick: () => {
                                    if (menuLockedRef.current) return;

                                    setVerseToSelect(verse);

                                    if (verseToSelectRef.current === verse) {
                                        const engine = engineRef.current!;
                                        const scene = engineSceneRef.current!;
                                        startGame(engine, scene, verse);
                                    }
                                },
                            },
                            buttonsRow,
                        );

                        await delay(50);
                    }
                })();

                chapterRow.addControl(buttonsRow, 1, 0);
                contentPanel.addControl(chapterRow);

                await delay(50);
            }

            createSideLineVersesTab(mainContainer, contentPanel.heightInPixels + 40);
        })();

        return () => {
            isAlive = false;
            typingTargets.forEach((text) => stopTextTypingAnimation(text));
            scrollViewerRef.current = null;
            versesRef.current = {};
            ui.dispose();
            setVerseToSelect(unlockedVerseIds[0] ?? "00");
        };
    }, [selectedTab, texturesLoaded, visibleVersesLayout, chapterKeys, unlockedVerseIds]);

    const ensureVerseVisible = (verse: string) => {
        const scrollViewer = scrollViewerRef.current;
        const button = versesRef.current[verse];
        if (!scrollViewer?.host || !button) return;

        if (visibleVersesLayout[chapterKeys[0]]?.includes(verse)) {
            scrollViewer.verticalBar.value = 0;
            return;
        }

        if (visibleVersesLayout[chapterKeys[chapterKeys.length - 1]]?.includes(verse)) {
            scrollViewer.verticalBar.value = scrollViewer.verticalBar.maximum;
            return;
        }

        type Measured = { _currentMeasure: { top: number; height: number } };
        const viewMeasure = (scrollViewer as unknown as Measured)._currentMeasure;
        const viewTop = viewMeasure.top;
        const viewBottom = viewMeasure.top + viewMeasure.height;

        const target = button.parent?.parent ?? button;
        const targetMeasure = (target as unknown as Measured)._currentMeasure;
        const targetTop = targetMeasure.top - target.paddingTopInPixels;
        const targetBottom =
            targetMeasure.top + targetMeasure.height + target.paddingBottomInPixels;

        let deltaPixels = 0;
        if (targetBottom > viewBottom) {
            deltaPixels = targetBottom - viewBottom;
        } else if (targetTop < viewTop) {
            deltaPixels = targetTop - viewTop;
        } else {
            return;
        }

        const { _clientHeight, _window } = scrollViewer as unknown as {
            _clientHeight: number;
            _window: { _currentMeasure: { height: number } };
        };
        const endTop = _clientHeight - _window._currentMeasure.height;
        if (endTop >= 0) return;

        const ratio = scrollViewer.host.idealRatio || 1;
        const nextValue = scrollViewer.verticalBar.value - (deltaPixels * ratio) / endTop;

        scrollViewer.verticalBar.value = Math.min(
            scrollViewer.verticalBar.maximum,
            Math.max(0, nextValue),
        );
    };

    useEffect(() => {
        if (selectedTab !== "VERSES" || !texturesLoaded) return;

        const verses = versesRef.current;

        for (const key in verses) {
            const btn = verses[key];
            const to = key === verseToSelect ? 1 : 0;

            animateButtonOpacity(btn, to, 100);
            animateButtonSlide(btn, to, 100);
        }

        verseToSelectRef.current = verseToSelect;
        ensureVerseVisible(verseToSelect);

        const scrollViewer = scrollViewerRef.current;
        if (scrollViewer) {
            scrollViewer.markAsDirty();
        }
    }, [verseToSelect, selectedTab, texturesLoaded]);

    useEffect(() => {
        const audio = audioManagerRef.current?.getCommonAudio();
        audio?.playSound("ui_button_select");
    }, [verseToSelect]);

    useEffect(() => {
        if (selectedTab !== "VERSES") return;

        const chapterEntry = Object.entries(versesLayout).find(([_, verses]) =>
            verses.includes(verseToSelect),
        );

        if (chapterEntry) {
            const [chapterKey, verses] = chapterEntry;
            const levelIndex = verses.indexOf(verseToSelect);
            const levelNumber = formatLevelNumber(levelIndex);

            const chapterMatch = chapterKey.match(/CHAPTER\s+(.+)/);
            const chapterNumber = chapterMatch ? chapterMatch[1].trim() : "";

            const formattedString = `Chapter ${chapterNumber} Verse ${levelNumber}`;
            setHintText(formattedString);
        }
    }, [selectedTab, verseToSelect]);

    const getNextVerse = (currentVerse: string, direction: "left" | "right" | "up" | "down") => {
        let currentChapterIndex = -1;
        let verseIndex = -1;

        for (let i = 0; i < chapterKeys.length; i++) {
            const verses = visibleVersesLayout[chapterKeys[i]];
            const index = verses.indexOf(currentVerse);
            if (index !== -1) {
                currentChapterIndex = i;
                verseIndex = index;
                break;
            }
        }

        if (currentChapterIndex === -1) return currentVerse;

        switch (direction) {
            case "left": {
                const verses = visibleVersesLayout[chapterKeys[currentChapterIndex]];
                if (verseIndex > 0) return verses[verseIndex - 1];
                return currentVerse;
            }

            case "right": {
                const verses = visibleVersesLayout[chapterKeys[currentChapterIndex]];
                if (verseIndex < verses.length - 1) return verses[verseIndex + 1];
                return currentVerse;
            }

            case "up": {
                for (let i = currentChapterIndex - 1; i >= 0; i--) {
                    const verses = visibleVersesLayout[chapterKeys[i]];
                    if (verses.length > 0) {
                        return verses[Math.min(verseIndex, verses.length - 1)];
                    }
                }
                return currentVerse;
            }

            case "down": {
                for (let i = currentChapterIndex + 1; i < chapterKeys.length; i++) {
                    const verses = visibleVersesLayout[chapterKeys[i]];
                    if (verses.length > 0) {
                        return verses[Math.min(verseIndex, verses.length - 1)];
                    }
                }
                return currentVerse;
            }
        }
    };

    // mouse wheel: switch chapter row (same as up / down)
    useEffect(() => {
        if (selectedTab !== "VERSES" || !texturesLoaded) return;

        let lastWheelTime = 0;
        const WHEEL_COOLDOWN_MS = 80;

        const onMouseWheel = (e: WheelEvent) => {
            if (menuLockedRef.current) return;
            if (e.deltaY === 0) return;

            e.preventDefault();

            const now = performance.now();
            if (now - lastWheelTime < WHEEL_COOLDOWN_MS) return;
            lastWheelTime = now;

            const direction = e.deltaY > 0 ? "down" : "up";
            setVerseToSelect((prev) => getNextVerse(prev, direction));
        };

        document.addEventListener("wheel", onMouseWheel, { passive: false });
        return () => {
            document.removeEventListener("wheel", onMouseWheel);
        };
    }, [selectedTab, texturesLoaded, visibleVersesLayout, chapterKeys]);

    // keyboard events
    useEffect(() => {
        if (selectedTab !== "VERSES" || !texturesLoaded) return;

        const scene = engineSceneRef.current;
        if (!scene) return;

        const engine = engineRef.current;
        if (!engine) return;

        const navigate = (direction: "left" | "right" | "up" | "down") => {
            setVerseToSelect((prev) => getNextVerse(prev, direction));
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (menuLockedRef.current) return;

            switch (e.code) {
                case "KeyA":
                case "ArrowLeft":
                    navigate("left");
                    break;

                case "KeyD":
                case "ArrowRight":
                    navigate("right");
                    break;

                case "KeyW":
                case "ArrowUp":
                    navigate("up");
                    break;

                case "KeyS":
                case "ArrowDown":
                    navigate("down");
                    break;

                case "Enter":
                case "NumpadEnter":
                case "Space":
                    startGame(engine, scene);
                    break;

                default:
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedTab]);

    // gamepad events
    useEffect(() => {
        if (selectedTab !== "VERSES" || !texturesLoaded) return;

        const scene = engineSceneRef.current;
        if (!scene) return;

        const engine = engineRef.current;
        if (!engine) return;

        const INITIAL_DELAY = 500;
        const REPEAT_DELAY = 50;

        let holdDirection: "up" | "down" | "left" | "right" | null = null;
        let firstPressTime = 0;
        let lastTriggerTime = 0;

        let waitingForRelease = true;
        let aWasPressed = false;

        const trigger = (direction: "up" | "down" | "left" | "right") => {
            setVerseToSelect((prev) => getNextVerse(prev, direction));
        };

        const gamepadObserver = scene.onBeforeRenderObservable.add(() => {
            if (menuLockedRef.current) return;

            const gamepadManager = scene.metadata.gamepad;
            if (!gamepadManager) return;

            const now = performance.now();

            const anyPressed =
                gamepadManager.isButtonPressed(0) ||
                gamepadManager.isButtonPressed(9) ||
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

            const aPressedNow =
                gamepadManager.isButtonPressed(0) || gamepadManager.isButtonPressed(9);

            if (aPressedNow && !aWasPressed) {
                aWasPressed = true;
                startGame(engine, scene);
            }

            if (!aPressedNow) {
                aWasPressed = false;
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
    }, [selectedTab, texturesLoaded]);
};
