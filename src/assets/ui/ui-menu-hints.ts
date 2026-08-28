import { Control, Image, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui";

const COLOR_1 = "#49463D";

export const createSideLines = (ui: StackPanel, height?: number) => {
    const createLine = (name: string, width: number, visible: boolean) => {
        const line = new Rectangle(name);

        line.thickness = 0;
        line.width = `${width}px`;
        line.background = visible ? COLOR_1 : "transparent";

        line.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

        line.height = `${height}px`;

        ui.addControl(line);
        return line;
    };

    const line1 = createLine("big-side-line", 14, true);
    const line2 = createLine("transparent-line", 7, false);
    const line3 = createLine("small-side-line", 4, true);

    return [line1, line2, line3];
};

export const createRectangle = (ui: Rectangle) => {
    const rect = new Rectangle("decoration-rect-hints");

    rect.width = "18px";
    rect.height = "18px";

    rect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rect.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

    rect.left = "-10px";
    rect.top = "-5x";

    rect.background = COLOR_1;
    rect.thickness = 0;

    ui.addControl(rect);
};

export type TIconSeparator = "plus" | "gap";

export type TControlHint = {
    id: string;
    icon: string | string[];
    text: string;
    /** `plus` inserts "+" between icons; `gap` uses only stack spacing */
    iconSeparator?: TIconSeparator;
};

const normalizeIcons = (icon: string | string[]): string[] =>
    Array.isArray(icon) ? icon : [icon];

export const createControlHint = (hint: TControlHint, spacing: number = 0) => {
    const controls = new StackPanel(`ui-hints-controls-${hint.id}`);
    controls.isVertical = false;
    controls.spacing = spacing;
    controls.adaptWidthToChildren = true;
    controls.height = "50px";

    const icons = normalizeIcons(hint.icon);
    const separator = hint.iconSeparator ?? "gap";

    icons.forEach((iconPath, index) => {
        const icon = new Image(`${hint.id}_icon_${index}`, iconPath);
        icon.width = "32px";
        icon.height = "32px";
        icon.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

        controls.addControl(icon);

        if (separator === "plus" && index < icons.length - 1) {
            const plusSign = new TextBlock(`${hint.id}_plus_${index}`, "+");
            plusSign.width = "14px";
            plusSign.height = "20px";
            plusSign.color = COLOR_1;
            plusSign.fontSize = 22;
            plusSign.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

            controls.addControl(plusSign);
        }
    });

    const text = new TextBlock(`${hint.id}_text`, hint.text);
    text.resizeToFit = true;
    text.paddingLeft = "8px";
    text.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    text.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    text.fontSize = 28;
    text.fontFamily = "Trebuchet MS";
    text.color = "#49463D";

    controls.addControl(text);

    return controls;
};
