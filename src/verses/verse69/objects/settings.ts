import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { h: 0, d: 20 };

export const settings: VerseSettings = {
    split_screen: { enabled: true, type: "horizontal" },
    controls_type: [1, 2],
    start_enemy_pools: [0, 1, 5051],
    start_walls_pools: [999],
    finish_pool: 1000,
    emimissive_color_factor: 0.5,
};
