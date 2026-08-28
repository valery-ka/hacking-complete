import { EffectsConfig } from "types/effects/Effects.types";

export const effects: EffectsConfig = {
    stars: {
        amount: 50,
        inner_box_size: 25,
        outer_box_size: 100,
        min_box_height: -100,
        max_box_height: 100,
    },
    environment: {
        pool: 999,
        color: "#00ffff",
    },
};
