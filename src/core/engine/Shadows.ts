import { Scene, ShadowGenerator, DirectionalLight, SpotLight, PointLight } from "@babylonjs/core";

import { Nullable } from "types/common";
import * as ShadowTypes from "types/engine/Shadows.types";
import * as LightTypes from "types/engine/Light.types";

export class Shadows {
    private scene: Scene;
    private generators: ShadowGenerator[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public create(config: ShadowTypes.ShadowsConfig) {
        const { orthoBounds, staticMapSize, dynamicMapSize, blurKernel, blurScale } = config;

        const createStaticShadow = (
            light: LightTypes.SupportedLight,
        ): Nullable<ShadowGenerator> => {
            if (!light?.shadowEnabled) return null;

            let generator: Nullable<ShadowGenerator> = null;

            if (light instanceof DirectionalLight) {
                light.autoUpdateExtends = false;
                light.autoCalcShadowZBounds = false;
                light.orthoLeft = -orthoBounds;
                light.orthoRight = orthoBounds;
                light.orthoTop = orthoBounds;
                light.orthoBottom = -orthoBounds;

                generator = new ShadowGenerator(staticMapSize, light);
                generator.useBlurExponentialShadowMap = true;
            } else if (light instanceof SpotLight) {
                generator = new ShadowGenerator(staticMapSize, light);
                generator.useBlurExponentialShadowMap = true;
            } else if (light instanceof PointLight) {
                generator = new ShadowGenerator(staticMapSize, light);
                generator.useKernelBlur = true;
            }

            if (generator) {
                generator.useKernelBlur = true;
                generator.blurKernel = blurKernel;
                generator.blurScale = blurScale;

                this.generators.push(generator);
                this.scene.metadata.shadows.push(generator);
            }

            (generator as any).metadata = { config };

            return generator;
        };

        const createDynamicShadow = (
            light: LightTypes.SupportedLight,
        ): Nullable<ShadowGenerator> => {
            if (!light?.shadowEnabled) return null;

            let generator: Nullable<ShadowGenerator> = null;

            if (light instanceof DirectionalLight) {
                light.autoCalcShadowZBounds = true;
                generator = new ShadowGenerator(dynamicMapSize, light);
            } else if (light instanceof SpotLight) {
                generator = new ShadowGenerator(dynamicMapSize, light);
            } else if (light instanceof PointLight) {
                generator = new ShadowGenerator(dynamicMapSize, light);
            }

            if (generator) {
                generator.bias = 0.0001;
                generator.normalBias = 0.01;
                (generator as any)._darkness = -250;

                this.scene.metadata = { ...this.scene.metadata, shadows_dynamic: generator };
                this.generators.push(generator);
                this.scene.metadata.shadows.push(generator);
            }

            (generator as any).metadata = { config };

            return generator;
        };

        const lights = this.scene.metadata.lights;

        lights.forEach((light: LightTypes.SupportedLight) => {
            const shadowType = light?.metadata?.config?.shadowType;

            switch (shadowType) {
                case "static":
                    createStaticShadow(light);
                    break;
                case "dynamic":
                    createDynamicShadow(light);
                    break;
                default:
                    break;
            }
        });
    }

    public dispose() {
        for (const generator of this.generators) {
            generator.dispose();
        }

        if (this.scene.metadata?.shadows) {
            this.scene.metadata.shadows = this.scene.metadata.shadows.filter(
                (g: ShadowGenerator) => !this.generators.includes(g),
            );
        }

        if (
            this.scene.metadata?.shadows_dynamic &&
            this.generators.includes(this.scene.metadata.shadows_dynamic)
        ) {
            delete this.scene.metadata.shadows_dynamic;
        }

        this.generators.length = 0;
    }
}
