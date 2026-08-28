import { Control, Image, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui";

export type TIconSeparator = "plus" | "gap";

export type TControlHint = {
    id: string;
    icon: string[];
    text: string;
    /** `plus` inserts "+" between icons; `gap` uses only stack spacing */
    iconSeparator?: TIconSeparator;
};

const COLOR_1 = "#49463D";
const COLOR_2 = "#D5CCAC";
const COLOR_3 = "#A9A288";

const LETTER = {
    w: "textures/ui/new/letter-w.png",
    a: "textures/ui/new/letter-a.png",
    s: "textures/ui/new/letter-s.png",
    d: "textures/ui/new/letter-d.png",
    q: "textures/ui/new/letter-q.png",
    e: "textures/ui/new/letter-e.png",
} as const;

export const createControlsHint = (hint: TControlHint, spacing: number = 0) => {
    const controls = new StackPanel(`ui-hints-controls-${hint.id}`);
    controls.isVertical = false;
    controls.spacing = spacing;
    controls.width = "85%";
    controls.height = "48px";
    controls.background = COLOR_3;

    const separator = hint.iconSeparator ?? "plus";

    // Avoid paddingLeft on the backgrounded StackPanel — it clips the fill.
    // Spacer keeps left inset without shrinking the background.
    const leftSpacer = new Rectangle(`${hint.id}_left_spacer`);
    leftSpacer.width = "10px";
    leftSpacer.height = "1px";
    leftSpacer.thickness = 0;
    leftSpacer.isHitTestVisible = false;
    controls.addControl(leftSpacer);

    hint.icon.forEach((iconPath, index) => {
        const icon = new Image(`${hint.id}_icon_${index}`, iconPath);
        icon.width = "40px";
        icon.height = "40px";
        icon.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

        controls.addControl(icon);
        if (separator === "plus" && index < hint.icon.length - 1) {
            const plusSign = new TextBlock(`${hint.id}_plus_${index}`, "+");
            plusSign.width = "10px";
            plusSign.height = "10px";
            plusSign.color = COLOR_1;
            plusSign.fontSize = 22;

            controls.addControl(plusSign);
        }
    });

    const text = new TextBlock(`${hint.id}_text`, hint.text);
    text.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    text.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    text.fontSize = 22;
    text.fontFamily = "Trebuchet MS";
    text.color = COLOR_1;

    controls.addControl(text);

    return controls;
};

export type TControlsProfile = {
    gamepad: TControlHint[];
    keyboard: TControlHint[];
};

const controlsProfile1: TControlsProfile = {
    gamepad: [
        {
            id: "move",
            icon: ["textures/ui/left_stick.png"],
            text: ":  Move",
        },
        {
            id: "aim",
            icon: ["textures/ui/right_stick.png"],
            text: ":  Aim",
        },
        {
            id: "shoot",
            icon: ["textures/ui/lb_button.png"],
            text: ":  Shoot",
        },
        {
            id: "pause",
            icon: ["textures/ui/start_button.png"],
            text: ":  Pause",
        },
        {
            id: "self-destruct",
            icon: ["textures/ui/left_stick_pressed.png", "textures/ui/right_stick_pressed.png"],
            text: ":  Self-destruct",
            iconSeparator: "plus",
        },
    ],
    keyboard: [
        {
            id: "move",
            icon: [LETTER.w, LETTER.a, LETTER.s, LETTER.d],
            text: ":  Move",
            iconSeparator: "gap",
        },
        {
            id: "aim",
            icon: ["textures/ui/mouse.png"],
            text: ":  Aim",
        },
        {
            id: "shoot",
            icon: ["textures/ui/left_mouse_button.png"],
            text: ":  Shoot",
        },
        {
            id: "pause",
            icon: ["textures/ui/new/escape.png"],
            text: ":  Pause",
        },
        {
            id: "self-destruct",
            icon: [LETTER.q, LETTER.e],
            text: ":  Self-destruct",
            iconSeparator: "plus",
        },
    ],
};

const controlsProfile2: TControlsProfile = {
    gamepad: [
        {
            id: "move",
            icon: ["textures/ui/left_stick.png"],
            text: ":  Move",
        },
        {
            id: "aim",
            icon: ["textures/ui/right_stick.png"],
            text: ":  Aim",
        },
        {
            id: "shoot",
            icon: ["textures/ui/rb_button.png"],
            text: ":  Shoot",
        },
        {
            id: "pause",
            icon: ["textures/ui/start_button.png"],
            text: ":  Pause",
        },
        {
            id: "self-destruct",
            icon: ["textures/ui/left_stick_pressed.png", "textures/ui/right_stick_pressed.png"],
            text: ":  Self-destruct",
            iconSeparator: "plus",
        },
    ],
    keyboard: [
        {
            id: "move",
            icon: [LETTER.w, LETTER.a, LETTER.s, LETTER.d],
            text: ":  Move",
            iconSeparator: "gap",
        },
        {
            id: "aim",
            icon: ["textures/ui/mouse.png"],
            text: ":  Aim",
        },
        {
            id: "shoot",
            icon: ["textures/ui/right_mouse_button.png"],
            text: ":  Shoot",
        },
        {
            id: "pause",
            icon: ["textures/ui/new/escape.png"],
            text: ":  Pause",
        },
        {
            id: "self-destruct",
            icon: [LETTER.q, LETTER.e],
            text: ":  Self-destruct",
            iconSeparator: "plus",
        },
    ],
};

const controlsProfile3: TControlsProfile = {
    gamepad: [
        {
            id: "move",
            icon: ["textures/ui/left_stick.png"],
            text: ":  Move",
        },
        {
            id: "shoot",
            icon: ["textures/ui/lb_button.png"],
            text: ":  Shoot",
        },
        {
            id: "pause",
            icon: ["textures/ui/start_button.png"],
            text: ":  Pause",
        },
        {
            id: "self-destruct",
            icon: ["textures/ui/left_stick_pressed.png", "textures/ui/right_stick_pressed.png"],
            text: ":  Self-destruct",
            iconSeparator: "plus",
        },
    ],
    keyboard: [
        {
            id: "move",
            icon: [LETTER.w, LETTER.a, LETTER.s, LETTER.d],
            text: ":  Move",
            iconSeparator: "gap",
        },
        {
            id: "shoot",
            icon: ["textures/ui/left_mouse_button.png"],
            text: ":  Shoot",
        },
        {
            id: "pause",
            icon: ["textures/ui/new/escape.png"],
            text: ":  Pause",
        },
        {
            id: "self-destruct",
            icon: [LETTER.q, LETTER.e],
            text: ":  Self-destruct",
            iconSeparator: "plus",
        },
    ],
};

export const DEFAULT_CONTROLS_TYPE = 1;

export const controlsProfiles: Record<number, TControlsProfile> = {
    1: controlsProfile1,
    2: controlsProfile2,
    3: controlsProfile3,
};

/** Returns `null` for an unset or unknown type, which renders as `N / A`. */
export const getControlsProfile = (type?: number): TControlsProfile | null =>
    type === undefined ? null : (controlsProfiles[type] ?? null);
