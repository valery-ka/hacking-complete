import { MusicConfig } from "types/music/MusicConfig.types";

const SHADOWLORD_INCREMENT = 0.0;

export const music: MusicConfig = {
    // general info
    name: "Shadowlord",
    play_one_shot: false,
    to_play_in_menu: "sounds/music/Menu/2.ogg",

    // layers
    bass: {
        // church
        "8-bit": {
            one_shot: "sounds/music/61-63/Game/bass/8_bit/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/bass/8_bit/full/Shadowlord.ogg",
            one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
            full_volume: 1.0 + SHADOWLORD_INCREMENT,
        },
        // орган
        original: {
            one_shot: "sounds/music/61-63/Game/bass/original/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/bass/original/full/Shadowlord.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
    drums: {
        // медиум
        "8-bit": {
            one_shot: "sounds/music/61-63/Game/drums/8_bit/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/drums/8_bit/full/Shadowlord.ogg",
            one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
            full_volume: 1.0 + SHADOWLORD_INCREMENT,
        },
        // динамик
        original: {
            one_shot: "sounds/music/61-63/Game/drums/original/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/drums/original/full/Shadowlord.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
    instruments: {
        // ничего
        "8-bit": {
            one_shot: "sounds/music/61-63/Game/instruments/8_bit/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/instruments/8_bit/full/Shadowlord.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        // кселофон
        original: {
            one_shot: "sounds/music/61-63/Game/instruments/original/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/instruments/original/full/Shadowlord.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
    },
    vocals: {
        // медиум
        "8-bit": {
            one_shot: "sounds/music/61-63/Game/vocals/8_bit/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/vocals/8_bit/full/Shadowlord.ogg",
            one_shot_volume: 0.0,
            full_volume: 0.0,
        },
        // динамик
        original: {
            one_shot: "sounds/music/61-63/Game/vocals/original/one_shot/Shadowlord.ogg",
            full: "sounds/music/61-63/Game/vocals/original/full/Shadowlord.ogg",
            one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
            full_volume: 1.0 + SHADOWLORD_INCREMENT,
        },
    },
};
