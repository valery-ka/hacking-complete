import { MusicConfig } from "types/music/MusicConfig.types";

export const music: MusicConfig = {
    name: "Galgaliel",
    play_one_shot: false,
    to_play_in_menu: "sounds/music/Menu/3.ogg",

    // not_mute_on_pause: true,
    pause_override_layers: {
        bass: {
            original: {
                full: "sounds/music/65-65/Game/instruments/original/full/Galgaliel.ogg",
                full_volume: 0.0,
            },
            "8-bit": {
                full: "sounds/music/65-65/Game/instruments/8_bit/full/Galgaliel.ogg",
                full_volume: 0.25,
            },
        },
    },

    // layers
    bass: {
        original: {
            full: "sounds/music/65-65/Game/instruments/original/full/Galgaliel.ogg",
            full_volume: 0.2,
        },
        "8-bit": {
            full: "sounds/music/65-65/Game/instruments/8_bit/full/Galgaliel.ogg",
            full_volume: 0.0,
        },
    },

    by_pools: [{
        pool: 100,
        duration: 0.25,
        layers: {
            bass: {
                original: {
                    full: "sounds/music/65-65/Game/instruments/original/full/Galgaliel.ogg",
                    full_volume: 0.0,
                },
                "8-bit": {
                    full: "sounds/music/65-65/Game/instruments/8_bit/full/Galgaliel.ogg",
                    full_volume: 0.25,
                },
            },
        },
    }]
};
