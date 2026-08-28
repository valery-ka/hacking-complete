import { MusicConfig } from "types/music/MusicConfig.types";

export const music: MusicConfig = {
    // general info
    name: "Pascal",
    play_one_shot: false,

    // layers
    bass: {
        "8-bit": {
            one_shot: "sounds/music/00-10/Game/bass/8_bit/one_shot/Pascal.ogg",
            full: "sounds/music/00-10/Game/bass/8_bit/full/Pascal.ogg",
            one_shot_volume: 1.2,
            full_volume: 1.2,
        },
        original: {
            one_shot: "sounds/music/00-10/Game/bass/original/one_shot/Pascal.ogg",
            full: "sounds/music/00-10/Game/bass/original/full/Pascal.ogg",
            one_shot_volume: 0.3,
            full_volume: 0.3,
        },
    },
    drums: {
        "8-bit": {
            one_shot: "sounds/music/00-10/Game/drums/8_bit/one_shot/Pascal.ogg",
            full: "sounds/music/00-10/Game/drums/8_bit/full/Pascal.ogg",
            one_shot_volume: 1.2,
            full_volume: 1.2,
        },
        original: {
            one_shot: "sounds/music/00-10/Game/drums/original/one_shot/Pascal.ogg",
            full: "sounds/music/00-10/Game/drums/original/full/Pascal.ogg",
            one_shot_volume: 0.3,
            full_volume: 0.3,
        },
    },
    instruments: {
        "8-bit": {
            one_shot: "sounds/music/00-10/Game/instruments/8_bit/one_shot/Pascal.ogg",
            full: "sounds/music/00-10/Game/instruments/8_bit/full/Pascal.ogg",
            one_shot_volume: 1.2,
            full_volume: 1.2,
        },
        original: {
            one_shot: "sounds/music/00-10/Game/instruments/original/one_shot/Pascal.ogg",
            full: "sounds/music/00-10/Game/instruments/original/full/Pascal.ogg",
            one_shot_volume: 0.3,
            full_volume: 0.3,
        },
    },
    vocals: {
        "8-bit": {
            one_shot: "sounds/music/00-10/Game/vocals/8_bit/one_shot/Pascal.ogg",
            full: "sounds/music/00-10/Game/vocals/8_bit/full/Pascal.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        original: {
            one_shot: "sounds/music/00-10/Game/vocals/original/one_shot/Pascal.ogg",
            full: "sounds/music/00-10/Game/vocals/original/full/Pascal.ogg",
            one_shot_volume: 0.3,
            full_volume: 0.3,
        },
    },
};
