import { WallConfig } from "types/static/Wall.types";
import { SURFACE_SETTINGS } from "./settings";

function getRandomCooldown(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const RADIUS = 7;

export const walls: WallConfig[] = [
    {
        type: "box",
        position: { x: 7, y: 10.85, z: 7 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: true,
        animation: {
            name: "circle",
            plane: "xz",
            radius: RADIUS,
            frames: 120,
            speed: -50,
            delay: [getRandomCooldown(2500, 3500), getRandomCooldown(1000, 2000)],
        },
    },
    {
        type: "box",
        position: { x: -7, y: 10.85, z: -7 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: true,
        animation: {
            name: "circle",
            plane: "xz",
            radius: RADIUS,
            frames: 120,
            speed: 50,
            delay: [getRandomCooldown(2500, 3500), getRandomCooldown(1000, 2000)],
        },
    },
    {
        type: "box",
        position: { x: -7, y: 10.85, z: 7 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: true,
        animation: {
            name: "circle",
            plane: "xz",
            radius: RADIUS,
            frames: 120,
            speed: 50,
            delay: [getRandomCooldown(2500, 3500), getRandomCooldown(1000, 2000)],
        },
    },
    {
        type: "box",
        position: { x: 7, y: 10.85, z: -7 },
        size: { w: 1.5, h: 1.5, d: 1.5 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: true,
        animation: {
            name: "circle",
            plane: "xz",
            radius: RADIUS,
            frames: 120,
            speed: -50,
            delay: [getRandomCooldown(2500, 3500), getRandomCooldown(1000, 2000)],
        },
    },

    //
    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: 15.5 },
        size: { w: SURFACE_SETTINGS.w + 10, h: 10, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 0, y: 10, z: -15.5 },
        size: { w: SURFACE_SETTINGS.w + 10, h: 10, d: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },

    {
        type: "box-invisible",
        position: { x: 15.5, y: 10, z: 0 },
        size: { w: 1, h: 10, d: SURFACE_SETTINGS.d + 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: -15.5, y: 10, z: 0 },
        size: { w: 1, h: 10, d: SURFACE_SETTINGS.d + 10 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
    },
];
