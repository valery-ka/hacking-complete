import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 100, h: 10, d: 100 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 5, 20],
    start_walls_pools: [0],
    finish_pool: 1000,
};
