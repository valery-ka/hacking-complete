import { useEffect } from "react";
import { Color3, Color4, Light, StandardMaterial } from "@babylonjs/core";
import { useEngineContext, useVersesContext } from "contexts";

const BACKGROUND_COLOR_1 = { r: 0.77, g: 0.74, b: 0.64, a: 1.0 };
const BACKGROUND_COLOR_2 = { r: 0.31, g: 0.3, b: 0.25, a: 1.0 };

export const useBabylonEnvironmentTransform = () => {
    const { engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const wireframeStates = new WeakMap();
        const originalColors = new WeakMap();
        const originalLightDiffuses = new WeakMap<Light, Color3>();

        let isWireframeActive = false;
        let isDefaultMaterialActive = false;
        let isEnvironmentActive = false;
        let originalClearColor: Color4 | null = null;

        const updateDisableEffectLayers = () => {
            const shouldDisable = isWireframeActive || isDefaultMaterialActive;

            if (
                scene?.metadata?.effects?.disable_effect_layers !== null &&
                scene?.metadata?.effects?.disable_effect_layers !== undefined
            ) {
                scene.metadata.effects.disable_effect_layers = shouldDisable;
            }
        };

        const applyWireframe = (enabled: boolean) => {
            isWireframeActive = enabled;

            scene.materials.forEach((material) => {
                if (!wireframeStates.has(material)) {
                    wireframeStates.set(material, material.wireframe);
                }

                material.wireframe = enabled ? true : wireframeStates.get(material);
            });

            updateDisableEffectLayers();
        };

        const applyDefaultMaterial = () => {
            isDefaultMaterialActive = true;

            scene.materials.forEach((material) => {
                if (material instanceof StandardMaterial) {
                    if (!originalColors.has(material)) {
                        originalColors.set(material, {
                            diffuseColor: material.diffuseColor?.clone(),
                            emissiveColor: material.emissiveColor?.clone(),
                        });
                    }

                    material.diffuseColor = new Color3(0.8, 0.77, 0.69);
                    material.emissiveColor = new Color3(0.8, 0.77, 0.69).scale(0.6);
                }
            });

            const { r, g, b, a } = BACKGROUND_COLOR_1;
            scene.clearColor = new Color4(r, g, b, a);

            updateDisableEffectLayers();
        };

        const restoreMaterials = () => {
            isDefaultMaterialActive = false;

            scene.materials.forEach((material) => {
                if (material instanceof StandardMaterial) {
                    const original = originalColors.get(material);
                    if (!original) return;

                    material.diffuseColor?.copyFrom(original.diffuseColor);
                    material.emissiveColor?.copyFrom(original.emissiveColor);
                }
            });

            const { r, g, b, a } = BACKGROUND_COLOR_2;
            scene.clearColor = new Color4(r, g, b, a);

            updateDisableEffectLayers();
        };

        const applyEnvironmentColor = (hex: string) => {
            const color = Color4.FromHexString(hex);

            if (!isEnvironmentActive) {
                originalClearColor = scene.clearColor.clone();
            }

            const getColorScaled = (color: Color4, factor: number) => {
                return new Color4(
                    color.r / factor,
                    color.g / factor,
                    color.b / factor,
                );
            }

            scene.lights.forEach((light) => {
                if (!originalLightDiffuses.has(light)) {
                    originalLightDiffuses.set(light, light.diffuse.clone());
                }
                light.diffuse.copyFrom(getColorScaled(color, 1));
            });

            scene.clearColor = getColorScaled(color, 10);

            const pp0 = scene?.metadata?.effects?.post_processes0;
            if (pp0) {
                pp0?.enableDistortionEffect();
                pp0?.enableToneMappingPostProcess(getColorScaled(color, 1), 1.0);
            };

            const pp1 = scene?.metadata?.effects?.post_processes1;
            if (pp1) {
                pp1?.enableDistortionEffect();
                pp1?.enableToneMappingPostProcess(getColorScaled(color, 1), 1.0);
            };

            isEnvironmentActive = true;
        };

        const restoreEnvironment = () => {
            if (!isEnvironmentActive) return;

            scene.lights.forEach((light) => {
                const original = originalLightDiffuses.get(light);
                if (original) {
                    light.diffuse.copyFrom(original);
                }
            });

            if (originalClearColor) {
                scene.clearColor.copyFrom(originalClearColor);
            }

            isEnvironmentActive = false;
            originalClearColor = null;
        };

        const applyEnvironmentForPool = (poolId: number) => {
            const environment = currentVerseConfig.effects?.environment;
            if (!environment || environment.pool !== poolId) return;

            applyEnvironmentColor(environment.color);
        };

        scene.metadata.callbacks ??= {};
        scene.metadata.callbacks = {
            ...scene.metadata.callbacks,
            apply_wireframe: (enabled: boolean) => applyWireframe(enabled),
            apply_default_material: () => applyDefaultMaterial(),
            restore_material: () => restoreMaterials(),
            apply_environment_for_pool: (poolId: number) => applyEnvironmentForPool(poolId),
            restore_environment: () => restoreEnvironment(),
        };

        const effects = currentVerseConfig.effects;

        if (effects.default) {
            applyDefaultMaterial();
        }

        if (effects.wire) {
            applyWireframe(true);
        }

        return () => {
            if (isWireframeActive) {
                applyWireframe(false);
            }
            if (isDefaultMaterialActive) {
                restoreMaterials();
            }
            if (isEnvironmentActive) {
                restoreEnvironment();
            }
        };
    }, [currentVerseConfig, restartKey]);
};
