import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 30, h: 0.5, d: 30 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 10],
    start_walls_pools: [5, 15, 25, 35],
    finish_pool: 1000,
    pools_by_killing: [
        { pool: 5, count: 3 },
        { pool: 15, count: 6 },
        { pool: 25, count: 9 },
        { pool: 35, count: 12 },
    ],
};
