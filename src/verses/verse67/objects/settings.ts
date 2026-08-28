import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { d: 35, h: 8.6 };

export const settings: VerseSettings = {
    split_screen: { enabled: true, type: "horizontal" },
    controls_type: [1, 2],
    start_enemy_pools: [10],
    start_walls_pools: [0, 1, 2, 3],
    finish_pool: 1000,
    emimissive_color_factor: 0.5,
};
