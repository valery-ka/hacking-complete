import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 15, h: 4, d: 125 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 1, 10, 31],
    start_walls_pools: [0],
    finish_pool: 1000,
    return_to_menu: true,
};
