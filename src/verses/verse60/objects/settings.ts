import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 40, h: 0.5, d: 40 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 5, 10],
    start_walls_pools: [0, 21],
    finish_pool: 1000,
};
