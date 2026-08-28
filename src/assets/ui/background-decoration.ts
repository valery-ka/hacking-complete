import { AdvancedDynamicTexture, Ellipse, Rectangle, Control } from "@babylonjs/gui";

const COLOR_1 = "#49463D";
const ALPHA = 0.15;

type WiggleOptions = {
    maxDelta?: number;
    speed?: number;
};

export const animateWiggle = (
    control: Control,
    { maxDelta = 5, speed = 0.001 }: WiggleOptions = {},
) => {
    const baseLeft = parseFloat((control.left as string) || "0");
    const baseTop = parseFloat((control.top as string) || "0");

    let phaseX = Math.random() * Math.PI * 2;
    let phaseY = Math.random() * Math.PI * 2;

    const freqX = 0.8 + Math.random() * 0.4;
    const freqY = 0.8 + Math.random() * 0.4;

    const startTime = performance.now();

    let targetPhaseX = phaseX;
    let targetPhaseY = phaseY;
    const phaseLerp = 0.002;
    const phaseChangeInterval = 1000;

    const randomizePhaseTarget = () => {
        targetPhaseX = Math.random() * Math.PI * 2;
        targetPhaseY = Math.random() * Math.PI * 2;
    };
    const intervalId = setInterval(randomizePhaseTarget, phaseChangeInterval);

    const observer = control.onBeforeDrawObservable.add(() => {
        const t = (performance.now() - startTime) * speed;

        phaseX += (targetPhaseX - phaseX) * phaseLerp;
        phaseY += (targetPhaseY - phaseY) * phaseLerp;

        const x = Math.sin(t * freqX + phaseX) * maxDelta;
        const y = Math.cos(t * freqY + phaseY) * maxDelta;

        control.left = `${baseLeft + x}px`;
        control.top = `${baseTop + y}px`;
    });

    return () => {
        clearInterval(intervalId);
        control.onBeforeDrawObservable.remove(observer);
    };
};

export const createBgCircles = (
    ui: AdvancedDynamicTexture,
    diameterMain: number,
    vAlign: number,
    hAlign: number,
    direction: 1 | -1, // 1 — bottom, -1 — top
    divideBy: number = 2,
) => {
    const createCircle = (name: string, diameter: number) => {
        const circle = new Ellipse(name);

        circle.width = `${diameter}px`;
        circle.height = `${diameter}px`;

        circle.top = `${(diameter / divideBy) * direction}px`;
        circle.left = `${(diameter / divideBy) * direction}px`;

        circle.color = COLOR_1;
        circle.thickness = 2;
        circle.alpha = ALPHA;

        circle.verticalAlignment = vAlign;
        circle.horizontalAlignment = hAlign;

        ui.addControl(circle);
        return circle;
    };

    const circle1 = createCircle("bg-circle-main", diameterMain);
    const circle2 = createCircle("bg-circle-sub", diameterMain - 50);

    return [circle1, circle2];
};

export const createBgLines = (
    ui: AdvancedDynamicTexture,
    vAlign: number,
    hAlign: number,
    transformCenter: 0 | 1, // 0 — top, 1 — bottom
) => {
    const createLine = (name: string, width: number, centerOffset: number) => {
        const line = new Rectangle(name);

        line.thickness = 0;
        line.background = COLOR_1;
        line.alpha = ALPHA;

        line.width = `${width}px`;
        line.height = "2px";

        line.rotation = Math.PI / 4;
        line.transformCenterX = transformCenter + centerOffset;
        line.transformCenterY = transformCenter + centerOffset;

        line.verticalAlignment = vAlign;
        line.horizontalAlignment = hAlign;

        ui.addControl(line);
        return line;
    };

    const line1 = createLine("bg-line-1", 1500, 0);
    const line2 = createLine("bg-line-2", 1400, -0.1);
    const line3 = createLine("bg-line-3", 1200, 0.1);

    return [line1, line2, line3];
};
