import { VerseSettings } from "verses/verse.types";

export const SURFACE_SETTINGS = { w: 10.5, h: 0.5, d: 100 };

export const settings: VerseSettings = {
    split_screen: { enabled: false, type: "horizontal" },
    controls_type: [undefined, 2],
    start_enemy_pools: [0, 1, 5, 900],
    start_walls_pools: [0],
    finish_pool: 1000,
    timer: 40000,
    voice_pool: "audio_dod2_pool",
};
