import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 0, y: 5.45, z: 136.5 },
        scale: { w: 30, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 10, action: "wall", disposable: true },
    },

    {
        position: { x: 0, y: 5.45, z: 115 },
        scale: { w: 60, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 10, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 5.45, z: 86.5 },
        scale: { w: 30, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 20, action: "wall", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: 86.5 },
        scale: { w: 30, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 20, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 5.45, z: 70 },
        scale: { w: 20, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 30, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 5.45, z: 46 },
        scale: { w: 30, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 35, action: "wall", disposable: true },
    },

    {
        position: { x: 14, y: 5.45, z: 40 },
        scale: { w: 5, h: 1, d: 20 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 80, action: "wall", disposable: true },
    },
    {
        position: { x: 14, y: 5.45, z: 40 },
        scale: { w: 5, h: 1, d: 20 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 80, action: "enemy", disposable: true },
    },
    {
        position: { x: -14, y: 5.45, z: 40 },
        scale: { w: 5, h: 1, d: 20 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 90, action: "wall", disposable: true },
    },
    {
        position: { x: -14, y: 5.45, z: 40 },
        scale: { w: 5, h: 1, d: 20 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 90, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 5.45, z: 26.5 },
        scale: { w: 30, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 40, action: "wall", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: 26.5 },
        scale: { w: 30, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 40, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 5.45, z: -10.5 },
        scale: { w: 30, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 50, action: "wall", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: -10.5 },
        scale: { w: 30, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 50, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 5.45, z: -17.5 },
        scale: { w: 30, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 60, action: "wall", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: -17.5 },
        scale: { w: 30, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 60, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 5.45, z: -49.5 },
        scale: { w: 30, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 70, action: "wall", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: -49.5 },
        scale: { w: 30, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 999, action: "enemy", disposable: true },
    },
];
