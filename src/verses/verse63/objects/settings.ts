import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 5, h: 10.0, d: 5 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "vertical" },
    start_enemy_pools: [0, 10],
    start_walls_pools: [0],
    finish_pool: 1000,
    return_to_menu: true,
};
