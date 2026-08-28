import { UtilityLayerRenderer } from "@babylonjs/core";
import {
    AdvancedDynamicTexture,
    Rectangle,
    Control,
    TextBlock,
    Ellipse,
    Image,
} from "@babylonjs/gui";

const COLOR_1 = "#E97754";
const TEXT = "◼ SELF-DESTRUCT SYSTEM ACTIVATED ◼";

export const createSelfDestructionUI = (layer: UtilityLayerRenderer) => {
    const ui = AdvancedDynamicTexture.CreateFullscreenUI(
        "UI-Self-Destruction",
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

    createTimer(ui);
    createTextures(ui);

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
    const text = new TextBlock("self-destruct-system-activated", TEXT);

    text.color = COLOR_1;
    text.fontSize = 30;
    text.alpha = 0.0;

    text.top = -110;

    text.metadata = {};
    ui.metadata.text = text;

    ui.addControl(text);
};

const createTimer = (ui: AdvancedDynamicTexture) => {
    const container = new Rectangle("timer-container");
    const size = 140;

    container.width = `${size}px`;
    container.height = `${size}px`;
    container.top = 0;
    container.thickness = 0;

    container.metadata = {};
    ui.metadata.timer = container;

    const circle = new Ellipse("timer-circle");
    circle.thickness = 3;
    circle.color = COLOR_1;
    circle.alpha = 0.0;

    container.metadata.circle = circle;
    container.addControl(circle);

    const integer = new TextBlock("timer-integer", "1.");
    integer.color = COLOR_1;
    integer.fontSize = 60;
    integer.left = -25;
    integer.alpha = 0.0;

    container.metadata.integer = integer;
    container.addControl(integer);

    const decimals = new TextBlock("timer-decimals", "00");
    decimals.color = COLOR_1;
    decimals.fontSize = 40;
    decimals.left = 30;
    decimals.top = 7;
    decimals.alpha = 0.0;

    container.addControl(decimals);
    container.metadata.decimals = decimals;

    ui.addControl(container);
};

interface IconConfig {
    left: string;
    top: string;
    verticalAlignment: number;
    horizontalAlignment: number;
}

const createTextures = (ui: AdvancedDynamicTexture) => {
    const container = new Rectangle("textures-container");
    container.width = "40%";
    container.height = "60%";
    container.alpha = 0;
    container.scaleX = 0;
    container.scaleY = 0;
    container.thickness = 0;

    container.metadata = {};
    container.metadata.wiggleAvailable = false;

    const commonIconProps = {
        texture: "textures/ui/self-destruct-exclamation-mark.png",
        width: "64px",
        height: "64px",
    };

    const iconsConfig: IconConfig[] = [
        {
            left: "20px",
            top: "15px",
            verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
        },
        {
            left: "-20px",
            top: "15px",
            verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_RIGHT,
        },
        {
            left: "20px",
            top: "-15px",
            verticalAlignment: Control.VERTICAL_ALIGNMENT_BOTTOM,
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
        },
        {
            left: "-20px",
            top: "-15px",
            verticalAlignment: Control.VERTICAL_ALIGNMENT_BOTTOM,
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_RIGHT,
        },
        {
            left: "-200px",
            top: "0px",
            verticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER,
            horizontalAlignment: Control.VERTICAL_ALIGNMENT_CENTER,
        },
        {
            left: "200px",
            top: "0px",
            verticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER,
            horizontalAlignment: Control.VERTICAL_ALIGNMENT_CENTER,
        },
        {
            left: "0px",
            top: "200px",
            verticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER,
            horizontalAlignment: Control.VERTICAL_ALIGNMENT_CENTER,
        },
        {
            left: "0px",
            top: "-200px",
            verticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER,
            horizontalAlignment: Control.VERTICAL_ALIGNMENT_CENTER,
        },
    ];

    iconsConfig.forEach((config, index) => {
        const icon = new Image(`mark-${index + 1}`, commonIconProps.texture);
        icon.width = commonIconProps.width;
        icon.height = commonIconProps.height;
        icon.left = config.left;
        icon.top = config.top;
        icon.verticalAlignment = config.verticalAlignment;
        icon.horizontalAlignment = config.horizontalAlignment;

        container.addControl(icon);
    });

    ui.metadata.textures = container;
    ui.addControl(container);
};

export const animate = (ui: AdvancedDynamicTexture, show: boolean, duration: number = 100) => {
    const startAlphaBG = show ? 0 : 0.25;
    const startAlphaLines = show ? 0 : 0.75;
    const startAlphaText = show ? 0 : 1.0;

    const targetAlphaBG = show ? 0.25 : 0;
    const targetAlphaLines = show ? 0.75 : 0;
    const targetAlphaText = show ? 1.0 : 0;

    const startTime = performance.now();

    ui.metadata.textures.metadata.wiggleAvailable = false;

    const animate = () => {
        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        ui.metadata.bg.alpha = startAlphaBG * (1 - t) + targetAlphaBG * t;
        ui.metadata.top.alpha = startAlphaLines * (1 - t) + targetAlphaLines * t;
        ui.metadata.bottom.alpha = startAlphaLines * (1 - t) + targetAlphaLines * t;

        ui.metadata.text.alpha = startAlphaText * (1 - t) + targetAlphaText * t;
        ui.metadata.text.scaleX = startAlphaText * (1 - t) + targetAlphaText * t;

        ui.metadata.timer.metadata.circle.alpha = startAlphaText * (1 - t) + targetAlphaText * t;
        ui.metadata.timer.metadata.circle.scaleX =
            startAlphaText * (1 - t) + targetAlphaText * t * t;
        ui.metadata.timer.metadata.circle.scaleY =
            startAlphaText * (1 - t) + targetAlphaText * t * t;

        ui.metadata.timer.metadata.integer.alpha = startAlphaText * (1 - t) + targetAlphaText * t;
        ui.metadata.timer.metadata.decimals.alpha = startAlphaText * (1 - t) + targetAlphaText * t;

        ui.metadata.textures.alpha = startAlphaText * (1 - t) + targetAlphaText * t * t;
        ui.metadata.textures.scaleX = startAlphaText * (1 - t) + targetAlphaText * t * t;
        ui.metadata.textures.scaleY = startAlphaText * (1 - t) + targetAlphaText * t * t;

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            ui.metadata.textures.metadata.wiggleAvailable = true;
        }
    };

    requestAnimationFrame(animate);
};

export const updateTimer = (ui: AdvancedDynamicTexture, value: string) => {
    const timerContainer = ui.metadata.timer;

    const integerValue = value[0] + ".";
    const decimalsValue = value[2] + value[3];

    const integerBlock = timerContainer.metadata.integer as TextBlock;
    const decimalsBlock = timerContainer.metadata.decimals as TextBlock;

    integerBlock.text = integerValue;
    decimalsBlock.text = decimalsValue;
};

export const updateWiggle = (() => {
    let lastUpdateTime = 0;
    const minInterval = 1000 / 40;
    const wiggleRange = 4;

    return (ui: AdvancedDynamicTexture) => {
        const now = Date.now();

        if (now - lastUpdateTime < minInterval) {
            return;
        }

        lastUpdateTime = now;

        const timerContainer = ui.metadata.textures;
        const shouldWiggle = timerContainer.metadata.wiggleAvailable;

        const defaultScaleX = 1;
        const defaultScaleY = 1;

        if (shouldWiggle) {
            const getRandomOffset = (baseValue: number) => {
                const offset = (Math.random() * (wiggleRange * 2) - wiggleRange) / 100;
                return baseValue * (1 + offset);
            };

            timerContainer.scaleX = getRandomOffset(defaultScaleX);
            timerContainer.scaleY = getRandomOffset(defaultScaleY);
        } else {
            timerContainer.scaleX = defaultScaleX;
            timerContainer.scaleY = defaultScaleY;
        }
    };
})();
