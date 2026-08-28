import { Button, Control, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui";

import { isControlAlive } from "utils/diagnostics";

const CHAPTER_FONT_SIZE = 32;
const VERSE_FONT_SIZE = 23;

const COLOR_1 = "#49463D";
const COLOR_2 = "#A9A288";
const COLOR_3 = "#D5CCAE";

export interface MenuButtonOptions {
    text?: string;

    fontSize?: string;
    width?: string;
    height?: string;

    background?: string;
    color?: string;

    radius?: number;
    thickness?: number;

    top?: string;
    left?: string;

    vAlign?: number;
    hAlign?: number;

    onClick?: () => void;
}

export const disablePointerAnimations = (btn: Button) => {
    (btn as any).pointerEnterAnimation = null;
    (btn as any).pointerOutAnimation = null;
    (btn as any).pointerDownAnimation = null;
    (btn as any).pointerUpAnimation = null;
};

export const addChapterText = (str: string) => {
    const chapterShadow = new TextBlock(str + "-shadow");
    chapterShadow.text = str;
    chapterShadow.fontFamily = "monospace";
    chapterShadow.color = "rgba(0, 0, 0, 0.15)";

    chapterShadow.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    chapterShadow.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

    const chapterText = new TextBlock(str);
    chapterText.text = str;
    chapterText.fontFamily = "monospace";
    chapterText.color = "#4D493F";

    chapterText.fontSize = CHAPTER_FONT_SIZE;
    chapterShadow.fontSize = CHAPTER_FONT_SIZE;

    chapterText.resizeToFit = true;
    chapterShadow.resizeToFit = true;

    chapterText.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    chapterText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

    return { chapterText, chapterShadow };
};

export const createVerseButton = (opts: MenuButtonOptions = {}, panel: StackPanel) => {
    const container = createButtonContainer(opts);

    const layer1 = createMenuButtonLayer1(opts);
    const layer2 = createMenuButtonLayer2(opts);
    const layer3 = createMenuButtonLayer3(opts);
    const layer4 = createMenuButtonLayer4(opts);

    container.addControl(layer1);
    container.addControl(layer2);
    container.addControl(layer3);
    container.addControl(layer4);

    layer1.metadata = {};
    layer1.metadata = {
        ...layer1.metadata,
        layer2,
        layer3,
        layer4,
    };

    panel.addControl(container);

    return layer1;
};

const createButtonContainer = (opts: MenuButtonOptions = {}) => {
    const {
        text = "Button",
        width = "75px",
        height = "50px",
        top = "0px",
        left = "0px",
        vAlign = Control.VERTICAL_ALIGNMENT_CENTER,
        hAlign = Control.HORIZONTAL_ALIGNMENT_LEFT,
    } = opts;

    const container = new Rectangle("btn_" + text + "_container");

    container.width = width;
    container.height = height;

    container.thickness = 0;
    container.background = "transparent";

    container.top = top;
    container.left = left;

    container.verticalAlignment = vAlign;
    container.horizontalAlignment = hAlign;

    return container;
};

const createMenuButtonLayer1 = (opts: MenuButtonOptions = {}) => {
    const {
        text = "Button",

        width = "75px",
        height = "50px",

        radius = 0,
        thickness = 0,

        top = "0px",
        left = "0px",

        vAlign = Control.VERTICAL_ALIGNMENT_CENTER,
        hAlign = Control.HORIZONTAL_ALIGNMENT_LEFT,
    } = opts;

    const layer1 = Button.CreateSimpleButton("btn_" + text + "_layer_1", "");
    layer1.zIndex = 1;

    layer1.width = width;
    layer1.height = height;

    layer1.background = COLOR_2;

    layer1.cornerRadius = radius;
    layer1.thickness = thickness;

    layer1.top = top;
    layer1.left = left;

    layer1.verticalAlignment = vAlign;
    layer1.horizontalAlignment = hAlign;

    disablePointerAnimations(layer1);

    return layer1;
};

const createMenuButtonLayer2 = (opts: MenuButtonOptions = {}) => {
    const {
        text = "Button",

        width = "75px",
        height = "50px",

        radius = 0,
        thickness = 0,

        top = "0px",
        left = "0px",

        vAlign = Control.VERTICAL_ALIGNMENT_CENTER,
        hAlign = Control.HORIZONTAL_ALIGNMENT_LEFT,
    } = opts;

    const layer2 = Button.CreateSimpleButton("btn_" + text + "_layer_2", "");
    layer2.zIndex = 2;

    layer2.width = width;
    layer2.height = height;

    layer2.background = COLOR_1;

    layer2.cornerRadius = radius;
    layer2.thickness = thickness;

    layer2.top = top;
    layer2.left = left;
    layer2.scaleX = 0;

    layer2.verticalAlignment = vAlign;
    layer2.horizontalAlignment = hAlign;
    layer2.transformCenterX = 0;

    disablePointerAnimations(layer2);

    return layer2;
};

const createMenuButtonLayer3 = (opts: MenuButtonOptions = {}) => {
    const {
        text = "Button",

        width = "75px",
        height = "50px",

        radius = 0,
        thickness = 0,

        top = "0px",
        left = "0px",

        vAlign = Control.VERTICAL_ALIGNMENT_CENTER,
        hAlign = Control.HORIZONTAL_ALIGNMENT_LEFT,

        onClick,
    } = opts;

    const layer3 = Button.CreateSimpleButton("btn_" + text + "_layer_3", text);
    layer3.zIndex = 3;

    layer3.width = width;
    layer3.height = height;

    layer3.background = "rgba(0, 0, 0, 0)";
    layer3.color = COLOR_3;
    layer3.alpha = 0.0;

    layer3.fontSize = VERSE_FONT_SIZE;
    layer3.fontFamily = "monospace";

    layer3.cornerRadius = radius;
    layer3.thickness = thickness;

    layer3.top = top;
    layer3.left = left;

    layer3.verticalAlignment = vAlign;
    layer3.horizontalAlignment = hAlign;

    layer3.onPointerUpObservable.add(() => {
        onClick?.();
    });

    disablePointerAnimations(layer3);

    return layer3;
};

const createMenuButtonLayer4 = (opts: MenuButtonOptions = {}) => {
    const {
        text = "Button",

        width = "75px",
        height = "50px",

        radius = 0,
        thickness = 0,

        top = "0px",
        left = "0px",

        vAlign = Control.VERTICAL_ALIGNMENT_CENTER,
        hAlign = Control.HORIZONTAL_ALIGNMENT_LEFT,

        onClick,
    } = opts;

    const layer4 = Button.CreateSimpleButton("btn_" + text + "_layer_4", text);
    layer4.zIndex = 3;

    layer4.width = width;
    layer4.height = height;

    layer4.background = "rgba(0, 0, 0, 0)";
    layer4.color = COLOR_1;

    layer4.fontSize = VERSE_FONT_SIZE;
    layer4.fontFamily = "monospace";

    layer4.cornerRadius = radius;
    layer4.thickness = thickness;

    layer4.top = top;
    layer4.left = left;

    layer4.verticalAlignment = vAlign;
    layer4.horizontalAlignment = hAlign;

    layer4.onPointerUpObservable.add(() => {
        onClick?.();
    });

    disablePointerAnimations(layer4);

    return layer4;
};

// animations
export const animateButtonOpacity = (btn: Button, to: number, duration = 100) => {
    const metadata = btn.metadata;
    if (!metadata) return;

    const from = to === 1 ? 1 : 0;
    const t0 = performance.now();

    const tick = (now: number) => {
        if (!isControlAlive(btn) || !isControlAlive(metadata.layer2) || !isControlAlive(metadata.layer3) || !isControlAlive(metadata.layer4)) {
            return;
        }

        const p = Math.min((now - t0) / duration, 1);
        const v = from + (to - from) * p;

        if (metadata.layer3) metadata.layer3.alpha = v;
        if (metadata.layer4) metadata.layer4.alpha = 1 - v;

        if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
};

export const animateButtonSlide = (btn: Button, to: number, duration = 50) => {
    const metadata = btn.metadata;
    if (!metadata) return;

    const from = metadata.layer2.scaleX;
    const t0 = performance.now();

    const tick = (now: number) => {
        if (!isControlAlive(btn) || !isControlAlive(metadata.layer2)) return;

        const p = Math.min((now - t0) / duration, 1);
        const v = from + (to - from) * p;

        metadata.layer2.scaleX = v;

        if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
};
