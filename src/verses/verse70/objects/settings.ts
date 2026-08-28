import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 100, h: 10.0, d: 250 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    controls_type: [undefined, 2],
    start_enemy_pools: [0, 1, 2, 3, 4, 5, 6, 7, 8, 11],
    start_walls_pools: [0],
    finish_pool: 1000,
    return_to_menu: true,
};
