import { MusicConfig } from "types/music/MusicConfig.types";

export const music: MusicConfig = {
    name: "Zophiel",
    play_one_shot: false,
    disable_delayed_start: true,
    // not_mute_on_pause: true,
    to_play_in_menu: "sounds/music/Menu/3.ogg",

    pause_override_layers: {
        bass: {
            original: {
                full: "sounds/music/66-66/Game/instruments/original/full/Zophiel.ogg",
                full_volume: 0.0,
            },
            "8-bit": {
                full: "sounds/music/66-66/Game/instruments/8_bit/full/Zophiel.ogg",
                full_volume: 0.25,
            },
        },
    },

    // layers
    bass: {
        original: {
            full: "sounds/music/66-66/Game/instruments/original/full/Zophiel.ogg",
            full_volume: 0.2,
        },
        "8-bit": {
            full: "sounds/music/66-66/Game/instruments/8_bit/full/Zophiel.ogg",
            full_volume: 0.0,
        },
    },

    by_pools: [{
        pool: 5,
        duration: 0.25,
        layers: {
            bass: {
                original: {
                    full: "sounds/music/66-66/Game/instruments/original/full/Zophiel.ogg",
                    full_volume: 0.0,
                },
                "8-bit": {
                    full: "sounds/music/66-66/Game/instruments/8_bit/full/Zophiel.ogg",
                    full_volume: 0.25,
                },
            },
        },
    }],
};
