import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 300, h: 10.0, d: 234 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 100],
    start_walls_pools: [0],
    finish_pool: 1000,
    pools_by_killing: [
        { pool: 10, count: 4 },
        { pool: 20, count: 10 },
        { pool: 30, count: 15 },
        { pool: 1000, count: 20 },
    ],
};
