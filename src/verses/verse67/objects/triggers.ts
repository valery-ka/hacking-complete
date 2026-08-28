import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

const RADIUS = 17.5;

export function generateTriggerOnCylinder(
    longitudeRad: number,
    pool: number,
): InvisibleTriggerConfig {
    const longitude = longitudeRad;
    const longitudeDeg = (longitude * 180) / Math.PI;

    const x = RADIUS * Math.cos(longitude);
    const z = RADIUS * Math.sin(longitude);

    const tangentAngle = longitudeDeg + 90;

    return {
        position: { x: x, y: 0, z: z },
        scale: { w: 3.5, h: 12.25, d: 5 },
        rotation: { x: 0, y: tangentAngle, z: 0 },
        trigger: { pool: pool, action: "enemy", disposable: true },
    };
}

export const triggers: InvisibleTriggerConfig[] = [
    generateTriggerOnCylinder(Math.PI / 4 + (3 * Math.PI) / 2, 0),
    generateTriggerOnCylinder(Math.PI / 4, 11),
    generateTriggerOnCylinder(Math.PI / 4 + Math.PI / 2, 21),
    generateTriggerOnCylinder(Math.PI / 4 + Math.PI, 31),
];
