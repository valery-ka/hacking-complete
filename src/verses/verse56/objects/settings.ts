import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 300, h: 10.0, d: 234 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 100, 300, 400, 410],
    start_walls_pools: [0],
    finish_pool: 1000,
};
