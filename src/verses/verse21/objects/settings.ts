import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { d: 35, h: 10 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "vertical" },
    start_enemy_pools: [0, 1, 10],
    start_walls_pools: [0],
    finish_pool: 1000,
    emimissive_color_factor: 0.5,
    return_to_menu: true,
};
