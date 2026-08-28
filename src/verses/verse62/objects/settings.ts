import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS_1 = { w: 5, h: 0.5, d: 40 };
export const SURFACE_SETTINGS_2 = { w: 20, h: 0.5, d: 40 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 5, 50, 500, 501, 502, 503, 504],
    start_walls_pools: [0],
    finish_pool: 1000,
    controls_type: [3, undefined],
};
