import { useEffect } from "react";
import { Color4 } from "@babylonjs/core";

import { useEngineContext, useVersesContext } from "contexts";

import { Light } from "core/engine/Light";

import { SupportedLight } from "types/engine/Light.types";
import { applyEmissiveColorFactor } from "utils/babylon";

const DEFAULT_CLEAR_COLOR = { r: 0.31, g: 0.3, b: 0.25, a: 1.0 };

export const useBabylonLight = () => {
    const { engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const { r, g, b, a } = DEFAULT_CLEAR_COLOR;
        scene.clearColor = new Color4(r, g, b, a);

        const lightsConfig = currentVerseConfig.light;
        const light = new Light(scene);

        light.setup(lightsConfig);

        return () => {
            light.dispose();
        };
    }, [currentVerseConfig, restartKey]);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const light = scene.lights[0] as SupportedLight;

        const playerAssets = scene.metadata.player_assets;
        if (playerAssets) {
            const lightMaterial = playerAssets.light_material;
            const darkMaterial = playerAssets.dark_material;

            applyEmissiveColorFactor(light, lightMaterial);
            applyEmissiveColorFactor(light, darkMaterial);
        }

        const wallAssets = scene.metadata.wall_assets;
        if (wallAssets) {
            const boxWallBaseMaterial = wallAssets.box_wall_base.material;
            const boxWallDarkMaterial = wallAssets.box_wall_dark.material;
            const boxWallLightMaterial = wallAssets.box_wall_light.material;
            const boxWallUiMaterial = wallAssets.box_wall_ui.material;
            const cylinderWallDarkMaterial = wallAssets.cylinder_wall_dark.material;
            const cylinderWallLightMaterial = wallAssets.cylinder_wall_light.material;

            applyEmissiveColorFactor(light, boxWallBaseMaterial);
            applyEmissiveColorFactor(light, boxWallDarkMaterial);
            applyEmissiveColorFactor(light, boxWallLightMaterial);
            applyEmissiveColorFactor(light, boxWallUiMaterial);
            applyEmissiveColorFactor(light, cylinderWallDarkMaterial);
            applyEmissiveColorFactor(light, cylinderWallLightMaterial);
        }

        const enemyAssets = scene.metadata.enemy_assets;
        if (enemyAssets) {
            const factor = scene.metadata.verse_settings.emimissive_color_factor;

            const lightMaterial = enemyAssets.light_material;
            const darkMaterial = enemyAssets.dark_material;
            const slightlyDarkMaterial = enemyAssets.slightly_dark_material;
            const blackMaterial = enemyAssets.black_material;

            applyEmissiveColorFactor(light, lightMaterial, true, factor);
            applyEmissiveColorFactor(light, darkMaterial, true, factor);
            applyEmissiveColorFactor(light, slightlyDarkMaterial, true, factor);
            applyEmissiveColorFactor(light, blackMaterial, true, factor);
        }
    }, [currentVerseConfig, restartKey]);
};
