import { UtilityLayerRenderer } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle, Control, TextBlock } from "@babylonjs/gui";

const COLOR_1 = "#D2CCAD";
const TEXT = "S  Y  S  T  E  M    I  N  T  E  R  R  U  P  T  I  O  N";
const CURSOR_TEXT = "_";

export const createPauseUI = (layer: UtilityLayerRenderer) => {
    const ui = AdvancedDynamicTexture.CreateFullscreenUI(
        "UI-System-Interruption",
        true,
        layer.utilityLayerScene,
    );

    ui.idealWidth = 2560;
    ui.idealHeight = 1440;
    ui.renderAtIdealSize = true;

    ui.metadata = {};

    createBackgroundEffect(ui);
    createBlackLines(ui);
    createTextBlock(ui);

    return ui;
};

const createBackgroundEffect = (ui: AdvancedDynamicTexture) => {
    const bg = new Rectangle("bg-rect");

    bg.thickness = 0;
    bg.background = "#000000";
    bg.alpha = 0.0;

    ui.metadata.bg = bg;

    ui.addControl(bg);
};

const createBlackLines = (ui: AdvancedDynamicTexture) => {
    const top = new Rectangle("top-rect");

    top.thickness = 0;
    top.background = "#222222";
    top.alpha = 0.0;

    top.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    top.height = "150px";

    ui.metadata.top = top;

    ui.addControl(top);

    const bottom = new Rectangle("bottom-rect");

    bottom.thickness = 0;
    bottom.background = "#222222";
    bottom.alpha = 0.0;

    bottom.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    bottom.height = "150px";

    ui.metadata.bottom = bottom;

    ui.addControl(bottom);
};

const createTextBlock = (ui: AdvancedDynamicTexture) => {
    const cursor = new TextBlock("cursor", CURSOR_TEXT);

    cursor.color = COLOR_1;
    cursor.fontSize = 72;
    cursor.left = "32.5%";
    cursor.isVisible = false;

    ui.addControl(cursor);

    const text = new TextBlock("hacking-complete", TEXT);

    text.color = COLOR_1;
    text.fontSize = 72;
    text.alpha = 0.0;

    text.metadata = {};
    text.metadata.cursor = cursor;
    ui.metadata.text = text;

    ui.addControl(text);
};

export const animateOpacity = (
    ui: AdvancedDynamicTexture,
    show: boolean,
    duration: number = 125,
) => {
    const startAlphaBG = show ? 0 : 0.25;
    const startAlphaLines = show ? 0 : 0.75;
    const startAlphaText = show ? 0 : 1.0;

    const targetAlphaBG = show ? 0.25 : 0;
    const targetAlphaLines = show ? 0.75 : 0;
    const targetAlphaText = show ? 1.0 : 0;

    const startTime = performance.now();

    const animate = () => {
        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        ui.metadata.bg.alpha = startAlphaBG * (1 - t) + targetAlphaBG * t;

        ui.metadata.top.alpha = startAlphaLines * (1 - t) + targetAlphaLines * t;

        ui.metadata.bottom.alpha = startAlphaLines * (1 - t) + targetAlphaLines * t;

        ui.metadata.text.alpha = startAlphaText * (1 - t) + targetAlphaText * t;
        ui.metadata.text.metadata.cursor.alpha = startAlphaText * (1 - t) + targetAlphaText * t;

        if (t < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
};

export const animateTextTyping = (ui: AdvancedDynamicTexture): (() => void) => {
    const speed = 8;
    const blinkInterval = 500;

    const mainText = ui.metadata.text;
    const cursorText = mainText.metadata.cursor;

    const activeIntervals = ((animateTextTyping as any)._activeIntervals ??= new Map());

    const existing = activeIntervals.get(mainText);
    if (existing) {
        clearInterval(existing.typingInterval);
        clearInterval(existing.cursorInterval);
    }

    let currentIndex = 0;
    let cursorVisible = true;

    const cursorInterval = setInterval(() => {
        cursorVisible = !cursorVisible;
        cursorText.isVisible = cursorVisible ? 1 : 0;
    }, blinkInterval);

    const typingInterval = setInterval(() => {
        if (currentIndex <= TEXT.length) {
            mainText.text = TEXT.substring(0, currentIndex);
            currentIndex++;
        } else {
            clearInterval(typingInterval);
        }
    }, speed);

    activeIntervals.set(mainText, {
        typingInterval,
        cursorInterval,
    });

    return () => {
        clearInterval(typingInterval);
        clearInterval(cursorInterval);
        activeIntervals.delete(mainText);
    };
};
