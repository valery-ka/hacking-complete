import type { ActiveInputDevice } from "core/input/InputDeviceTracker";
import type { TControlHint, TIconSeparator } from "assets/ui/ui-menu-hints";

export type ControlIconSource = string | readonly string[];

const LETTER = {
    w: "textures/ui/new/letter-w.png",
    a: "textures/ui/new/letter-a.png",
    s: "textures/ui/new/letter-s.png",
    d: "textures/ui/new/letter-d.png",
    q: "textures/ui/new/letter-q.png",
    e: "textures/ui/new/letter-e.png",
} as const;

export const CONTROL_ICONS = {
    versesSelect: {
        gamepad: "textures/ui/d_pad_button.png",
        keyboardMouse: [LETTER.w, LETTER.a, LETTER.s, LETTER.d],
    },
    versesConfirm: {
        gamepad: "textures/ui/a_button.png",
        keyboardMouse: "textures/ui/new/return.png",
    },
    systemSelect: {
        gamepad: "textures/ui/up_down_button.png",
        keyboardMouse: [LETTER.w, LETTER.s],
    },
    systemAdjust: {
        gamepad: "textures/ui/left_right_button.png",
        keyboardMouse: [LETTER.a, LETTER.d],
    },
    autoAim: {
        gamepad: "textures/ui/x_button_light.png",
        keyboardMouse: "textures/ui/new/reload.png",
    },
} as const satisfies Record<string, Record<ActiveInputDevice, ControlIconSource>>;

export const getControlIcon = (
    action: keyof typeof CONTROL_ICONS,
    device: ActiveInputDevice,
): ControlIconSource => CONTROL_ICONS[action][device];

export const getControlIconPath = (
    action: keyof typeof CONTROL_ICONS,
    device: ActiveInputDevice,
): string => {
    const icon = getControlIcon(action, device);
    return typeof icon === "string" ? icon : icon[0];
};

const toHintIcon = (icon: ControlIconSource): string | string[] =>
    typeof icon === "string" ? icon : [...icon];

const createHint = (
    id: string,
    icon: ControlIconSource,
    text: string,
    iconSeparator: TIconSeparator = "gap",
): TControlHint => ({
    id,
    icon: toHintIcon(icon),
    text,
    iconSeparator,
});

export const getVersesTabHints = (device: ActiveInputDevice): TControlHint[] => [
    createHint("select", getControlIcon("versesSelect", device), "Select", "gap"),
    createHint("confirm", getControlIcon("versesConfirm", device), "Confirm"),
];

export const getSystemTabHints = (device: ActiveInputDevice): TControlHint[] => [
    createHint("select", getControlIcon("systemSelect", device), "Select", "gap"),
    createHint("adjust", getControlIcon("systemAdjust", device), "Adjust", "gap"),
];
