import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { d: 35, h: 10 };

export const settings: VerseSettings = {
    split_screen: { enabled: true, type: "vertical" },
    controls_type: [1, 2],
    controls_layout: "by_profile",
    start_enemy_pools: [0, 10, 5051],
    start_walls_pools: [0],
    finish_pool: 1000,
    emimissive_color_factor: 0.4,
};
