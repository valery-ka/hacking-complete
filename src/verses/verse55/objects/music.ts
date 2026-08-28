import { MusicConfig } from "types/music/MusicConfig.types";

export const music: MusicConfig = {
    // general info
    name: "Amusement_Park",
    play_one_shot: true,

    to_play_in_menu: "sounds/music/Menu/1.ogg",

    // layers
    bass: {
        "8-bit": {
            one_shot: "sounds/music/55-58/Game/bass/8_bit/one_shot/Amusement_Park.ogg",
            full: "sounds/music/55-58/Game/bass/8_bit/full/Amusement_Park.ogg",
            one_shot_volume: 1.0,
            full_volume: 1.0,
        },
        original: {
            one_shot: "sounds/music/55-58/Game/bass/original/one_shot/Amusement_Park.ogg",
            full: "sounds/music/55-58/Game/bass/original/full/Amusement_Park.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
    drums: {
        "8-bit": {
            one_shot: "sounds/music/55-58/Game/drums/8_bit/one_shot/Amusement_Park.ogg",
            full: "sounds/music/55-58/Game/drums/8_bit/full/Amusement_Park.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        original: {
            one_shot: "sounds/music/55-58/Game/drums/original/one_shot/Amusement_Park.ogg",
            full: "sounds/music/55-58/Game/drums/original/full/Amusement_Park.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
    instruments: {
        "8-bit": {
            one_shot: "sounds/music/55-58/Game/instruments/8_bit/one_shot/Amusement_Park.ogg",
            full: "sounds/music/55-58/Game/instruments/8_bit/full/Amusement_Park.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        original: {
            one_shot: "sounds/music/55-58/Game/instruments/original/one_shot/Amusement_Park.ogg",
            full: "sounds/music/55-58/Game/instruments/original/full/Amusement_Park.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
    vocals: {
        "8-bit": {
            one_shot: "sounds/music/55-58/Game/vocals/8_bit/one_shot/Amusement_Park.ogg",
            full: "sounds/music/55-58/Game/vocals/8_bit/full/Amusement_Park.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        original: {
            one_shot: "sounds/music/55-58/Game/vocals/original/one_shot/Amusement_Park.ogg",
            full: "sounds/music/55-58/Game/vocals/original/full/Amusement_Park.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
};
