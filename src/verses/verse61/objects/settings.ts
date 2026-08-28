import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 30, h: 0.5, d: 60 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 5, 10, 15, 20, 11, 21, 31, 41, 69, 67],
    start_walls_pools: [0],
    finish_pool: 1000,
};
