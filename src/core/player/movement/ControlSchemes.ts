export type ControlMode = { hand: "left" | "right"; inverted_xy: [boolean, boolean] };

export interface ControlScheme {
    forward: string;
    back: string;
    left: string;
    right: string;
    shoot: string;
}

export const CONTROL_SCHEMES: Record<ControlMode["hand"], ControlScheme> = {
    left: { forward: "KeyW", back: "KeyS", left: "KeyA", right: "KeyD", shoot: "Space" },
    right: {
        forward: "Numpad8",
        back: "Numpad5",
        left: "Numpad4",
        right: "Numpad6",
        shoot: "Numpad0",
    },
};

export function getControlScheme(mode: ControlMode["hand"] = "left"): ControlScheme {
    return CONTROL_SCHEMES[mode];
}
