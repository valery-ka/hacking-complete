import { Scene, Color3 } from "@babylonjs/core";
import { getLightType } from "utils/babylon";

import * as LightTypes from "types/engine/Light.types";

export class Light {
    private scene: Scene;
    public lights: LightTypes.SupportedLight[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public create(config: LightTypes.LightConfig) {
        const { position, target, intensity, castShadow } = config;

        const light = getLightType(this.scene, config, position, target);

        light.intensity = intensity;
        light.specular = new Color3(0, 0, 0);
        light.shadowEnabled = !!castShadow;

        setTimeout(() => {
            if (config.parentName) {
                const parent = this.scene.getNodeByName(config.parentName);
                parent ? (light.parent = parent) : console.warn("ты детдомовский");
            }
        }, 100);

        light.metadata = { ...light.metadata, config: config };

        this.lights.push(light);

        return light;
    }

    public setup(configs: LightTypes.LightConfig[] = []) {
        const meta: any = { lights: [] };

        configs.forEach((config) => {
            const light = this.create(config);
            meta.lights.push(light);
        });

        this.scene.metadata = {
            ...this.scene.metadata,
            ...meta,
        };
    }

    public dispose() {
        this.lights.forEach((light) => light.dispose());
        this.lights = [];
    }
}
