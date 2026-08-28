import { CategoryVolume } from "types/music/MusicConfig.types";

const BASE = "sounds/music/59-59/Game";
const SHADOWLORD_INCREMENT = 0.5;

export interface SimoneHpMusicEntry {
    hp: number;
    layers: CategoryVolume;
    duration?: number;
}

export const SIMONE_HP_MUSIC: SimoneHpMusicEntry[] = [
    {
        hp: 58,
        layers: {
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
        },
    },
    //
    {
        hp: 38,
        layers: {
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
                    one_shot_volume: 0.5 + SHADOWLORD_INCREMENT,
                    full_volume: 0.5 + SHADOWLORD_INCREMENT,
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
        },
    },
    {
        hp: 37,
        layers: {
            bass: {
                "8-bit": {
                    one_shot: "sounds/music/59-59/Game/bass/8_bit/one_shot/A_Beautiful_Song.ogg",
                    full: "sounds/music/59-59/Game/bass/8_bit/full/A_Beautiful_Song.ogg",
                    one_shot_volume: 0.95,
                    full_volume: 0.95,
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
                    one_shot_volume: 0.6 + SHADOWLORD_INCREMENT,
                    full_volume: 0.6 + SHADOWLORD_INCREMENT,
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
                    one_shot_volume: 0.1,
                    full_volume: 0.1,
                },
            },
        },
    },
    {
        hp: 36,
        layers: {
            bass: {
                "8-bit": {
                    one_shot: "sounds/music/59-59/Game/bass/8_bit/one_shot/A_Beautiful_Song.ogg",
                    full: "sounds/music/59-59/Game/bass/8_bit/full/A_Beautiful_Song.ogg",
                    one_shot_volume: 0.9,
                    full_volume: 0.9,
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
                    one_shot_volume: 0.7 + SHADOWLORD_INCREMENT,
                    full_volume: 0.7 + SHADOWLORD_INCREMENT,
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
                    one_shot_volume: 0.2,
                    full_volume: 0.2,
                },
            },
        },
    },
    {
        hp: 35,
        layers: {
            bass: {
                "8-bit": {
                    one_shot: "sounds/music/59-59/Game/bass/8_bit/one_shot/A_Beautiful_Song.ogg",
                    full: "sounds/music/59-59/Game/bass/8_bit/full/A_Beautiful_Song.ogg",
                    one_shot_volume: 0.85,
                    full_volume: 0.85,
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
                    one_shot_volume: 0.8 + SHADOWLORD_INCREMENT,
                    full_volume: 0.8 + SHADOWLORD_INCREMENT,
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
                    one_shot_volume: 0.3,
                    full_volume: 0.3,
                },
            },
        },
    },
    {
        hp: 34,
        layers: {
            bass: {
                "8-bit": {
                    one_shot: "sounds/music/59-59/Game/bass/8_bit/one_shot/A_Beautiful_Song.ogg",
                    full: "sounds/music/59-59/Game/bass/8_bit/full/A_Beautiful_Song.ogg",
                    one_shot_volume: 0.8,
                    full_volume: 0.8,
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
                    one_shot_volume: 0.9 + SHADOWLORD_INCREMENT,
                    full_volume: 0.9 + SHADOWLORD_INCREMENT,
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
                    one_shot_volume: 0.4,
                    full_volume: 0.4,
                },
            },
        },
    },
    {
        hp: 33,
        layers: {
            bass: {
                "8-bit": {
                    one_shot: "sounds/music/59-59/Game/bass/8_bit/one_shot/A_Beautiful_Song.ogg",
                    full: "sounds/music/59-59/Game/bass/8_bit/full/A_Beautiful_Song.ogg",
                    one_shot_volume: 0.75,
                    full_volume: 0.75,
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
                    one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
                    full_volume: 1.0 + SHADOWLORD_INCREMENT,
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
                    one_shot_volume: 0.5,
                    full_volume: 0.5,
                },
            },
        },
    },
    {
        hp: 32,
        layers: {
            bass: {
                "8-bit": {
                    one_shot: "sounds/music/59-59/Game/bass/8_bit/one_shot/A_Beautiful_Song.ogg",
                    full: "sounds/music/59-59/Game/bass/8_bit/full/A_Beautiful_Song.ogg",
                    one_shot_volume: 0.7,
                    full_volume: 0.7,
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
                    one_shot_volume: 0.9 + SHADOWLORD_INCREMENT,
                    full_volume: 0.9 + SHADOWLORD_INCREMENT,
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
                    one_shot_volume: 0.6,
                    full_volume: 0.6,
                },
            },
        },
    },
    {
        hp: 31,
        layers: {
            bass: {
                "8-bit": {
                    one_shot: "sounds/music/59-59/Game/bass/8_bit/one_shot/A_Beautiful_Song.ogg",
                    full: "sounds/music/59-59/Game/bass/8_bit/full/A_Beautiful_Song.ogg",
                    one_shot_volume: 0.65,
                    full_volume: 0.65,
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
                    one_shot_volume: 0.8 + SHADOWLORD_INCREMENT,
                    full_volume: 0.8 + SHADOWLORD_INCREMENT,
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
                    one_shot_volume: 0.7,
                    full_volume: 0.7,
                },
            },
        },
    },
    {
        hp: 30,
        layers: {
            bass: {
                "8-bit": {
                    one_shot: "sounds/music/59-59/Game/bass/8_bit/one_shot/A_Beautiful_Song.ogg",
                    full: "sounds/music/59-59/Game/bass/8_bit/full/A_Beautiful_Song.ogg",
                    one_shot_volume: 0.6,
                    full_volume: 0.6,
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
                    one_shot_volume: 0.7 + SHADOWLORD_INCREMENT,
                    full_volume: 0.7 + SHADOWLORD_INCREMENT,
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
                    one_shot_volume: 0.8,
                    full_volume: 0.8,
                },
            },
        },
    },
    {
        hp: 29,
        layers: {
            bass: {
                "8-bit": {
                    one_shot: "sounds/music/59-59/Game/bass/8_bit/one_shot/A_Beautiful_Song.ogg",
                    full: "sounds/music/59-59/Game/bass/8_bit/full/A_Beautiful_Song.ogg",
                    one_shot_volume: 0.55,
                    full_volume: 0.55,
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
                    one_shot_volume: 0.6 + SHADOWLORD_INCREMENT,
                    full_volume: 0.6 + SHADOWLORD_INCREMENT,
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
                    one_shot_volume: 0.9,
                    full_volume: 0.9,
                },
            },
        },
    },
    {
        hp: 28,
        layers: {
            bass: {
                "8-bit": {
                    one_shot: "sounds/music/59-59/Game/bass/8_bit/one_shot/A_Beautiful_Song.ogg",
                    full: "sounds/music/59-59/Game/bass/8_bit/full/A_Beautiful_Song.ogg",
                    one_shot_volume: 0.5,
                    full_volume: 0.5,
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
                    one_shot_volume: 0.5 + SHADOWLORD_INCREMENT,
                    full_volume: 0.5 + SHADOWLORD_INCREMENT,
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
                    one_shot_volume: 1.0,
                    full_volume: 1.0,
                },
            },
        },
    },
    //
    {
        hp: 24,
        layers: {
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
                    one_shot_volume: 1.0,
                    full_volume: 1.0,
                },
            },
        },
    },
];
