import { MusicConfig } from "types/music/MusicConfig.types";

const MULTIPLIER = 0.75;

export const music: MusicConfig = {
    // general info
    name: "Dance_Of_The_Evanescent",
    play_one_shot: false,
    to_play_in_menu: "sounds/music/Menu/2.ogg",
    fade_out_duration: 4.0,

    // layers
    bass: {
        "8-bit": {
            one_shot: "sounds/music/62-62/Game/bass/8_bit/one_shot/Dance_Of_The_Evanescent.ogg",
            full: "sounds/music/62-62/Game/bass/8_bit/full/Dance_Of_The_Evanescent.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        original: {
            one_shot: "sounds/music/62-62/Game/bass/original/one_shot/Dance_Of_The_Evanescent.ogg",
            full: "sounds/music/62-62/Game/bass/original/full/Dance_Of_The_Evanescent.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
    drums: {
        "8-bit": {
            one_shot: "sounds/music/62-62/Game/drums/8_bit/one_shot/Dance_Of_The_Evanescent.ogg",
            full: "sounds/music/62-62/Game/drums/8_bit/full/Dance_Of_The_Evanescent.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        original: {
            one_shot: "sounds/music/62-62/Game/drums/original/one_shot/Dance_Of_The_Evanescent.ogg",
            full: "sounds/music/62-62/Game/drums/original/full/Dance_Of_The_Evanescent.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
    instruments: {
        "8-bit": {
            one_shot: "sounds/music/62-62/Game/instruments/8_bit/one_shot/Dance_Of_The_Evanescent.ogg",
            full: "sounds/music/62-62/Game/instruments/8_bit/full/Dance_Of_The_Evanescent.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        original: {
            one_shot: "sounds/music/62-62/Game/instruments/original/one_shot/Dance_Of_The_Evanescent.ogg",
            full: "sounds/music/62-62/Game/instruments/original/full/Dance_Of_The_Evanescent.ogg",
            one_shot_volume: 1.0 * MULTIPLIER,
            full_volume: 1.0 * MULTIPLIER,
        },
    },
    vocals: {
        "8-bit": {
            one_shot: "sounds/music/62-62/Game/vocals/8_bit/one_shot/Dance_Of_The_Evanescent.ogg",
            full: "sounds/music/62-62/Game/vocals/8_bit/full/Dance_Of_The_Evanescent.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        original: {
            one_shot: "sounds/music/62-62/Game/vocals/original/one_shot/Dance_Of_The_Evanescent.ogg",
            full: "sounds/music/62-62/Game/vocals/original/full/Dance_Of_The_Evanescent.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },

    by_pools: [{
        pool: 1,
        duration: 10,
        layers: {
            bass: {
                "8-bit": {
                    one_shot: "sounds/music/62-62/Game/bass/8_bit/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/bass/8_bit/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
                original: {
                    one_shot: "sounds/music/62-62/Game/bass/original/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/bass/original/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
            },
            drums: {
                "8-bit": {
                    one_shot: "sounds/music/62-62/Game/drums/8_bit/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/drums/8_bit/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
                original: {
                    one_shot: "sounds/music/62-62/Game/drums/original/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/drums/original/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
            },
            instruments: {
                "8-bit": {
                    one_shot: "sounds/music/62-62/Game/instruments/8_bit/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/instruments/8_bit/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 1.5 * MULTIPLIER,
                    full_volume: 1.5 * MULTIPLIER,
                },
                original: {
                    one_shot: "sounds/music/62-62/Game/instruments/original/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/instruments/original/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.75 * MULTIPLIER,
                    full_volume: 0.75 * MULTIPLIER,
                },
            },
            vocals: {
                "8-bit": {
                    one_shot: "sounds/music/62-62/Game/vocals/8_bit/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/vocals/8_bit/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
                original: {
                    one_shot: "sounds/music/62-62/Game/vocals/original/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/vocals/original/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
            },
        },
    },
    {
        pool: 2,
        duration: 10,
        layers: {
            bass: {
                "8-bit": {
                    one_shot: "sounds/music/62-62/Game/bass/8_bit/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/bass/8_bit/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
                original: {
                    one_shot: "sounds/music/62-62/Game/bass/original/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/bass/original/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
            },
            drums: {
                "8-bit": {
                    one_shot: "sounds/music/62-62/Game/drums/8_bit/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/drums/8_bit/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
                original: {
                    one_shot: "sounds/music/62-62/Game/drums/original/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/drums/original/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
            },
            instruments: {
                "8-bit": {
                    one_shot: "sounds/music/62-62/Game/instruments/8_bit/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/instruments/8_bit/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 2.5 * MULTIPLIER,
                    full_volume: 2.5 * MULTIPLIER,
                },
                original: {
                    one_shot: "sounds/music/62-62/Game/instruments/original/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/instruments/original/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
            },
            vocals: {
                "8-bit": {
                    one_shot: "sounds/music/62-62/Game/vocals/8_bit/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/vocals/8_bit/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
                original: {
                    one_shot: "sounds/music/62-62/Game/vocals/original/one_shot/Dance_Of_The_Evanescent.ogg",
                    full: "sounds/music/62-62/Game/vocals/original/full/Dance_Of_The_Evanescent.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
            },
        },
    }],

};
