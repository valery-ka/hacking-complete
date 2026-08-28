import { CategoryVolume } from "types/music/MusicConfig.types";

export interface ManahHpMusicEntry {
    hp: number;
    layers: CategoryVolume;
    duration?: number;
}

export const MANAH_HP_MUSIC: ManahHpMusicEntry[] = [
    {
        hp: 45,
        duration: 0.0,
        layers: {
            instruments: {
                "8-bit": {
                    one_shot: "sounds/music/77-77-1/Game/instruments/8_bit/one_shot/Fate.ogg",
                    full: "sounds/music/77-77-1/Game/instruments/8_bit/full/Fate.ogg",
                    one_shot_volume: 0.0,
                    full_volume: 0.0,
                },
                original: {
                    one_shot: "sounds/music/77-77-1/Game/instruments/original/one_shot/Fate.ogg",
                    full: "sounds/music/77-77-1/Game/instruments/original/full/Fate.ogg",
                    one_shot_volume: 0.33,
                    full_volume: 0.33,
                },
            },
        },
    },
    {
        hp: 31,
        duration: 3.0,
        layers: {
            instruments: {
                "8-bit": {
                    one_shot: "sounds/music/77-77-1/Game/instruments/8_bit/one_shot/Fate.ogg",
                    full: "sounds/music/77-77-1/Game/instruments/8_bit/full/Fate.ogg",
                    one_shot_volume: 0.33,
                    full_volume: 0.33,
                },
                original: {
                    one_shot: "sounds/music/77-77-1/Game/instruments/original/one_shot/Fate.ogg",
                    full: "sounds/music/77-77-1/Game/instruments/original/full/Fate.ogg",
                    one_shot_volume: 0.33,
                    full_volume: 0.33,
                },
            },
        },
    },
    {
        hp: 20,
        duration: 5.0,
        layers: {
            instruments: {
                "8-bit": {
                    one_shot: "sounds/music/77-77-1/Game/instruments/8_bit/one_shot/Fate.ogg",
                    full: "sounds/music/77-77-1/Game/instruments/8_bit/full/Fate.ogg",
                    one_shot_volume: 0.5,
                    full_volume: 0.5,
                },
                original: {
                    one_shot: "sounds/music/77-77-1/Game/instruments/original/one_shot/Fate.ogg",
                    full: "sounds/music/77-77-1/Game/instruments/original/full/Fate.ogg",
                    one_shot_volume: 0.1,
                    full_volume: 0.1,
                },
            },
        },
    },
    {
        hp: 5,
        duration: 5.0,
        layers: {
            vocals: {
                "8-bit": {
                    full: "sounds/music/77-77-2/Game/vocals/8_bit/full/Fate.ogg",
                    full_volume: 0.5,
                },
                original: {
                    full: "sounds/music/77-77-2/Game/vocals/original/full/Fate.ogg",
                    full_volume: 0.1,
                },
            },
        },
    },
];
