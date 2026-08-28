import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { d: 35, h: 20 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "vertical" },
    start_enemy_pools: [0, 10, 5051],
    start_walls_pools: [0],
    finish_pool: 1000,
};
