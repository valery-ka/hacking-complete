import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 30, h: 0.5, d: 30 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    controls_type: [undefined, 2],
    start_enemy_pools: [100, 900],
    start_walls_pools: [0],
    finish_pool: 1000,
    is_boss: true,
    pools_by_killing: [
        { pool: 200, count: 11 },
        { pool: 300, count: 22 },
    ],
};
