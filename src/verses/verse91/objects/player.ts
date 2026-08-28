import { PlayerConfig } from "types/player/Player.types";

import { SURFACE_SETTINGS } from "./settings";

export const player: PlayerConfig[] = [
    {
        id: 1,
        type: "dark",
        start_position: { long: 0.1, h: -2 },
        camera: { id: 0, type: "follow" },
        ground: { id: 0, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        hover_factor: 0.25,
        controls: {
            hand: "left",
            inverted_xy: [false, false],
            inverted_fr: false,
            inverted_rot: false,
        },
        shooter_bullets: "dark",
    },
    // {
    //     id: 1,
    //     type: "dark",
    //     start_position: { long: 0.1, h: -2 },
    //     camera: { id: 1, type: "follow" },
    //     ground: { id: 0, physics: "cylinder", size: SURFACE_SETTINGS },
    //     is_inside_ground: false,
    //     hover_factor: 0.25,
    //     controls: {
    //         hand: "left",
    //         inverted_xy: [false, false],
    //         inverted_fr: false,
    //         inverted_rot: false,
    //     },
    //     shooter_bullets: "dark",
    // },
];
