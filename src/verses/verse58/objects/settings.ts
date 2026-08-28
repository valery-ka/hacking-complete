import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 350, h: 10.0, d: 350 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 100],
    start_walls_pools: [0],
    finish_pool: 1000,
    return_to_menu: true,
};
