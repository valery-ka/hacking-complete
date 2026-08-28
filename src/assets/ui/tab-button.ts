import {
    Button,
    Control,
    AdvancedDynamicTexture,
    Rectangle,
    Image,
    StackPanel,
    TextBlock,
} from "@babylonjs/gui";

import { isControlAlive } from "utils/diagnostics";

const COLOR_1 = "#49463D";
const COLOR_2 = "#A9A288";
const COLOR_3 = "#D5CCAE";

const LINE_SPACING = 7;
const LINE_HEIGHT = "3px";

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

    icons_path?: [string, string];
    topLine?: boolean;
    bottomLine?: boolean;
    selectorTexture?: boolean;

    withSilder?: boolean;
    toggleOptions?: string[];

    onClick?: () => void;
}

// General
export const disablePointerAnimations = (btn: Button) => {
    (btn as any).pointerEnterAnimation = null;
    (btn as any).pointerOutAnimation = null;
    (btn as any).pointerDownAnimation = null;
    (btn as any).pointerUpAnimation = null;
};

export const createMenuButton = (opts: MenuButtonOptions = {}, ui: AdvancedDynamicTexture) => {
    const layer1 = createMenuButtonLayer1(opts, ui);
    const layer2 = createMenuButtonLayer2(opts, ui);
    const layer3 = createMenuButtonLayer3(opts, ui);
    const layer4 = createMenuButtonLayer4(opts, ui);

    const topLineControl = createButtonTopLine(layer1, opts, ui);
    const bottomLineControl = createButtonBottomLine(layer1, opts, ui);

    const icon1 = createIcon1(layer1, opts, ui);
    const icon2 = createIcon2(layer1, opts, ui);
    const texture = createSelectorTexture(layer1, opts, ui);

    const slider = createSlider(layer1, opts, ui);
    const toggle = createToggle(layer1, opts, ui);

    layer1.metadata = {};
    layer1.metadata = {
        ...layer1.metadata,
        layer2,
        layer3,
        layer4,
        icon1,
        icon2,
        texture,
        topLineControl,
        bottomLineControl,
        slider,
        toggle,
    };

    return layer1;
};

// Styles
const createIcon1 = (btn: Button, opts: MenuButtonOptions = {}, ui: AdvancedDynamicTexture) => {
    const {
        text = "Button",
        vAlign = Control.VERTICAL_ALIGNMENT_TOP,
        hAlign = Control.VERTICAL_ALIGNMENT_CENTER,
        icons_path = null,
    } = opts;

    if (!icons_path?.[0]) return null;

    const x = btn.leftInPixels - btn.widthInPixels / 2 + 24;
    const y = btn.topInPixels + 10;

    const icon1 = new Image(text + "_icon1", icons_path[0]);
    icon1.isHitTestVisible = false;
    icon1.width = "30px";
    icon1.height = "30px";

    if (vAlign === Control.VERTICAL_ALIGNMENT_TOP) {
        icon1.top = y;
    } else {
        icon1.top = y - 10;
    }

    icon1.verticalAlignment = vAlign;

    if (hAlign === Control.VERTICAL_ALIGNMENT_CENTER) {
        icon1.left = x;
    } else {
        icon1.left = 190;
    }

    icon1.horizontalAlignment = hAlign;

    icon1.zIndex = 5;

    ui.addControl(icon1);
    return icon1;
};

const createIcon2 = (btn: Button, opts: MenuButtonOptions = {}, ui: AdvancedDynamicTexture) => {
    const {
        text = "Button",
        vAlign = Control.VERTICAL_ALIGNMENT_TOP,
        hAlign = Control.VERTICAL_ALIGNMENT_CENTER,
        icons_path = null,
    } = opts;

    if (!icons_path?.[1]) return null;

    const x = btn.leftInPixels - btn.widthInPixels / 2 + 24;
    const y = btn.topInPixels + 10;

    const icon2 = new Image(text + "_icon2", icons_path[1]);
    icon2.isHitTestVisible = false;
    icon2.width = "30px";
    icon2.height = "30px";

    if (vAlign === Control.VERTICAL_ALIGNMENT_TOP) {
        icon2.top = y;
    } else {
        icon2.top = y - 10;
    }

    icon2.verticalAlignment = vAlign;

    if (hAlign === Control.VERTICAL_ALIGNMENT_CENTER) {
        icon2.left = x;
    } else {
        icon2.left = 190;
    }

    icon2.horizontalAlignment = hAlign;

    icon2.zIndex = 6;
    icon2.alpha = 0;

    ui.addControl(icon2);
    return icon2;
};

const createMenuButtonLayer1 = (opts: MenuButtonOptions = {}, ui: AdvancedDynamicTexture) => {
    const {
        text = "Button",

        width = "200px",
        height = "50px",

        radius = 0,
        thickness = 0,

        top = "0px",
        left = "0px",

        vAlign = Control.VERTICAL_ALIGNMENT_TOP,
        hAlign = Control.HORIZONTAL_ALIGNMENT_CENTER,
    } = opts;

    const layer1 = Button.CreateSimpleButton(text + "_layer_1", "");
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

    ui.addControl(layer1);

    return layer1;
};

const createMenuButtonLayer2 = (opts: MenuButtonOptions = {}, ui: AdvancedDynamicTexture) => {
    const {
        text = "Button",

        width = "200px",
        height = "50px",

        radius = 0,
        thickness = 0,

        top = "0px",
        left = "0px",

        vAlign = Control.VERTICAL_ALIGNMENT_TOP,
        hAlign = Control.HORIZONTAL_ALIGNMENT_CENTER,
    } = opts;

    const layer2 = Button.CreateSimpleButton(text + "_layer_2", "");
    layer2.zIndex = 2;

    layer2.width = width;
    layer2.height = height;

    layer2.background = COLOR_1;

    layer2.cornerRadius = radius;
    layer2.thickness = thickness;

    layer2.top = top;
    layer2.left = left;

    layer2.verticalAlignment = vAlign;
    layer2.horizontalAlignment = hAlign;

    layer2.transformCenterX = 0;
    layer2.scaleX = 0;

    disablePointerAnimations(layer2);

    ui.addControl(layer2);

    return layer2;
};

const createMenuButtonLayer3 = (opts: MenuButtonOptions = {}, ui: AdvancedDynamicTexture) => {
    const {
        text = "Button",
        fontSize = "23px",

        width = "200px",
        height = "50px",

        radius = 0,
        thickness = 0,

        top = "0px",
        left = "0px",

        vAlign = Control.VERTICAL_ALIGNMENT_TOP,
        hAlign = Control.HORIZONTAL_ALIGNMENT_CENTER,

        onClick,
    } = opts;

    const layer3 = Button.CreateSimpleButton(text + "_layer_3", text);
    layer3.fontSize = fontSize;
    layer3.zIndex = 3;

    layer3.width = width;
    layer3.height = height;

    layer3.background = "rgba(0, 0, 0, 0)";
    layer3.color = COLOR_3;

    layer3.cornerRadius = radius;
    layer3.thickness = thickness;

    layer3.top = top;
    layer3.left = left;

    layer3.verticalAlignment = vAlign;
    layer3.horizontalAlignment = hAlign;

    layer3.alpha = 0.0;

    if (layer3.textBlock) {
        layer3.textBlock.left = "47px";
        layer3.textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    }

    layer3.onPointerUpObservable.add(() => {
        onClick?.();
    });

    disablePointerAnimations(layer3);

    ui.addControl(layer3);

    return layer3;
};

const createMenuButtonLayer4 = (opts: MenuButtonOptions = {}, ui: AdvancedDynamicTexture) => {
    const {
        text = "Button",
        fontSize = "23px",

        width = "200px",
        height = "50px",

        radius = 0,
        thickness = 0,

        top = "0px",
        left = "0px",

        vAlign = Control.VERTICAL_ALIGNMENT_TOP,
        hAlign = Control.HORIZONTAL_ALIGNMENT_CENTER,

        onClick,
    } = opts;

    const layer4 = Button.CreateSimpleButton(text + "_layer_4", text);
    layer4.fontSize = fontSize;
    layer4.zIndex = 4;

    layer4.width = width;
    layer4.height = height;

    layer4.background = "rgba(0, 0, 0, 0)";
    layer4.color = COLOR_1;
    layer4.alpha = 0.0;

    layer4.cornerRadius = radius;
    layer4.thickness = thickness;

    layer4.top = top;
    layer4.left = left;

    layer4.verticalAlignment = vAlign;
    layer4.horizontalAlignment = hAlign;

    if (layer4.textBlock) {
        layer4.textBlock.left = "47px";
        layer4.textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    }

    layer4.onPointerUpObservable.add(() => {
        onClick?.();
    });

    disablePointerAnimations(layer4);

    ui.addControl(layer4);

    return layer4;
};

const createSelectorTexture = (
    btn: Button,
    opts: MenuButtonOptions = {},
    ui: AdvancedDynamicTexture,
) => {
    const {
        text = "Button",
        vAlign = Control.VERTICAL_ALIGNMENT_TOP,
        hAlign = Control.HORIZONTAL_ALIGNMENT_CENTER,
        selectorTexture = false,
    } = opts;

    if (!selectorTexture) {
        return null;
    }

    const x = btn.leftInPixels - btn.widthInPixels / 2 - 30;
    const y = btn.topInPixels + 3;

    const tex = new Image(text + "_selector", "textures/ui/selector.png");
    tex.isHitTestVisible = false;
    tex.width = "44px";
    tex.height = "44px";
    tex.top = y;
    tex.verticalAlignment = vAlign;

    tex.alpha = 0.0;

    if (hAlign === Control.VERTICAL_ALIGNMENT_CENTER) {
        tex.left = x;
    } else {
        tex.left = 40;
    }

    tex.horizontalAlignment = hAlign;

    ui.addControl(tex);
    return tex;
};

const createButtonTopLine = (
    btn: Button,
    opts: MenuButtonOptions = {},
    ui: AdvancedDynamicTexture,
) => {
    const {
        text = "Button",
        width = "200px",

        vAlign = Control.VERTICAL_ALIGNMENT_TOP,
        hAlign = Control.HORIZONTAL_ALIGNMENT_CENTER,

        topLine = false,
    } = opts;
    let topLineControl: Rectangle | null = null;

    if (topLine) {
        topLineControl = new Rectangle();
        topLineControl.name = text + "_top_line";
        topLineControl.background = COLOR_1;
        topLineControl.thickness = 0;
        topLineControl.width = width;
        topLineControl.height = LINE_HEIGHT;

        topLineControl.top = btn.topInPixels - LINE_SPACING;
        topLineControl.left = btn.leftInPixels;

        topLineControl.verticalAlignment = vAlign;
        topLineControl.horizontalAlignment = hAlign;

        topLineControl.alpha = 0.0;

        topLineControl.metadata = {};
        topLineControl.metadata.baseTopLine = btn.topInPixels - LINE_SPACING;

        ui.addControl(topLineControl);
    }

    return topLineControl;
};

const createButtonBottomLine = (
    btn: Button,
    opts: MenuButtonOptions = {},
    ui: AdvancedDynamicTexture,
) => {
    const {
        text = "Button",
        width = "200px",

        vAlign = Control.VERTICAL_ALIGNMENT_TOP,
        hAlign = Control.HORIZONTAL_ALIGNMENT_CENTER,

        topLine = false,
    } = opts;
    let bottomLineControl: Rectangle | null = null;

    if (topLine) {
        bottomLineControl = new Rectangle();
        bottomLineControl.name = text + "_bottom_line";
        bottomLineControl.background = COLOR_1;
        bottomLineControl.thickness = 0;
        bottomLineControl.width = width;
        bottomLineControl.height = LINE_HEIGHT;

        bottomLineControl.top = btn.topInPixels + btn.heightInPixels - 3 + LINE_SPACING;
        bottomLineControl.left = btn.leftInPixels;

        bottomLineControl.verticalAlignment = vAlign;
        bottomLineControl.horizontalAlignment = hAlign;

        bottomLineControl.alpha = 0.0;

        bottomLineControl.metadata = {};
        bottomLineControl.metadata.baseBottomLine =
            btn.topInPixels + btn.heightInPixels - 3 + LINE_SPACING;

        ui.addControl(bottomLineControl);
    }

    return bottomLineControl;
};

const createSlider = (btn: Button, opts: MenuButtonOptions = {}, ui: AdvancedDynamicTexture) => {
    const { text = "Button", vAlign = Control.VERTICAL_ALIGNMENT_TOP, withSilder = false } = opts;

    let sliderContainer: StackPanel | null = null;

    if (withSilder) {
        const containerWidth = 100;
        const y = btn.topInPixels + 4;

        sliderContainer = new StackPanel();
        sliderContainer.name = text + "_slider";
        sliderContainer.isVertical = false;
        sliderContainer.isHitTestVisible = false;

        sliderContainer.top = y;
        sliderContainer.verticalAlignment = vAlign;
        sliderContainer.height = "42px";
        sliderContainer.left = "250px";
        sliderContainer.width = `${containerWidth}px`;
        sliderContainer.zIndex = 5;

        ui.addControl(sliderContainer);

        const count = 10;
        const rectWidth = containerWidth / (2 * count);
        const rectHeight = "55%";

        const bars: Rectangle[] = [];

        for (let i = 0; i < count; i++) {
            const stepContainer = new Rectangle();
            stepContainer.width = rectWidth + "px";
            stepContainer.height = "100%";
            stepContainer.thickness = 0;
            stepContainer.background = "transparent";
            stepContainer.isHitTestVisible = false;

            sliderContainer.addControl(stepContainer);

            const bar = new Rectangle();
            bar.width = "100%";
            bar.height = rectHeight;
            bar.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
            bar.thickness = 0;
            bar.background = COLOR_3;
            bar.isHitTestVisible = false;

            bar.metadata = {};
            bar.metadata.active_height = "55%";
            bar.metadata.inactive_height = "10%";

            stepContainer.addControl(bar);

            if (i === count - 1) {
                const topHelper = new Rectangle();
                topHelper.width = "100%";
                topHelper.height = "3px";
                topHelper.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
                topHelper.thickness = 0;
                topHelper.background = COLOR_3;
                topHelper.isHitTestVisible = false;

                const bottomHelper = new Rectangle();
                bottomHelper.width = "100%";
                bottomHelper.height = "3px";
                bottomHelper.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
                bottomHelper.thickness = 0;
                bottomHelper.background = COLOR_3;
                bottomHelper.isHitTestVisible = false;

                stepContainer.addControl(topHelper);
                stepContainer.addControl(bottomHelper);
            }

            if (i < count - 1) {
                const gap = new Rectangle();
                gap.width = rectWidth + "px";
                gap.height = "100%";
                gap.thickness = 0;
                gap.background = "transparent";
                gap.isHitTestVisible = false;

                sliderContainer.addControl(gap);
            }

            bars.push(bar);
        }

        sliderContainer.metadata = { bars, value: 0, max: count - 1 };
    }

    return sliderContainer;
};

const createToggle = (btn: Button, opts: MenuButtonOptions = {}, ui: AdvancedDynamicTexture) => {
    const { text = "Button", vAlign = Control.VERTICAL_ALIGNMENT_TOP, toggleOptions = null } = opts;

    let toggleContainer: Rectangle | null = null;

    if (toggleOptions) {
        const containerWidth = 120;
        const y = btn.topInPixels + 4;

        toggleContainer = new Rectangle();
        toggleContainer.name = text + "_toggle";
        toggleContainer.isHitTestVisible = false;

        toggleContainer.top = y;
        toggleContainer.verticalAlignment = vAlign;
        toggleContainer.height = "42px";
        toggleContainer.left = "250px";
        toggleContainer.width = `${containerWidth}px`;
        toggleContainer.zIndex = 5;
        toggleContainer.thickness = 0;

        ui.addControl(toggleContainer);

        const textBlock = new TextBlock("toggle_text", toggleOptions[0]);
        textBlock.isHitTestVisible = false;
        textBlock.fontSize = "23px";
        textBlock.color = COLOR_3;
        toggleContainer.addControl(textBlock);

        const topHelper1 = new Rectangle();
        topHelper1.width = "5px";
        topHelper1.height = "3px";
        topHelper1.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        topHelper1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        topHelper1.thickness = 0;
        topHelper1.background = COLOR_3;
        topHelper1.isHitTestVisible = false;

        const centerHelper1 = new Rectangle();
        centerHelper1.width = "5px";
        centerHelper1.height = "55%";
        centerHelper1.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        centerHelper1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        centerHelper1.thickness = 0;
        centerHelper1.background = COLOR_3;
        centerHelper1.isHitTestVisible = false;

        const bottomHelper1 = new Rectangle();
        bottomHelper1.width = "5px";
        bottomHelper1.height = "3px";
        bottomHelper1.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        bottomHelper1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        bottomHelper1.thickness = 0;
        bottomHelper1.background = COLOR_3;
        bottomHelper1.isHitTestVisible = false;

        toggleContainer.addControl(topHelper1);
        toggleContainer.addControl(centerHelper1);
        toggleContainer.addControl(bottomHelper1);

        const topHelper2 = new Rectangle();
        topHelper2.width = "5px";
        topHelper2.height = "3px";
        topHelper2.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        topHelper2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        topHelper2.thickness = 0;
        topHelper2.background = COLOR_3;
        topHelper2.isHitTestVisible = false;

        const centerHelper2 = new Rectangle();
        centerHelper2.width = "5px";
        centerHelper2.height = "55%";
        centerHelper2.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        centerHelper2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        centerHelper2.thickness = 0;
        centerHelper2.background = COLOR_3;
        centerHelper2.isHitTestVisible = false;

        const bottomHelper2 = new Rectangle();
        bottomHelper2.width = "5px";
        bottomHelper2.height = "3px";
        bottomHelper2.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        bottomHelper2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        bottomHelper2.thickness = 0;
        bottomHelper2.background = COLOR_3;
        bottomHelper2.isHitTestVisible = false;

        toggleContainer.addControl(topHelper2);
        toggleContainer.addControl(centerHelper2);
        toggleContainer.addControl(bottomHelper2);

        toggleContainer.metadata = {
            value: toggleOptions[0],
            values: toggleOptions,
            text: textBlock,
        };
    }

    return toggleContainer;
};

// Animations
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

export const animateButtonOpacity = (btn: Button, to: number, duration = 100) => {
    const metadata = btn.metadata;
    if (!metadata) return;

    const from = metadata.texture.alpha;
    const t0 = performance.now();

    const tick = (now: number) => {
        if (!isControlAlive(btn)) return;

        const p = Math.min((now - t0) / duration, 1);
        const v = from + (to - from) * p;

        if (metadata.layer3) metadata.layer3.alpha = v;
        if (metadata.layer4) metadata.layer4.alpha = 1 - v;

        if (metadata.topLineControl) metadata.topLineControl.alpha = v;
        if (metadata.bottomLineControl) metadata.bottomLineControl.alpha = v;
        if (metadata.icon1) metadata.icon1.alpha = 1 - v;
        if (metadata.icon2) metadata.icon2.alpha = v;
        if (metadata.texture) metadata.texture.alpha = v;

        if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
};

export const animateButtonLinesOffset = (btn: Button, to: number, duration = 50) => {
    const metadata = btn.metadata;
    if (!metadata) return;

    const MAX_OFFSET = 5;

    const from = metadata.topLineControl.alpha;
    const t0 = performance.now();

    const tick = (now: number) => {
        if (!isControlAlive(btn)) return;

        const p = Math.min((now - t0) / duration, 1);
        const v = from + (to - from) * p;

        const offset = (1 - v) * MAX_OFFSET;

        if (metadata.topLineControl) {
            metadata.topLineControl.alpha = v;
            metadata.topLineControl.top = metadata.topLineControl.metadata.baseTopLine + offset;
        }

        if (metadata.bottomLineControl) {
            metadata.bottomLineControl.alpha = v;
            metadata.bottomLineControl.top =
                metadata.bottomLineControl.metadata.baseBottomLine - offset;
        }

        if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
};

export const animateFromLeft = (control: Control, from: number, to: number, duration = 300) => {
    const startLeft = from;
    const targetLeft = to;
    const startTime = performance.now();

    const animate = () => {
        if (!isControlAlive(control)) return;

        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        const general = startLeft * (1 - t) + targetLeft * t;

        control.left = general;
        if (control.metadata.layer2) control.metadata.layer2.left = general;
        if (control.metadata.layer3) control.metadata.layer3.left = general;
        if (control.metadata.layer4) control.metadata.layer4.left = general;

        if (control.metadata.icon1) control.metadata.icon1.left = general + 10;
        if (control.metadata.icon2) control.metadata.icon2.left = general + 10;

        if (t < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
};
