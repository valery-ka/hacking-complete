import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { h: 0, d: 20 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    start_enemy_pools: [0, 1, 5051],
    start_walls_pools: [0],
    finish_pool: 1000,
};
