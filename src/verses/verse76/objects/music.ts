import { MusicConfig } from "types/music/MusicConfig.types";

const IMPATIENCE_VOLUME = 0.33;

export const music: MusicConfig = {
    name: "Impatience-2",
    play_one_shot: false,
    stop_all_music_on_finish: true,
    to_play_in_menu: "sounds/music/Menu/4.ogg",

    instruments: {
        original: {
            full: "sounds/music/76-76/Game/instruments/original/full/Impatience-2.ogg",
            full_volume: IMPATIENCE_VOLUME,
        },
    },
};
