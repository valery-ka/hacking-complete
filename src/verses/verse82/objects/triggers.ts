import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: -8, y: 1, z: -10 },
        scale: { w: 3, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 101, action: "enemy", disposable: true },
    },
    {
        position: { x: -8, y: 1, z: -10 },
        scale: { w: 3, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 901, action: "enemy", disposable: true },
    },

    {
        position: { x: 8, y: 1, z: -10 },
        scale: { w: 3, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 102, action: "enemy", disposable: true },
    },
    {
        position: { x: 8, y: 1, z: -10 },
        scale: { w: 3, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 902, action: "enemy", disposable: true },
    },

    {
        position: { x: -8, y: 1, z: 30 },
        scale: { w: 3, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 103, action: "enemy", disposable: true },
    },
    {
        position: { x: -8, y: 1, z: 30 },
        scale: { w: 3, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 903, action: "enemy", disposable: true },
    },

    {
        position: { x: 8, y: 1, z: 30 },
        scale: { w: 3, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 104, action: "enemy", disposable: true },
    },
    {
        position: { x: 8, y: 1, z: 30 },
        scale: { w: 3, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 904, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 1, z: 66.5 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 905, action: "wall", disposable: true },
    },
    {
        position: { x: 0, y: 1, z: 66.5 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 905, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 1, z: 38.5 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 1, action: "camera", disposable: true },
    },

    {
        position: { x: 0, y: 1, z: 38.5 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 1234, action: "damage", disposable: true },
    },
    {
        position: { x: 0, y: 1, z: -1.5 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 12345, action: "damage", disposable: true },
    },
];
