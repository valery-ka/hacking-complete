import { MusicConfig } from "types/music/MusicConfig.types";

const IMPATIENCE_VOLUME = 0.33;

export const music: MusicConfig = {
    name: "Impatience",
    play_one_shot: false,
    to_play_in_menu: "sounds/music/Menu/4.ogg",

    instruments: {
        original: {
            one_shot: "sounds/music/72-76/Game/instruments/original/one_shot/Impatience.ogg",
            full: "sounds/music/72-76/Game/instruments/original/full/Impatience.ogg",
            one_shot_volume: IMPATIENCE_VOLUME,
            full_volume: IMPATIENCE_VOLUME,
        },
    },
};
