import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 3.13, y: 5.65, z: -40.27 },
        scale: { w: 77.17, h: 1, d: 59.12 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 10, action: "enemy", disposable: true },
    },
    {
        position: { x: 3.13, y: 5.65, z: -40.27 },
        scale: { w: 77.17, h: 1, d: 59.12 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3000, action: "audio", disposable: true, audio: { name: "dod1_voice_4", volume: 2.0 } },
    },

    {
        position: { x: -56.07, y: 5.65, z: -41.36 },
        scale: { w: 29.4, h: 1, d: 28.43 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 20, action: "enemy", disposable: true },
    },
    {
        position: { x: -56.07, y: 5.65, z: -41.36 },
        scale: { w: 29.4, h: 1, d: 28.43 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3000, action: "audio", disposable: true, audio: { name: "dod1_voice_5", volume: 2.0 } },
    },

    {
        position: { x: -54.58, y: 5.65, z: -6.17 },
        scale: { w: 25.91, h: 1, d: 15.86 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 21, action: "enemy", disposable: true },
    },
    {
        position: { x: -42.28, y: 5.65, z: 35.39 },
        scale: { w: 45.14, h: 1, d: 24.07 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 22, action: "enemy", disposable: true },
    },

    {
        position: { x: -42.43, y: 5.65, z: 62.31 },
        scale: { w: 26.7, h: 1, d: 16.48 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 30, action: "enemy", disposable: true },
    },
    {
        position: { x: -42.43, y: 5.65, z: 62.31 },
        scale: { w: 26.7, h: 1, d: 16.48 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3000, action: "audio", disposable: true, audio: { name: "dod1_voice_6", volume: 2.0 } },
    },

    {
        position: { x: 0.42, y: 5.65, z: 51.85 },
        scale: { w: 26.7, h: 1, d: 42 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 31, action: "enemy", disposable: true },
    },

    {
        position: { x: 35.28, y: 5.65, z: 51.9 },
        scale: { w: 26.7, h: 1, d: 41.86 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 40, action: "enemy", disposable: true },
    },
    {
        position: { x: 35.28, y: 5.65, z: 51.9 },
        scale: { w: 26.7, h: 1, d: 41.86 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3000, action: "audio", disposable: true, audio: { name: "dod1_voice_7", volume: 2.0 } },
    },

    {
        position: { x: 28.18, y: 5.65, z: 8.35 },
        scale: { w: 40.91, h: 1, d: 34.52 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 41, action: "enemy", disposable: true },
    },
];
