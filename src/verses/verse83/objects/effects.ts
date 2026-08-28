import { EffectsConfig } from "types/effects/Effects.types";

export const effects: EffectsConfig = {
    stars: {
        amount: 100,
        inner_box_size: 35,
        outer_box_size: 100,
        min_box_height: -150,
        max_box_height: 50,
    },
    wire: true,
    default: true,
};
