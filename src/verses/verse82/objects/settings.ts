import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 15, h: 1, d: 250 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    controls_type: [1, 2],
    start_enemy_pools: [0, 1000],
    start_walls_pools: [0],
    finish_pool: 10000,
    is_final_verse: true,
    // return_to_menu: true,
};
