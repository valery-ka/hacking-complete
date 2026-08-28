import { MusicConfig } from "types/music/MusicConfig.types";

const SHADOWLORD_INCREMENT = 0.0;

export const music: MusicConfig = {
    // general info
    name: "Shadowlord",
    play_one_shot: false,
    transition_duration: 5.0,

    to_play_in_menu: "sounds/music/Menu/2.ogg",

    // layers
    bass: {
        "8-bit": {
            one_shot: "sounds/music/61-63/Game/bass/8_bit/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/bass/8_bit/full/Shadowlord.ogg",
            one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
            full_volume: 1.0 + SHADOWLORD_INCREMENT,
        },
        original: {
            one_shot: "sounds/music/61-63/Game/bass/original/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/bass/original/full/Shadowlord.ogg",
            one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
            full_volume: 1.0 + SHADOWLORD_INCREMENT,
        },
    },
    drums: {
        "8-bit": {
            one_shot: "sounds/music/61-63/Game/drums/8_bit/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/drums/8_bit/full/Shadowlord.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        original: {
            one_shot: "sounds/music/61-63/Game/drums/original/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/drums/original/full/Shadowlord.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
    instruments: {
        "8-bit": {
            one_shot: "sounds/music/61-63/Game/instruments/8_bit/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/instruments/8_bit/full/Shadowlord.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        original: {
            one_shot: "sounds/music/61-63/Game/instruments/original/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/instruments/original/full/Shadowlord.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
    vocals: {
        "8-bit": {
            one_shot: "sounds/music/61-63/Game/vocals/8_bit/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/vocals/8_bit/full/Shadowlord.ogg",
            one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
            full_volume: 1.0 + SHADOWLORD_INCREMENT,
        },
        original: {
            one_shot: "sounds/music/61-63/Game/vocals/original/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/vocals/original/full/Shadowlord.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
};
