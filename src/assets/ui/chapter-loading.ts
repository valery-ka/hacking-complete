import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Control, Rectangle, TextBlock } from "@babylonjs/gui";

import { animateTextTyping, stopTextTypingAnimation } from "./animations";

const COLOR_BACKDROP = "#1B1712";
const COLOR_TRACK = "#49463D";
const COLOR_FILL = "#A9A288";
const COLOR_TEXT = "#D5CCAE";

const Z_INDEX = 2000;
const MESSAGE = "H A C K I N G  I N";
const DEFAULT_POST_LOAD_DELAY_MS = 100;

export interface ChapterLoadingOverlayOptions {
    postLoadDelayMs?: number;
}

export interface ChapterLoadingOverlay {
    setProgress: (loaded: number, total: number) => void;
    waitUntilReady: () => Promise<void>;
    dispose: () => void;
}

export const createChapterLoadingOverlay = (
    scene: Scene,
    options: ChapterLoadingOverlayOptions = {},
): ChapterLoadingOverlay => {
    const postLoadDelayMs = options.postLoadDelayMs ?? DEFAULT_POST_LOAD_DELAY_MS;

    const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI-Chapter-Loading", true, scene);

    ui.idealWidth = 2560;
    ui.idealHeight = 1440;
    ui.renderAtIdealSize = true;

    const backdrop = new Rectangle("chapter-loading-backdrop");
    backdrop.width = "100%";
    backdrop.height = "100%";
    backdrop.thickness = 0;
    backdrop.background = COLOR_BACKDROP;
    backdrop.alpha = 0.94;
    backdrop.zIndex = Z_INDEX;
    backdrop.isPointerBlocker = true;
    backdrop.isHitTestVisible = true;

    ui.addControl(backdrop);

    const message = new TextBlock("chapter-loading-message", MESSAGE);
    message.fontFamily = "monospace";
    message.fontSize = 48;
    message.color = COLOR_TEXT;
    message.height = "60px";
    message.top = "-60px";
    message.zIndex = Z_INDEX + 1;

    ui.addControl(message);

    const track = new Rectangle("chapter-loading-track");
    track.width = "760px";
    track.height = "14px";
    track.thickness = 0;
    track.background = COLOR_TRACK;
    track.top = "20px";
    track.zIndex = Z_INDEX + 1;

    ui.addControl(track);

    const fill = new Rectangle("chapter-loading-fill");
    fill.width = "100%";
    fill.height = "100%";
    fill.thickness = 0;
    fill.background = COLOR_FILL;
    fill.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    fill.transformCenterX = 0;
    fill.scaleX = 0;

    track.addControl(fill);

    const percent = new TextBlock("chapter-loading-percent", "0%");
    percent.fontFamily = "monospace";
    percent.fontSize = 28;
    percent.color = COLOR_TEXT;
    percent.height = "40px";
    percent.top = "70px";
    percent.zIndex = Z_INDEX + 1;

    ui.addControl(percent);

    let loadingComplete = false;
    let animationComplete = false;
    let readyPromise: Promise<void> | null = null;
    let readyResolve: (() => void) | null = null;
    let postLoadDelayTimer: ReturnType<typeof setTimeout> | null = null;

    const tryScheduleReady = () => {
        if (!loadingComplete || !animationComplete || readyResolve === null) return;

        postLoadDelayTimer = setTimeout(() => {
            readyResolve?.();
            readyResolve = null;
        }, postLoadDelayMs);
    };

    animateTextTyping(message, null, MESSAGE, {
        speed: 30,
        onComplete: () => {
            animationComplete = true;
            tryScheduleReady();
        },
    });

    let disposed = false;

    return {
        setProgress: (loaded: number, total: number) => {
            if (disposed) return;

            const ratio = total > 0 ? Math.min(1, loaded / total) : 1;

            fill.scaleX = ratio;
            percent.text = `${Math.round(ratio * 100)}%`;

            if (ratio >= 1) {
                loadingComplete = true;
                tryScheduleReady();
            }
        },
        waitUntilReady: () => {
            readyPromise ??= new Promise((resolve) => {
                readyResolve = resolve;
                tryScheduleReady();
            });

            return readyPromise;
        },
        dispose: () => {
            if (disposed) return;
            disposed = true;

            if (postLoadDelayTimer !== null) {
                clearTimeout(postLoadDelayTimer);
                postLoadDelayTimer = null;
            }
            stopTextTypingAnimation(message);
            // Leave the ADT on the scene. Scene.dispose() owns GPU teardown;
            // disposing the texture here and again from the scene crashes ADT.dispose.
        },
    };
};
