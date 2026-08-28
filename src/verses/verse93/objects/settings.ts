import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 100, h: 10.0, d: 100 };

export const settings: VerseSettings = {
    split_screen: { enabled: true, type: "horizontal" },
    start_enemy_pools: [0],
    start_walls_pools: [0, 500],
    finish_pool: 1000,
};
