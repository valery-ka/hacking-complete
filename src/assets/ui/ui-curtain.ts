import { AdvancedDynamicTexture, Rectangle, Ellipse, Control } from "@babylonjs/gui";

const COLOR_1 = "#49463D";
const COLOR_2 = "#c4bda3";
const Z_INDEX = 1000;

const bottomCorrection = (verticalAlignment: number) => {
    return verticalAlignment === 1 ? 2 : 0;
};

export const createCurtain = (
    ui: AdvancedDynamicTexture,
    baseOffset: number,
    verticalAlignment: number,
) => {
    const line1 = createCurtainMainLine(ui, baseOffset, verticalAlignment);

    createCurtainRectangles(ui, baseOffset, verticalAlignment);

    createCurtainCirclesLeft(ui, baseOffset, verticalAlignment);
    createCurtainCirclesCenter(ui, baseOffset, verticalAlignment);
    createCurtainCirclesRight(ui, baseOffset, verticalAlignment);

    createCurtainAnimationRectangle(ui, baseOffset, verticalAlignment);

    return line1;
};

const createCurtainMainLine = (
    ui: AdvancedDynamicTexture,
    baseOffset: number,
    verticalAlignment: number,
) => {
    const line = new Rectangle("curtain_main_line");
    line.verticalAlignment = verticalAlignment;

    line.left = 0;
    line.top = baseOffset;

    line.width = "100%";
    line.height = "3px";

    line.cornerRadius = 0;
    line.thickness = 0;

    line.background = COLOR_1;
    line.zIndex = Z_INDEX;

    ui.addControl(line);

    return line;
};

const createCurtainRectangles = (
    ui: AdvancedDynamicTexture,
    baseOffset: number,
    verticalAlignment: number,
    count = 26,
) => {
    for (let i = 0; i < count; i++) {
        if (i == 0) continue;
        const rect = new Rectangle(`curtain_rectangle_${i}`);

        rect.verticalAlignment = verticalAlignment;
        rect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        rect.top = baseOffset + 2 + bottomCorrection(verticalAlignment);

        const w = 100 / count;

        rect.width = "12px";
        rect.height = "5px";

        rect.left = `${i * w}%`;

        rect.thickness = 0;
        rect.background = COLOR_1;

        rect.zIndex = Z_INDEX;

        ui.addControl(rect);
    }
};

const createCurtainCirclesLeft = (
    ui: AdvancedDynamicTexture,
    baseOffset: number,
    verticalAlignment: number,
    count = 26,
) => {
    for (let i = 0; i < count; i++) {
        if (i == 0 || i == count - 1) continue;

        const circle = new Ellipse(`curtain_circles_${i}`);

        circle.verticalAlignment = verticalAlignment;
        circle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        circle.top = baseOffset + 10 + bottomCorrection(verticalAlignment);

        const w = 100 / count;

        circle.width = "7px";
        circle.height = "7px";

        const centerX = (i + 0.5) * w;
        circle.left = `${centerX - 0.4}%`;

        circle.thickness = 0;
        circle.background = COLOR_1;

        circle.zIndex = Z_INDEX;

        ui.addControl(circle);
    }
};

const createCurtainCirclesCenter = (
    ui: AdvancedDynamicTexture,
    baseOffset: number,
    verticalAlignment: number,
    count = 26,
) => {
    for (let i = 0; i < count; i++) {
        if (i == 0 || i == count - 1) continue;

        const circle = new Ellipse(`curtain_circles_${i}`);

        circle.verticalAlignment = verticalAlignment;
        circle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        circle.top = baseOffset + 25 + bottomCorrection(verticalAlignment);

        const w = 100 / count;

        circle.width = "7px";
        circle.height = "7px";

        const centerX = (i + 0.5) * w;
        circle.left = `${centerX}%`;

        circle.thickness = 0;
        circle.background = COLOR_1;

        circle.zIndex = Z_INDEX;

        ui.addControl(circle);
    }
};

const createCurtainCirclesRight = (
    ui: AdvancedDynamicTexture,
    baseOffset: number,
    verticalAlignment: number,
    count = 26,
) => {
    for (let i = 0; i < count; i++) {
        if (i == 0 || i == count - 1) continue;

        const circle = new Ellipse(`curtain_circles_${i}`);

        circle.verticalAlignment = verticalAlignment;
        circle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        circle.top = baseOffset + 10 + bottomCorrection(verticalAlignment);

        const w = 100 / count;

        circle.width = "7px";
        circle.height = "7px";

        const centerX = (i + 0.5) * w;
        circle.left = `${centerX + 0.4}%`;

        circle.thickness = 0;
        circle.background = COLOR_1;

        circle.zIndex = Z_INDEX;

        ui.addControl(circle);
    }
};

const createCurtainAnimationRectangle = (
    ui: AdvancedDynamicTexture,
    baseOffset: number,
    verticalAlignment: number,
) => {
    const rect = new Rectangle(`0_curtain_rectangle_animation`);
    const isTop = verticalAlignment === Control.VERTICAL_ALIGNMENT_TOP;

    rect.verticalAlignment = verticalAlignment;
    rect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    rect.transformCenterX = isTop ? 0 : 1;

    rect.left = 0;
    rect.top = baseOffset + (isTop ? 0 : 37);

    rect.width = "100%";
    rect.height = "40px";

    rect.cornerRadius = 0;
    rect.thickness = 0;

    rect.background = COLOR_2;
    rect.zIndex = Z_INDEX + 1;

    ui.addControl(rect);

    animateScaleX(rect);
};

export const animateScaleX = (control: Control, duration = 500) => {
    const startScaleX = 1;
    const targetScaleX = 0;
    const startTime = performance.now();

    const animate = () => {
        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        control.scaleX = startScaleX * (1 - t) + targetScaleX * t * t * t;

        if (t < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
};
