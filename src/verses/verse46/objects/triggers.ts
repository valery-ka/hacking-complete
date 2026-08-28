import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 0, y: 5.75, z: -16.6 },
        scale: { w: 20, h: 1.5, d: 3.5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 0, action: "enemy", disposable: true },
    },
];
