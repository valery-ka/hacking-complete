import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 30, h: 0.5, d: 30 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 10, 50],
    start_walls_pools: [0],
    finish_pool: 1000,
};
