import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 125, h: 10.0, d: 125 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 5],
    start_walls_pools: [0, 5, 30],
    finish_pool: 1000,
};
