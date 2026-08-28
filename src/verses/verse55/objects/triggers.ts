import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 0, y: 5.45, z: -43.5 },
        scale: { w: 38.5, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 22, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: -43.5 },
        scale: { w: 38.5, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 22, action: "wall", disposable: true },
    },
];
