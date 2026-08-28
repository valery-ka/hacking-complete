import { MusicConfig } from "types/music/MusicConfig.types";

export const music: MusicConfig = {
    // general info
    name: "Dark_Colossus",
    play_one_shot: false,

    // layers
    bass: {
        "8-bit": {
            one_shot: "sounds/music/22-32/Game/bass/8_bit/one_shot/Dark_Colossus.ogg",
            full: "sounds/music/22-32/Game/bass/8_bit/full/Dark_Colossus.ogg",
            one_shot_volume: 0.75,
            full_volume: 0.75,
        },
        original: {
            one_shot: "sounds/music/22-32/Game/bass/original/one_shot/Dark_Colossus.ogg",
            full: "sounds/music/22-32/Game/bass/original/full/Dark_Colossus.ogg",
            one_shot_volume: 0.25,
            full_volume: 0.25,
        },
    },
    drums: {
        "8-bit": {
            one_shot: "sounds/music/22-32/Game/drums/8_bit/one_shot/Dark_Colossus.ogg",
            full: "sounds/music/22-32/Game/drums/8_bit/full/Dark_Colossus.ogg",
            one_shot_volume: 0.75,
            full_volume: 0.75,
        },
        original: {
            one_shot: "sounds/music/22-32/Game/drums/original/one_shot/Dark_Colossus.ogg",
            full: "sounds/music/22-32/Game/drums/original/full/Dark_Colossus.ogg",
            one_shot_volume: 0.25,
            full_volume: 0.25,
        },
    },
    instruments: {
        "8-bit": {
            one_shot: "sounds/music/22-32/Game/instruments/8_bit/one_shot/Dark_Colossus.ogg",
            full: "sounds/music/22-32/Game/instruments/8_bit/full/Dark_Colossus.ogg",
            one_shot_volume: 0.8,
            full_volume: 0.8,
        },
        original: {
            one_shot: "sounds/music/22-32/Game/instruments/original/one_shot/Dark_Colossus.ogg",
            full: "sounds/music/22-32/Game/instruments/original/full/Dark_Colossus.ogg",
            one_shot_volume: 0.25,
            full_volume: 0.25,
        },
    },
    vocals: {
        "8-bit": {
            one_shot: "sounds/music/22-32/Game/vocals/8_bit/one_shot/Dark_Colossus.ogg",
            full: "sounds/music/22-32/Game/vocals/8_bit/full/Dark_Colossus.ogg",
            one_shot_volume: 0.45,
            full_volume: 0.45,
        },
        original: {
            one_shot: "sounds/music/22-32/Game/vocals/original/one_shot/Dark_Colossus.ogg",
            full: "sounds/music/22-32/Game/vocals/original/full/Dark_Colossus.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
};
