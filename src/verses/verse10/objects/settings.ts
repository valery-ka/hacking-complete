import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 36.5, h: 1000, d: 36.5 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 10, 20],
    start_walls_pools: [0, 500],
    finish_pool: 1000,
    return_to_menu: true,
};
