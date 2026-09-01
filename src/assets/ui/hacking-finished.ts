import { Scene, UtilityLayerRenderer } from "@babylonjs/core";
import {
    AdvancedDynamicTexture,
    Rectangle,
    Control,
    TextBlock,
    Ellipse,
    Container,
} from "@babylonjs/gui";

import { REFERENCE_HEIGHT, REFERENCE_WIDTH } from "core_constants";

const COLOR_1 = "#D2CCAD";
const TEXT = "H  A  C  K  I  N  G    F  I  N  I  S  H  E  D";

export const createHackingFinishedUI = (scene: Scene, layer: UtilityLayerRenderer) => {
    const uiMain = AdvancedDynamicTexture.CreateFullscreenUI(
        "UI-Hacking-Finished-Main",
        true,
        scene,
    );
    const uiText = AdvancedDynamicTexture.CreateFullscreenUI(
        "UI-Hacking-Finished-Text",
        true,
        layer.utilityLayerScene,
    );

    uiText.rootContainer.alpha = 0.0;

    uiMain.idealWidth = REFERENCE_WIDTH;
    uiMain.idealHeight = REFERENCE_HEIGHT;
    uiMain.renderAtIdealSize = true;

    uiText.idealWidth = REFERENCE_WIDTH;
    uiText.idealHeight = REFERENCE_HEIGHT;
    uiText.renderAtIdealSize = true;

    uiMain.metadata = {};
    uiText.metadata = {};

    createBackgroundEffect(uiMain);
    createBlackLines(uiMain);
    createTextBlock(uiText);
    createTextUnderScore(uiText);
    createTracery(uiText);

    return { uiMain, uiText };
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
    const text = new TextBlock("hacking-finished", TEXT);

    text.color = COLOR_1;
    text.fontSize = 72;
    text.alpha = 0.0;

    ui.metadata.text = text;

    ui.addControl(text);
};

const createTextUnderScore = (ui: AdvancedDynamicTexture) => {
    const underScore = new Rectangle("under-score");

    underScore.thickness = 0;
    underScore.background = COLOR_1;
    underScore.alpha = 0.0;

    underScore.top = 40;
    underScore.height = "3px";
    underScore.width = "50%";

    ui.metadata.under_score = underScore;

    ui.addControl(underScore);

    const leftCircle = new Ellipse("left-circle");

    leftCircle.thickness = 0;
    leftCircle.background = COLOR_1;
    leftCircle.alpha = 0.0;

    leftCircle.width = "9px";
    leftCircle.height = "9px";
    leftCircle.top = 40;
    leftCircle.left = "-26%";

    ui.metadata.left_circle = leftCircle;

    ui.addControl(leftCircle);

    const rightCircle = new Ellipse("right-circle");

    rightCircle.thickness = 0;
    rightCircle.background = COLOR_1;
    rightCircle.alpha = 0.0;

    rightCircle.width = "9px";
    rightCircle.height = "9px";
    rightCircle.top = 40;
    rightCircle.left = "26%";

    ui.metadata.right_circle = rightCircle;

    ui.addControl(rightCircle);
};

const createTracery = (ui: AdvancedDynamicTexture) => {
    const traceryCenter = new Ellipse("tracery-center");

    traceryCenter.thickness = 0;
    traceryCenter.background = COLOR_1;
    traceryCenter.alpha = 0.0;

    traceryCenter.width = "9px";
    traceryCenter.height = "9px";
    traceryCenter.top = 80;
    traceryCenter.left = "0%";

    ui.metadata.tracery_center = traceryCenter;

    ui.addControl(traceryCenter);

    const traceryLeft = new Ellipse("tracery-left");

    traceryLeft.thickness = 0;
    traceryLeft.background = COLOR_1;
    traceryLeft.alpha = 0.0;

    traceryLeft.width = "9px";
    traceryLeft.height = "9px";
    traceryLeft.top = 60;
    traceryLeft.left = "-0.5%";

    ui.metadata.tracery_left = traceryLeft;

    ui.addControl(traceryLeft);

    const traceryRight = new Ellipse("tracery-right");

    traceryRight.thickness = 0;
    traceryRight.background = COLOR_1;
    traceryRight.alpha = 0.0;

    traceryRight.width = "9px";
    traceryRight.height = "9px";
    traceryRight.top = 60;
    traceryRight.left = "0.5%";

    ui.metadata.tracery_right = traceryRight;

    ui.addControl(traceryRight);
};

export const animateOpacity = (ui: AdvancedDynamicTexture, duration: number = 125) => {
    const startAlpha = 0;
    const startTextTop = 100;
    const startUnderscoreTop = 140;

    const targetAlphaBG = 0.25;
    const targetAlphaLines = 0.75;
    const targetAlphaText = 1.0;
    const targetTextTop = 0;
    const targetUnderscoreTop = 40;

    const startTime = performance.now();

    const animate = () => {
        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        if (!ui.metadata) return;

        if (ui.metadata.bg) {
            ui.metadata.bg.alpha = startAlpha * (1 - t) + targetAlphaBG * t;
        }

        if (ui.metadata.top) {
            ui.metadata.top.alpha = startAlpha * (1 - t) + targetAlphaLines * t;
        }

        if (ui.metadata.bottom) {
            ui.metadata.bottom.alpha = startAlpha * (1 - t) + targetAlphaLines * t;
        }

        if (ui.metadata.text) {
            ui.metadata.text.alpha = startAlpha * (1 - t) + targetAlphaText * t;
            ui.metadata.text.top = startTextTop * (1 - t) + targetTextTop * t;
        }

        if (ui.metadata.under_score) {
            ui.metadata.under_score.alpha = startAlpha * (1 - t) + targetAlphaText * t;
            ui.metadata.under_score.top = startUnderscoreTop * (1 - t) + targetUnderscoreTop * t;
        }

        if (ui.metadata.left_circle) {
            ui.metadata.left_circle.alpha = startAlpha * (1 - t) + targetAlphaText * t;
            ui.metadata.left_circle.top = startUnderscoreTop * (1 - t) + targetUnderscoreTop * t;
        }

        if (ui.metadata.right_circle) {
            ui.metadata.right_circle.alpha = startAlpha * (1 - t) + targetAlphaText * t;
            ui.metadata.right_circle.top = startUnderscoreTop * (1 - t) + targetUnderscoreTop * t;
        }

        if (ui.metadata.tracery_center) {
            ui.metadata.tracery_center.alpha = startAlpha * (1 - t) + targetAlphaText * t;
            ui.metadata.tracery_center.top = 180 * (1 - t) + 80 * t;
        }

        if (ui.metadata.tracery_left) {
            ui.metadata.tracery_left.alpha = startAlpha * (1 - t) + targetAlphaText * t;
            ui.metadata.tracery_left.top = 160 * (1 - t) + 60 * t;
        }

        if (ui.metadata.tracery_right) {
            ui.metadata.tracery_right.alpha = startAlpha * (1 - t) + targetAlphaText * t;
            ui.metadata.tracery_right.top = 160 * (1 - t) + 60 * t;
        }

        if (t < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
};

export const animateRootOpacity = (container: Container, duration: number = 100) => {
    const startAlpha = 0;
    const endAlpha = 1;

    const startTime = performance.now();

    const animate = () => {
        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        container.alpha = startAlpha * (1 - t) + endAlpha * t;

        if (t < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
};
