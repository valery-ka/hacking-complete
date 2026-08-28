import { AdvancedDynamicTexture, Control, Rectangle, StackPanel } from "@babylonjs/gui";

const COLOR_1 = "#A9A288";

export const createSideMenuTabs = (ui: AdvancedDynamicTexture, top: number) => {
    const createLine = (name: string, width: number, left: number) => {
        const line = new Rectangle(name);

        line.thickness = 0;
        line.background = COLOR_1;

        line.left = `${left}px`;
        line.width = `${width}px`;
        line.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        line.top = `${top}px`;
        line.height = "55px";
        line.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

        ui.addControl(line);
        return line;
    };

    const line1 = createLine("big-side-line", 14, 90);
    const line2 = createLine("small-side-line", 4, 111);

    return [line1, line2];
};

export const createSideLineVersesTab = (
    ui: AdvancedDynamicTexture | StackPanel,
    height?: number,
) => {
    const createLine = (name: string, width: number, visible: boolean) => {
        const line = new Rectangle(name);

        line.thickness = 0;
        line.width = `${width}px`;
        line.background = visible ? COLOR_1 : "transparent";

        line.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        line.scaleY = 0;

        line.height = `${height}px`;

        ui.addControl(line);
        return line;
    };

    const line1 = createLine("big-side-line", 14, true);
    const line2 = createLine("transparent-line", 7, false);
    const line3 = createLine("small-side-line", 4, true);

    scaleYInAnimation(line1);
    scaleYInAnimation(line2);
    scaleYInAnimation(line3);

    return [line1, line2, line3];
};

export const scaleYInAnimation = (line: Rectangle, duration = 200) => {
    const startY = 0;
    const targetY = 1;
    const startTime = performance.now();

    const easeInCubic = (t: number) => t * t * t;

    const animate = () => {
        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        const easedT = easeInCubic(t);

        line.scaleY = startY * (1 - easedT) + targetY * easedT;

        if (t < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
};
