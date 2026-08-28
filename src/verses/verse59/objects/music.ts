import { MusicConfig } from "types/music/MusicConfig.types";

export const music: MusicConfig = {
    // general info
    name: "A_Beautiful_Song",
    play_one_shot: true,
    fade_out_duration: 5.0,

    to_play_in_menu: "sounds/music/Menu/1.ogg",

    not_mute_on_pause: true,
    pause_override_layers: {
        bass: {
            "8-bit": {
                one_shot: "sounds/music/59-59/Game/bass/8_bit/one_shot/A_Beautiful_Song.ogg",
                full: "sounds/music/59-59/Game/bass/8_bit/full/A_Beautiful_Song.ogg",
                one_shot_volume: 0.0,
                full_volume: 0.0,
            },
            original: {
                one_shot: "sounds/music/59-59/Game/bass/original/one_shot/A_Beautiful_Song.ogg",
                full: "sounds/music/59-59/Game/bass/original/full/A_Beautiful_Song.ogg",
                one_shot_volume: 0.0,
                full_volume: 0.0,
            },
        },
        drums: {
            "8-bit": {
                one_shot: "sounds/music/59-59/Game/drums/8_bit/one_shot/A_Beautiful_Song.ogg",
                full: "sounds/music/59-59/Game/drums/8_bit/full/A_Beautiful_Song.ogg",
                one_shot_volume: 0.0,
                full_volume: 0.0,
            },
            original: {
                one_shot: "sounds/music/59-59/Game/drums/original/one_shot/A_Beautiful_Song.ogg",
                full: "sounds/music/59-59/Game/drums/original/full/A_Beautiful_Song.ogg",
                one_shot_volume: 0.0,
                full_volume: 0.0,
            },
        },
        instruments: {
            "8-bit": {
                one_shot: "sounds/music/59-59/Game/instruments/8_bit/one_shot/A_Beautiful_Song.ogg",
                full: "sounds/music/59-59/Game/instruments/8_bit/full/A_Beautiful_Song.ogg",
                one_shot_volume: 0.0,
                full_volume: 0.0,
            },
            original: {
                one_shot: "sounds/music/59-59/Game/instruments/original/one_shot/A_Beautiful_Song.ogg",
                full: "sounds/music/59-59/Game/instruments/original/full/A_Beautiful_Song.ogg",
                one_shot_volume: 1.0,
                full_volume: 1.0,
            },
        },
        vocals: {
            "8-bit": {
                one_shot: "sounds/music/59-59/Game/vocals/8_bit/one_shot/A_Beautiful_Song.ogg",
                full: "sounds/music/59-59/Game/vocals/8_bit/full/A_Beautiful_Song.ogg",
                one_shot_volume: 0.0,
                full_volume: 0.0,
            },
            original: {
                one_shot: "sounds/music/59-59/Game/vocals/original/one_shot/A_Beautiful_Song.ogg",
                full: "sounds/music/59-59/Game/vocals/original/full/A_Beautiful_Song.ogg",
                one_shot_volume: 0.0,
                full_volume: 0.0,
            },
        },
    },

    // layers
    bass: {
        "8-bit": {
            one_shot: "sounds/music/59-59/Game/bass/8_bit/one_shot/A_Beautiful_Song.ogg",
            full: "sounds/music/59-59/Game/bass/8_bit/full/A_Beautiful_Song.ogg",
            one_shot_volume: 1.0,
            full_volume: 1.0,
        },
        original: {
            one_shot: "sounds/music/59-59/Game/bass/original/one_shot/A_Beautiful_Song.ogg",
            full: "sounds/music/59-59/Game/bass/original/full/A_Beautiful_Song.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
    drums: {
        "8-bit": {
            one_shot: "sounds/music/59-59/Game/drums/8_bit/one_shot/A_Beautiful_Song.ogg",
            full: "sounds/music/59-59/Game/drums/8_bit/full/A_Beautiful_Song.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        original: {
            one_shot: "sounds/music/59-59/Game/drums/original/one_shot/A_Beautiful_Song.ogg",
            full: "sounds/music/59-59/Game/drums/original/full/A_Beautiful_Song.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
    instruments: {
        "8-bit": {
            one_shot: "sounds/music/59-59/Game/instruments/8_bit/one_shot/A_Beautiful_Song.ogg",
            full: "sounds/music/59-59/Game/instruments/8_bit/full/A_Beautiful_Song.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        original: {
            one_shot: "sounds/music/59-59/Game/instruments/original/one_shot/A_Beautiful_Song.ogg",
            full: "sounds/music/59-59/Game/instruments/original/full/A_Beautiful_Song.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
    vocals: {
        "8-bit": {
            one_shot: "sounds/music/59-59/Game/vocals/8_bit/one_shot/A_Beautiful_Song.ogg",
            full: "sounds/music/59-59/Game/vocals/8_bit/full/A_Beautiful_Song.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        original: {
            one_shot: "sounds/music/59-59/Game/vocals/original/one_shot/A_Beautiful_Song.ogg",
            full: "sounds/music/59-59/Game/vocals/original/full/A_Beautiful_Song.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
};
