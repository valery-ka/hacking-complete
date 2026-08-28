import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 30, h: 1.0, d: 25 };

export const settings: VerseSettings = {
    split_screen: { enabled: true, type: "horizontal" },
    controls_type: [1, 2],
    start_enemy_pools: [0, 10, 20, 10000, 10010, 10020],
    start_walls_pools: [0],
    finish_pool: 1000,
};
