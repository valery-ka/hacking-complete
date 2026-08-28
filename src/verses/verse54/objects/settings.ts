import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 12.5, h: 10.0, d: 125 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 5, 10],
    start_walls_pools: [0],
    finish_pool: 1000,
    pools_by_killing: [{ pool: 50, count: 20 }],
    return_to_menu: true,
};
