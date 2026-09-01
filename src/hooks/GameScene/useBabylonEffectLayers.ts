import {
    AbstractEngine,
    GlowLayer,
    HighlightLayer,
    Observer,
    StandardMaterial,
    Color3,
} from "@babylonjs/core";
import { disposeEffectLayer } from "utils/babylon";

import { useEffect } from "react";
import { useEngineContext, useVersesContext } from "contexts";
import { REFERENCE_HEIGHT, REFERENCE_WIDTH } from "core_constants";
import { Nullable } from "types/common";

/** Blur settings tuned for REFERENCE_WIDTH × REFERENCE_HEIGHT. */
const GLOW_SUB_BLUR_KERNEL_SIZE_REF = 128;
const HIGHLIGHT_BLUR_SIZE_REF = 1.5;

const glowMeshNamePatterns = [
    "player-bullet",
    "enemy-bullet",
    "enemy-beam",
    "mini-sps-normal-red",
    "laser",
];
const glow2MeshNamePatterns = ["effective-glow"];

export const useBabylonEffectLayers = () => {
    const { engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const glowLayerPlayer1Main = new GlowLayer("glow-layer-player-1[0]", scene, {
            camera: scene.metadata.cameras[0],
        });
        glowLayerPlayer1Main.intensity = 0.4;

        glowLayerPlayer1Main.customEmissiveColorSelector = function (
            mesh,
            subMesh,
            material,
            result,
        ) {
            const shouldGlow = glowMeshNamePatterns.some((pattern) => mesh.name.includes(pattern));

            if (shouldGlow) {
                const bulmat = mesh.material as StandardMaterial;
                const color = bulmat?.emissiveColor || bulmat?.diffuseColor || Color3.White();
                result.set(color.r, color.g, color.b, 1);
            } else {
                result.set(0, 0, 0, 1);
            }
        };

        const glowLayerPlayer1Sub = new GlowLayer("glow-layer-player-1[1]", scene, {
            camera: scene.metadata.cameras[0],
        });
        glowLayerPlayer1Sub.intensity = 5.0;

        glowLayerPlayer1Sub.customEmissiveColorSelector = function (
            mesh,
            subMesh,
            material,
            result,
        ) {
            const shouldGlow = glow2MeshNamePatterns.some((pattern) => mesh.name.includes(pattern));

            if (shouldGlow) {
                const bulmat = mesh.material as StandardMaterial;
                const color = bulmat?.emissiveColor || bulmat?.diffuseColor || Color3.White();
                result.set(color.r, color.g, color.b, 1);
            } else {
                result.set(0, 0, 0, 1);
            }
        };

        const highlightLayerPlayer1 = new HighlightLayer("highlight-layer-player-1[0]", scene, {
            camera: scene.metadata.cameras[0],
        });
        highlightLayerPlayer1.innerGlow = false;

        let glowLayerPlayer2Main: Nullable<GlowLayer> = null;
        let glowLayerPlayer2Sub: Nullable<GlowLayer> = null;
        let highlightLayerPlayer2: Nullable<HighlightLayer> = null;

        if (scene.metadata.cameras[1]) {
            glowLayerPlayer2Main = new GlowLayer("glow-layer-player-2[0]", scene, {
                camera: scene.metadata.cameras[1],
            });
            glowLayerPlayer2Main.intensity = 0.4;

            glowLayerPlayer2Main.customEmissiveColorSelector = function (
                mesh,
                subMesh,
                material,
                result,
            ) {
                const shouldGlow = glowMeshNamePatterns.some((pattern) =>
                    mesh.name.includes(pattern),
                );

                if (shouldGlow) {
                    const bulmat = mesh.material as StandardMaterial;
                    const color = bulmat?.emissiveColor || bulmat?.diffuseColor || Color3.White();
                    result.set(color.r, color.g, color.b, 1);
                } else {
                    result.set(0, 0, 0, 1);
                }
            };

            glowLayerPlayer2Sub = new GlowLayer("glow-layer-player-2[1]", scene, {
                camera: scene.metadata.cameras[1],
            });
            glowLayerPlayer2Sub.intensity = 5.0;

            glowLayerPlayer2Sub.customEmissiveColorSelector = function (
                mesh,
                subMesh,
                material,
                result,
            ) {
                const shouldGlow = glow2MeshNamePatterns.some((pattern) =>
                    mesh.name.includes(pattern),
                );

                if (shouldGlow) {
                    const bulmat = mesh.material as StandardMaterial;
                    const color = bulmat?.emissiveColor || bulmat?.diffuseColor || Color3.White();
                    result.set(color.r, color.g, color.b, 1);
                } else {
                    result.set(0, 0, 0, 1);
                }
            };

            highlightLayerPlayer2 = new HighlightLayer("highlight-layer-player-2[0]", scene, {
                camera: scene.metadata.cameras[1],
            });
            highlightLayerPlayer2.innerGlow = false;
        }

        const applyResolutionScaledEffectLayerBlur = () => {
            const engine = scene.getEngine();
            const widthScale = engine.getRenderWidth() / REFERENCE_WIDTH;
            const heightScale = engine.getRenderHeight() / REFERENCE_HEIGHT;

            const scaledGlowBlurKernel = Math.max(
                1,
                Math.round(GLOW_SUB_BLUR_KERNEL_SIZE_REF * widthScale),
            );
            const scaledHighlightBlurH = HIGHLIGHT_BLUR_SIZE_REF * widthScale;
            const scaledHighlightBlurV = HIGHLIGHT_BLUR_SIZE_REF * heightScale;

            glowLayerPlayer1Sub.blurKernelSize = scaledGlowBlurKernel;
            highlightLayerPlayer1.blurHorizontalSize = scaledHighlightBlurH;
            highlightLayerPlayer1.blurVerticalSize = scaledHighlightBlurV;

            if (glowLayerPlayer2Sub && highlightLayerPlayer2) {
                glowLayerPlayer2Sub.blurKernelSize = scaledGlowBlurKernel;
                highlightLayerPlayer2.blurHorizontalSize = scaledHighlightBlurH;
                highlightLayerPlayer2.blurVerticalSize = scaledHighlightBlurV;
            }
        };

        applyResolutionScaledEffectLayerBlur();

        const resizeObserver: Nullable<Observer<AbstractEngine>> =
            scene.getEngine().onResizeObservable.add(() => {
                applyResolutionScaledEffectLayerBlur();
            });

        const effectsObserver = scene.onBeforeCameraRenderObservable.add((camera) => {
            const isDisabled = scene.metadata.effects.disable_effect_layers;

            glowLayerPlayer1Main.isEnabled = camera === scene.metadata.cameras[0] && !isDisabled;
            glowLayerPlayer1Sub.isEnabled = camera === scene.metadata.cameras[0] && !isDisabled;
            highlightLayerPlayer1.isEnabled = camera === scene.metadata.cameras[0] && !isDisabled;

            if (glowLayerPlayer2Main && glowLayerPlayer2Sub && highlightLayerPlayer2) {
                glowLayerPlayer2Main.isEnabled =
                    camera === scene.metadata.cameras[1] && !isDisabled;
                glowLayerPlayer2Sub.isEnabled = camera === scene.metadata.cameras[1] && !isDisabled;
                highlightLayerPlayer2.isEnabled =
                    camera === scene.metadata.cameras[1] && !isDisabled;
            }
        });

        scene.metadata.effects = {
            ...scene.metadata.effects,
            glow_layer_player_1_main: glowLayerPlayer1Main,
            glow_layer_player_1_sub: glowLayerPlayer1Sub,
            highlight_layer_player_1: highlightLayerPlayer1,
            glow_layer_player_2_main: glowLayerPlayer2Main,
            glow_layer_player_2_sub: glowLayerPlayer2Sub,
            highlight_layer_player_2: highlightLayerPlayer2,
            disable_effect_layers: false,
        };

        return () => {
            const layersToDispose = [
                glowLayerPlayer1Main,
                glowLayerPlayer1Sub,
                highlightLayerPlayer1,
                glowLayerPlayer2Main,
                glowLayerPlayer2Sub,
                highlightLayerPlayer2,
            ].filter(
                (layer): layer is NonNullable<typeof layer> =>
                    layer !== null && layer !== undefined,
            );

            const renderersToRemoveNames = layersToDispose.map((layer) => layer.name);

            scene.objectRenderers = scene.objectRenderers.filter((renderer) => {
                const isOrphaned = renderersToRemoveNames.some(
                    (name) => renderer.name === name || renderer.name.includes(name),
                );

                if (isOrphaned) {
                    if (renderer.dispose) {
                        renderer.dispose();
                    }
                    return false;
                }
                return true;
            });

            layersToDispose.forEach((layer) => {
                disposeEffectLayer(layer);
            });

            scene.onBeforeCameraRenderObservable.remove(effectsObserver);

            if (resizeObserver) {
                scene.getEngine().onResizeObservable.remove(resizeObserver);
            }
        };
    }, [currentVerseConfig, restartKey]);
};
