import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 150, h: 10.0, d: 150 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    controls_type: [1, 2],
    start_enemy_pools: [0, 10],
    start_walls_pools: [0, 500],
    finish_pool: 1000,
};
