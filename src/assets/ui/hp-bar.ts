import { Engine } from "@babylonjs/core";
import { AdvancedDynamicTexture, Control, Rectangle } from "@babylonjs/gui";

const COLOR_1 = "#49463D";
const COLOR_2 = "#D5CCAE";
const COLOR_3 = "#E17E6C";
const SHADOW_COLOR = "#00000070";

export const createHPBar = (ui: AdvancedDynamicTexture) => {
    const hpContainer = new Rectangle("hp-container");

    hpContainer.width = "1000px";
    hpContainer.height = "50px";

    hpContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    hpContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;

    hpContainer.top = "-100px";
    hpContainer.thickness = 0;

    hpContainer.metadata = {};

    createBar(hpContainer);
    createLine(hpContainer);
    createSquares(hpContainer);

    ui.addControl(hpContainer);

    hpContainer.metadata.animate_hide = () => animateHide(hpContainer);
    hpContainer.metadata.animate_show = () => animateShow(hpContainer);
    hpContainer.metadata.update_hp_bar = (
        сontainer: Rectangle,
        count: number,
        totalHP: number,
        engine: Engine,
    ) => updateHPBar(сontainer, count, totalHP, engine);

    return hpContainer;
};

const createBar = (container: Rectangle) => {
    const bar0 = new Rectangle("hp-bar-layer-0");

    bar0.width = "950px";
    bar0.height = "18px";

    bar0.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    bar0.top = "5px";

    bar0.thickness = 0;
    bar0.background = COLOR_1;

    bar0.shadowBlur = 5;
    bar0.shadowColor = SHADOW_COLOR;

    bar0.zIndex = 0;

    container.addControl(bar0);

    const bar1 = new Rectangle("hp-bar-layer-1");

    bar1.width = "950px";
    bar1.height = "18px";

    bar1.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    bar1.top = "5px";

    bar1.thickness = 0;
    bar1.background = COLOR_2;

    bar1.zIndex = 2;
    bar1.transformCenterX = 0.0;

    container.addControl(bar1);

    const bar2 = new Rectangle("hp-bar-layer-2");

    bar2.width = "950px";
    bar2.height = "18px";

    bar2.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    bar2.top = "5px";

    bar2.thickness = 0;
    bar2.background = COLOR_3;

    bar2.zIndex = 1;
    bar2.transformCenterX = 0.0;

    container.addControl(bar2);

    container.metadata.static_layer = bar0;
    container.metadata.responsive_layer = bar1;
    container.metadata.delayed_layer = bar2;
};

const createLine = (container: Rectangle) => {
    const line = new Rectangle("hp-bar-line");

    line.width = "950px";
    line.height = "3px";

    line.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    line.top = "28px";

    line.thickness = 0;
    line.background = COLOR_1;

    line.shadowBlur = 5;
    line.shadowColor = SHADOW_COLOR;

    container.addControl(line);

    container.metadata.line = line;
};

const createSquares = (container: Rectangle) => {
    const SIZE = "7px";

    const square1 = new Rectangle("hp-bar-square-1");

    square1.width = SIZE;
    square1.height = SIZE;

    square1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    square1.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    square1.thickness = 0;
    square1.background = COLOR_1;

    square1.left = "13px";
    square1.top = "26px";

    square1.shadowBlur = 5;
    square1.shadowColor = SHADOW_COLOR;

    container.addControl(square1);

    const square2 = new Rectangle("hp-bar-square-2");

    square2.width = SIZE;
    square2.height = SIZE;

    square2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    square2.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    square2.thickness = 0;
    square2.background = COLOR_1;

    square2.left = "-13px";
    square2.top = "26px";

    square2.shadowBlur = 5;
    square2.shadowColor = SHADOW_COLOR;

    container.addControl(square2);

    const square3 = new Rectangle("hp-bar-square-3");

    square3.width = SIZE;
    square3.height = SIZE;

    square3.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    square3.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    square3.thickness = 0;
    square3.background = COLOR_1;

    square3.left = "23px";
    square3.top = "36px";

    square3.shadowBlur = 5;
    square3.shadowColor = SHADOW_COLOR;

    container.addControl(square3);

    const square4 = new Rectangle("hp-bar-square-4");

    square4.width = SIZE;
    square4.height = SIZE;

    square4.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    square4.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    square4.thickness = 0;
    square4.background = COLOR_1;

    square4.left = "-23px";
    square4.top = "36px";

    square4.shadowBlur = 5;
    square4.shadowColor = SHADOW_COLOR;

    container.addControl(square4);
};

// Animations
const animateShow = (сontainer: Rectangle) => {
    animateBlink(сontainer, true);
    animateSlide(сontainer.metadata.line, false, 1000);
    animateSlide(сontainer.metadata.static_layer, false, 500);
};

const animateHide = (сontainer: Rectangle) => {
    animateBlink(сontainer, false);
    animateSlide(сontainer.metadata.line, true, 1000);
    animateSlide(сontainer.metadata.static_layer, true, 500);
    animateSlide(сontainer.metadata.delayed_layer, true, 100);
};

const updateHPBar = (сontainer: Rectangle, count: number, totalHP: number, engine: Engine) => {
    const responsiveLayer = сontainer.metadata.responsive_layer;
    const delayedLayer = сontainer.metadata.delayed_layer;

    if (!сontainer.metadata.delayed_state) {
        сontainer.metadata.delayed_state = {
            lastProgress: 1,
            lastChangeTime: 0,
            currentScaleX: delayedLayer.scaleX ?? 1,
            isSmoothing: false,
        };
    }
    const state = сontainer.metadata.delayed_state;
    const progress = Math.max(0, Math.min(1, 1 - count / totalHP));

    responsiveLayer.scaleX = progress;

    const now = performance.now();
    const hasChanged = Math.abs(progress - state.lastProgress) > 0.001;

    if (hasChanged) {
        state.lastProgress = progress;
        state.lastChangeTime = now;
        state.isSmoothing = false;
    }

    const isIdle = now - state.lastChangeTime >= 500;
    if (isIdle && !state.isSmoothing) {
        state.isSmoothing = true;
    }

    if (state.isSmoothing) {
        const dt = engine.getDeltaTime() / 1000;
        const speed = 1;

        const diff = progress - state.currentScaleX;
        if (Math.abs(diff) > 0.001) {
            const move = speed * dt;
            state.currentScaleX += Math.sign(diff) * Math.min(move, Math.abs(diff));
        } else {
            state.currentScaleX = progress;
            state.isSmoothing = false;
        }

        delayedLayer.scaleX = state.currentScaleX;
    }

    return count >= totalHP;
};

const animateSlide = (element: Rectangle, reverse: boolean = false, duration: number = 1000) => {
    const from = reverse ? 1 : 0;
    const to = reverse ? 0 : 1;

    const t0 = performance.now();

    const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        const v = from + (to - from) * p;

        element.scaleX = v;

        if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
};

const animateBlink = (
    сontainer: Rectangle,
    finalVisibility: boolean = true,
    duration: number = 500,
    blinks: number = 4,
) => {
    const blinkInterval = duration / (blinks * 2);
    let blinkCount = 0;

    return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
            сontainer.isVisible = !сontainer.isVisible;
            blinkCount++;

            if (blinkCount >= blinks * 2) {
                clearInterval(interval);
                сontainer.isVisible = finalVisibility;
                resolve();
            }
        }, blinkInterval);
    });
};
