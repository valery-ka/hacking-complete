import { useEffect, useRef } from "react";
import { useAudioEngine } from "contexts";

import { AdvancedDynamicTexture, Control, Image, TextBlock } from "@babylonjs/gui";
import { Nullable } from "types/common";

import { animateTextTyping, stopTextTypingAnimation } from "assets/ui/animations";
import { REFERENCE_HEIGHT, REFERENCE_WIDTH } from "core_constants";

const TEXT_COLOR = "#343128";

const LOADING_MESSAGE = "B O O T I N G   S Y S T E M";
const LOADED_MESSAGE = "P R E S S   L E F T   M O U S E   BUTTON";

const TYPING_SPEED_MS = 50;
const POST_BOOT_DELAY_MS = 600;

const formatBootingMessage = (percent: number) => `${LOADING_MESSAGE}  (${percent}%)`;

const startListeningForDismiss = (onDismiss: () => void): (() => void) => {
    let dismissed = false;

    const dismiss = () => {
        if (dismissed) return;
        dismissed = true;
        cleanup();
        onDismiss();
    };

    const onKeyDown = () => dismiss();
    const onPointerDown = () => dismiss();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);

    let rafId = 0;
    const pollGamepad = () => {
        const pads = navigator.getGamepads?.() ?? [];
        for (const pad of pads) {
            if (!pad) continue;
            if (pad.buttons.some((button) => button.pressed || button.value >= 0.75)) {
                dismiss();
                return;
            }
        }
        rafId = requestAnimationFrame(pollGamepad);
    };
    rafId = requestAnimationFrame(pollGamepad);

    const cleanup = () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("pointerdown", onPointerDown);
        cancelAnimationFrame(rafId);
    };

    return cleanup;
};

export const useLoadingUI = () => {
    const textRef = useRef<Nullable<TextBlock>>(null);
    const audioLoadedRef = useRef(false);
    const bootingDoneRef = useRef(false);
    const loadedSequenceStartedRef = useRef(false);
    const tryStartLoadedSequenceRef = useRef<() => void>(() => { });
    const progressRef = useRef(0);

    const { audioLoaded, audioLoadProgress, audioManagerRef, setAudioEngineLoaded } =
        useAudioEngine();

    progressRef.current = audioLoadProgress;

    useEffect(() => {
        const ui = AdvancedDynamicTexture.CreateFullscreenUI("Loading-Overlay-UI");

        ui.idealWidth = REFERENCE_WIDTH;
        ui.idealHeight = REFERENCE_HEIGHT;
        ui.renderAtIdealSize = true;

        const logo = new Image("YoRHa-Logo", "textures/ui/title.png");
        logo.width = "1279px";
        logo.height = "411px";

        logo.scaleX = 0.9;
        logo.scaleY = 0.9;
        ui.addControl(logo);

        const textBlock = new TextBlock("Loading-Overlay-Message", LOADING_MESSAGE);
        textBlock.fontSize = "64px";
        textBlock.color = TEXT_COLOR;

        textBlock.top = "90px";
        textBlock.left = "100px";

        textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        textBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

        ui.addControl(textBlock);
        textRef.current = textBlock;

        let cancelled = false;
        let delayTimer: ReturnType<typeof setTimeout> | null = null;
        let removeInputListeners: (() => void) | null = null;

        const dismissToMenu = () => {
            if (cancelled) return;

            const tryDismiss = () => {
                if (cancelled) return;
                if (!audioManagerRef.current) {
                    requestAnimationFrame(tryDismiss);
                    return;
                }
                setAudioEngineLoaded(true);
            };

            tryDismiss();
        };

        const tryStartLoadedSequence = () => {
            if (cancelled || loadedSequenceStartedRef.current) return;
            if (!bootingDoneRef.current || !audioLoadedRef.current) return;

            loadedSequenceStartedRef.current = true;

            if (textRef.current) {
                textRef.current.text = formatBootingMessage(100);
            }

            delayTimer = setTimeout(() => {
                if (cancelled || !textRef.current) return;

                animateTextTyping(textRef.current, null, LOADED_MESSAGE, {
                    speed: TYPING_SPEED_MS,
                    onComplete: () => {
                        if (cancelled) return;
                        removeInputListeners = startListeningForDismiss(dismissToMenu);
                    },
                });
            }, POST_BOOT_DELAY_MS);
        };

        tryStartLoadedSequenceRef.current = tryStartLoadedSequence;

        animateTextTyping(textBlock, null, LOADING_MESSAGE, {
            speed: TYPING_SPEED_MS,
            onComplete: () => {
                bootingDoneRef.current = true;
                if (textRef.current) {
                    textRef.current.text = formatBootingMessage(progressRef.current);
                }
                tryStartLoadedSequence();
            },
        });

        return () => {
            cancelled = true;
            if (delayTimer) clearTimeout(delayTimer);
            removeInputListeners?.();
            stopTextTypingAnimation(textBlock);
            textRef.current = null;
            ui.dispose();
        };
    }, [audioManagerRef, setAudioEngineLoaded]);

    useEffect(() => {
        if (!audioLoaded) return;

        audioLoadedRef.current = true;
        tryStartLoadedSequenceRef.current();
    }, [audioLoaded]);

    useEffect(() => {
        if (!bootingDoneRef.current || loadedSequenceStartedRef.current) return;
        if (!textRef.current) return;

        textRef.current.text = formatBootingMessage(audioLoadProgress);
    }, [audioLoadProgress]);
};
