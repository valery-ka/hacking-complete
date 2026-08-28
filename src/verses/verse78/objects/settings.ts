import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 100, h: 10.0, d: 100 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    controls_type: [1, 2],
    start_enemy_pools: [0, 101, 102, 103, 104, 105],
    start_walls_pools: [0, 500],
    finish_pool: 1000,
};
