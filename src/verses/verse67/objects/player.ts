import { PlayerConfig } from "types/player/Player.types";

import { SURFACE_SETTINGS } from "./settings";

export const player: PlayerConfig[] = [
    {
        id: 0,
        type: "light",
        start_position: { long: 0.2, h: 0 },
        camera: { id: 0, type: "follow" },
        ground: { id: 0, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        hover_factor: 0.35,
        controls: {
            hand: "left",
            inverted_xy: [false, true],
            inverted_fr: true,
            inverted_rot: false,
            manual_rot: Math.PI / 2,
            fix_cylinder_rotation: false,
        },
        shooter_bullets: "light",
    },
    {
        id: 1,
        type: "dark",
        start_position: { long: 0.2, h: 0 },
        camera: { id: 1, type: "follow" },
        ground: { id: 0, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: true,
        hover_factor: 0.35,
        controls: {
            hand: "left",
            inverted_xy: [false, false],
            inverted_fr: true,
            inverted_rot: false,
            manual_rot: Math.PI / 2,
            fix_cylinder_rotation: true,
        },
        shooter_bullets: "dark",
    },
];
