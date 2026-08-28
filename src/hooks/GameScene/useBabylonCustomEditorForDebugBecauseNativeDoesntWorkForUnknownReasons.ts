import { useEffect } from "react";
import {
    Nullable,
    TransformNode,
    PointerEventTypes,
    StandardMaterial,
    Texture,
} from "@babylonjs/core";

import { useEngineContext, useVersesContext } from "contexts";

const DISABLE = true;

export const useBabylonCustomEditorForDebugBecauseNativeDoesntWorkForUnknownReasons = () => {
    const { engineSceneRef } = useEngineContext();
    const { restartKey, currentVerseConfig } = useVersesContext();

    useEffect(() => {
        if (DISABLE) return;

        const scene = engineSceneRef.current;
        if (!scene) return;

        let selectedNode: Nullable<TransformNode> = null;

        const pointerObserver = scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
                const pickInfo = pointerInfo.pickInfo;

                if (pickInfo?.hit && pickInfo.pickedMesh) {
                    const mesh = pickInfo.pickedMesh;
                    const node = mesh.parent ?? mesh;

                    selectedNode = node as TransformNode;
                }
            }
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "2" || e.code !== "Digit2") return;

            selectedNode?.clone(
                `${selectedNode.name}_clone_${Date.now()}`,
                selectedNode.parent,
                true,
            );
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);

            if (pointerObserver) {
                scene.onPointerObservable.remove(pointerObserver);
            }

            selectedNode = null;
        };
    }, [restartKey, currentVerseConfig]);

    // useEffect(() => {
    //     if (DISABLE) return;

    //     const scene = engineSceneRef.current;
    //     if (!scene) return;

    //     const ground = scene.metadata.grounds[0];
    //     if (!ground) return;

    //     ground.material?.dispose();

    //     const material = new StandardMaterial("layout", scene);

    //     material.diffuseTexture = new Texture("/verse4.png", scene);

    //     material.diffuseTexture.uOffset = 0.255;
    //     material.diffuseTexture.vOffset = 0.24;

    //     material.diffuseTexture.uScale = 0.53;
    //     material.diffuseTexture.vScale = 0.53;

    //     ground.material = material;
    // }, [restartKey, currentVerseConfig]);

    useEffect(() => {
        if (DISABLE) return;

        const scene = engineSceneRef.current;
        if (!scene) return;

        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === "Digit3") {
                const meshes = scene.meshes;
                const wallConfigs: string[] = [];

                meshes.forEach((mesh) => {
                    if (
                        mesh.name.includes("wall-box") &&
                        !mesh.name.includes("lawa") &&
                        !mesh.name.includes("dark")
                    ) {
                        const pos = mesh.getAbsolutePosition();
                        const scale = mesh.scaling;

                        const x = Math.round(pos.x * 1000) / 1000;
                        const y = Math.round(pos.y * 1000) / 1000;
                        const z = Math.round(pos.z * 1000) / 1000;
                        const w = Math.round(scale.x * 1000) / 1000;
                        const h = Math.round(scale.y * 1000) / 1000;
                        const d = Math.round(scale.z * 1000) / 1000;

                        wallConfigs.push(
                            `    physicsWall({ x: ${x}, y: ${y}, z: ${z} }, { w: ${w}, h: ${h}, d: ${d} }),`,
                        );
                    }
                });

                if (wallConfigs.length > 0) {
                    const output = `export const walls: WallConfig[] = [\n${wallConfigs.join("\n")}\n];`;
                    console.log(output);
                    navigator.clipboard.writeText(output);
                }
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [restartKey, currentVerseConfig]);

    // useEffect(() => {
    //     if (DISABLE) return;

    //     const scene = engineSceneRef.current;
    //     if (!scene) return;

    //     const handleKeyPress = (e: KeyboardEvent) => {
    //         if (e.code === "Digit3") {
    //             const meshes = scene.meshes;
    //             const wallConfigs: string[] = [];

    //             let delay = 0.0;

    //             meshes.forEach((mesh) => {
    //                 if (mesh.name.includes("model-2")) {
    //                     const pos = mesh.getAbsolutePosition();
    //                     const rot = mesh.rotationQuaternion?.toEulerAngles() ?? mesh.rotation;

    //                     const x = Math.round(pos.x * 1000) / 1000;
    //                     const y = Math.round(pos.y * 1000) / 1000;
    //                     const z = Math.round(pos.z * 1000) / 1000;

    //                     const rotY = rot.y;

    //                     wallConfigs.push(
    //                         `    enemyArrowShield({ x: ${x}, y: ${y}, z: ${z} }, ${Math.round(rotY * 1000) / 1000}, ${delay}),`,
    //                     );

    //                     delay += 0.25;
    //                 }
    //             });

    //             if (wallConfigs.length > 0) {
    //                 const output = `export const enemies: EnemyConfig[] = [\n${wallConfigs.join("\n")}\n];`;
    //                 console.log(output);
    //                 navigator.clipboard.writeText(output);
    //             }
    //         }
    //     };

    //     window.addEventListener("keydown", handleKeyPress);

    //     return () => {
    //         window.removeEventListener("keydown", handleKeyPress);
    //     };
    // }, [restartKey, currentVerseConfig]);
};
