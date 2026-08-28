import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 25, h: 0.5, d: 25 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [10, 20, 30, 40, 50, 60],
    start_walls_pools: [0],
    finish_pool: 1000,
    is_boss: true,
};
