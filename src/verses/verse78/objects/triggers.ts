import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 1.54, y: 5.65, z: 15.5 },
        scale: { w: 39.38, h: 1, d: 31.41 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 1, action: "enemy", disposable: true },
    },
    {
        position: { x: 1.54, y: 5.65, z: 15.5 },
        scale: { w: 39.38, h: 1, d: 31.41 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3000, action: "audio", disposable: true, audio: { name: "dod1_voice_1", volume: 2.0 } },
    },

    {
        position: { x: 2.86, y: 5.65, z: 42.53 },
        scale: { w: 48.8, h: 1, d: 12.9 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 11, action: "enemy", disposable: true },
    },
    {
        position: { x: 2.86, y: 5.65, z: 42.53 },
        scale: { w: 48.8, h: 1, d: 12.9 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3000, action: "audio", disposable: true, audio: { name: "dod1_voice_2", volume: 2.0 } },
    },

    {
        position: { x: -9.44, y: 5.65, z: 39.62 },
        scale: { w: 17.93, h: 1, d: 18.63 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 42, action: "enemy", disposable: true },
    },

    {
        position: { x: 12.95, y: 5.65, z: 42.39 },
        scale: { w: 15.61, h: 1, d: 13.11 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 21, action: "enemy", disposable: true },
    },

    {
        position: { x: 2.02, y: 5.65, z: -10.36 },
        scale: { w: 85.95, h: 1, d: 11.95 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 61, action: "enemy", disposable: true },
    },
    {
        position: { x: 2.02, y: 5.65, z: -10.36 },
        scale: { w: 85.95, h: 1, d: 11.95 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3000, action: "audio", disposable: true, audio: { name: "dod1_voice_3", volume: 2.0 } },
    },

    {
        position: { x: -30.63, y: 5.65, z: -4.77 },
        scale: { w: 20.68, h: 1, d: 22.86 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 71, action: "enemy", disposable: true },
    },

    {
        position: { x: -23.18, y: 5.65, z: -20.05 },
        scale: { w: 43.99, h: 1, d: 31.41 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 80, action: "enemy", disposable: true },
    },
];
