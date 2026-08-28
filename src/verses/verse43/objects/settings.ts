import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { h: 0, d: 20 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 1, 5051],
    start_walls_pools: [0],
    finish_pool: 1000,
    emimissive_color_factor: 0.5,
    pools_by_killing: [{ pool: 3, count: 35 }],
    return_to_menu: true,
};
