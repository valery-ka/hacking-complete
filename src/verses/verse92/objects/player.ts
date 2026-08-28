import { PlayerConfig } from "types/player/Player.types";

import { SURFACE_SETTINGS } from "./settings";

export const player: PlayerConfig[] = [
    {
        id: 0,
        type: "light",
        start_position: { long: 0, lat: Math.PI / 2 },
        camera: { id: 0, type: "follow" },
        ground: { id: 0, physics: "sphere", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        hover_factor: 0.3,
        controls: {
            hand: "left",
            inverted_xy: [false, false],
            inverted_fr: false,
            inverted_rot: false,
        },
        shooter_bullets: "light",
    },
    // {
    //     id: 1,
    //     type: "dark",
    //     start_position: { long: 0, lat: Math.PI / 2 },
    //     camera: { id: 1, type: "fixed" },
    //     ground: { id: 0, physics: "sphere", size: SURFACE_SETTINGS },
    //     is_inside_ground: true,
    //     hover_factor: 0.3,
    //     controls: {
    //         hand: "left",
    //         inverted_xy: [false, true],
    //         inverted_fr: false,
    //         inverted_rot: false,
    //     },
    //     shooter_bullets: "dark",
    // },
];
