import { CategoryVolume } from "types/music/MusicConfig.types";

const BASE = "sounds/music/61-63/Game";
const SHADOWLORD_INCREMENT = 0.0;

export interface ShadowlordHpMusicEntry {
    hp: number;
    layers: CategoryVolume;
    duration?: number;
}

export const SHADOWLORD_HP_MUSIC: ShadowlordHpMusicEntry[] = [
    {
        hp: 44,
        duration: 0.5,
        layers: {
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
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
            },
            drums: {
                "8-bit": {
                    one_shot: "sounds/music/61-63/Game/drums/8_bit/one_shot/Shadowlord.ogg",
                    full: "sounds/music/61-63/Game/drums/8_bit/full/Shadowlord.ogg",
                    one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
                    full_volume: 1.0 + SHADOWLORD_INCREMENT,
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
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
                original: {
                    one_shot: "sounds/music/61-63/Game/vocals/original/one_shot/Shadowlord.ogg",
                    full: "sounds/music/61-63/Game/vocals/original/full/Shadowlord.ogg",
                    one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
                    full_volume: 1.0 + SHADOWLORD_INCREMENT,
                },
            },
        },
    },
    {
        hp: 30,
        duration: 0.5,
        layers: {
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
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
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
                    one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
                    full_volume: 1.0 + SHADOWLORD_INCREMENT,
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
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
                original: {
                    one_shot: "sounds/music/61-63/Game/vocals/original/one_shot/Shadowlord.ogg",
                    full: "sounds/music/61-63/Game/vocals/original/full/Shadowlord.ogg",
                    one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
                    full_volume: 1.0 + SHADOWLORD_INCREMENT,
                },
            },
        },
    },
    {
        hp: 15,
        duration: 3.5,
        layers: {
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
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
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
                    one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
                    full_volume: 1.0 + SHADOWLORD_INCREMENT,
                },
            },
            vocals: {
                "8-bit": {
                    one_shot: "sounds/music/61-63/Game/vocals/8_bit/one_shot/Shadowlord.ogg",
                    full: "sounds/music/61-63/Game/vocals/8_bit/full/Shadowlord.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
                original: {
                    one_shot: "sounds/music/61-63/Game/vocals/original/one_shot/Shadowlord.ogg",
                    full: "sounds/music/61-63/Game/vocals/original/full/Shadowlord.ogg",
                    one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
                    full_volume: 1.0 + SHADOWLORD_INCREMENT,
                },
            },
        },
    },
    {
        hp: 10,
        duration: 7.0,
        layers: {
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
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
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
                    one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
                    full_volume: 1.0 + SHADOWLORD_INCREMENT,
                },
            },
            vocals: {
                "8-bit": {
                    one_shot: "sounds/music/61-63/Game/vocals/8_bit/one_shot/Shadowlord.ogg",
                    full: "sounds/music/61-63/Game/vocals/8_bit/full/Shadowlord.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
                original: {
                    one_shot: "sounds/music/61-63/Game/vocals/original/one_shot/Shadowlord.ogg",
                    full: "sounds/music/61-63/Game/vocals/original/full/Shadowlord.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
            },
        },
    },
    {
        hp: 5,
        duration: 9.0,
        layers: {
            bass: {
                "8-bit": {
                    one_shot: "sounds/music/61-63/Game/bass/8_bit/one_shot/Shadowlord.ogg",
                    full: "sounds/music/61-63/Game/bass/8_bit/full/Shadowlord.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
                original: {
                    one_shot: "sounds/music/61-63/Game/bass/original/one_shot/Shadowlord.ogg",
                    full: "sounds/music/61-63/Game/bass/original/full/Shadowlord.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
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
                    one_shot_volume: 1.0 + SHADOWLORD_INCREMENT,
                    full_volume: 1.0 + SHADOWLORD_INCREMENT,
                },
            },
            vocals: {
                "8-bit": {
                    one_shot: "sounds/music/61-63/Game/vocals/8_bit/one_shot/Shadowlord.ogg",
                    full: "sounds/music/61-63/Game/vocals/8_bit/full/Shadowlord.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
                original: {
                    one_shot: "sounds/music/61-63/Game/vocals/original/one_shot/Shadowlord.ogg",
                    full: "sounds/music/61-63/Game/vocals/original/full/Shadowlord.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
            },
        },
    },
];
