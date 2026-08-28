import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 72, h: 10.0, d: 68 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 998, 777],
    start_walls_pools: [0],
    finish_pool: 1000,
    is_boss: true,
    pools_by_killing: [{ pool: 10, count: 24 }],
};
