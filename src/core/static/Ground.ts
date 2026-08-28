import { Scene, StandardMaterial, Color3, Vector3, Quaternion, Mesh } from "@babylonjs/core";

import { GroundConfig } from "types/static/Ground.types";

import { deg2rad } from "utils/math";
import { createShapeByType, applyEmissiveColorFactor } from "utils/babylon";

export class Ground {
    private scene: Scene;
    private grounds: Mesh[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public create(configs: GroundConfig[]) {
        const light_static = this.scene.metadata.lights[0];

        configs.forEach((config, index) => {
            const { position, rotation, color, disable_receive_shadows } = config;

            const ground = createShapeByType(this.scene, config, "ground", index);

            ground.receiveShadows = !disable_receive_shadows;

            ground.position = new Vector3(position.x, position.y, position.z);
            ground.rotationQuaternion = Quaternion.FromEulerAngles(
                deg2rad(rotation.x),
                deg2rad(rotation.y),
                deg2rad(rotation.z),
            );

            const material = new StandardMaterial(`ground-material-${index}`, this.scene);
            material.diffuseColor = new Color3(color.r, color.g, color.b);
            material.alpha = color.a;
            material.backFaceCulling = false;
            material.separateCullingPass = true;

            applyEmissiveColorFactor(light_static, material);

            ground.material = material;
            this.grounds.push(ground);

            if (config.disabled) ground.setEnabled(false);
        });

        this.scene.metadata = { ...this.scene.metadata, grounds: this.grounds };
    }

    public dispose() {
        this.grounds.forEach((ground) => {
            ground.material?.dispose();
            ground.dispose();
        });
        this.grounds = [];
    }
}
