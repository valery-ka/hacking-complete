import { Effect, Mesh, VertexData } from "@babylonjs/core";

import { useEffect, useRef } from "react";
import { useEngineContext } from "contexts";

// import * as PlayerVertexData from "assets/models/player/PlayerVertexData";

interface PerformanceMemory {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
    memory?: PerformanceMemory;
}

export const useWhatever = () => {
    const { engineSceneRef } = useEngineContext();

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const initialMemoryRef = useRef({
        usedMB: 0,
        totalMB: 0,
        limitMB: 0,
    });

    // useEffect(() => {
    //     const scene = engineSceneRef.current;
    //     if (!scene) return;

    //     const perf = performance as PerformanceWithMemory;
    //     if (perf.memory) {
    //         initialMemoryRef.current = {
    //             usedMB: Math.round(perf.memory.usedJSHeapSize / 1024 / 1024),
    //             totalMB: Math.round(perf.memory.totalJSHeapSize / 1024 / 1024),
    //             limitMB: Math.round(perf.memory.jsHeapSizeLimit / 1024 / 1024),
    //         };
    //     }

    //     const monitorMemory = () => {
    //         try {
    //             const engine = scene.getEngine();

    //             const textureCacheSize = engine._internalTexturesCache?.length || 0;
    //             // console.log("Texture cache size:", textureCacheSize);

    //             const shaderCount = Object.keys(Effect.ShadersStore || {}).length;
    //             // console.log("Shader count:", shaderCount);

    //             const perf = performance as PerformanceWithMemory;
    //             if (perf.memory) {
    //                 const usedMB = Math.round(perf.memory.usedJSHeapSize / 1024 / 1024);
    //                 const totalMB = Math.round(perf.memory.totalJSHeapSize / 1024 / 1024);
    //                 const limitMB = Math.round(perf.memory.jsHeapSizeLimit / 1024 / 1024);

    //                 // console.log("Memory used:", usedMB + "MB");
    //                 // console.log("Memory total:", totalMB + "MB");
    //                 // console.log("Memory limit:", limitMB + "MB");
    //                 // console.log("Memory usage:", Math.round((usedMB / limitMB) * 100) + "%");
    //             }

    //             // console.log("Scene textures:", scene.textures?.length || 0);
    //             // console.log("Scene materials:", scene.materials?.length || 0);
    //             // console.log("Scene meshes:", scene.meshes?.length || 0);
    //             // console.log("---");
    //         } catch (error) {
    //             console.error("Memory monitoring error:", error);
    //         }
    //     };

    //     intervalRef.current = setInterval(monitorMemory, 3000);

    //     monitorMemory();

    //     return () => {
    //         if (intervalRef.current) {
    //             clearInterval(intervalRef.current);
    //             intervalRef.current = null;
    //         }

    //         const perf = performance as PerformanceWithMemory;
    //         let finalUsedMB = 0;
    //         let finalTotalMB = 0;
    //         let finalLimitMB = 0;

    //         if (perf.memory) {
    //             finalUsedMB = Math.round(perf.memory.usedJSHeapSize / 1024 / 1024);
    //             finalTotalMB = Math.round(perf.memory.totalJSHeapSize / 1024 / 1024);
    //             finalLimitMB = Math.round(perf.memory.jsHeapSizeLimit / 1024 / 1024);
    //         }

    //         const diffUsed = finalUsedMB - initialMemoryRef.current.usedMB;
    //         const diffTotal = finalTotalMB - initialMemoryRef.current.totalMB;
    //         const diffLimit = finalLimitMB - initialMemoryRef.current.limitMB;

    //         console.table([
    //             {
    //                 Metric: "Used Memory (MB)",
    //                 Before: initialMemoryRef.current.usedMB,
    //                 After: finalUsedMB,
    //                 Difference: diffUsed,
    //             },
    //             {
    //                 Metric: "Total Memory (MB)",
    //                 Before: initialMemoryRef.current.totalMB,
    //                 After: finalTotalMB,
    //                 Difference: diffTotal,
    //             },
    //             {
    //                 Metric: "Limit Memory (MB)",
    //                 Before: initialMemoryRef.current.limitMB,
    //                 After: finalLimitMB,
    //                 Difference: diffLimit,
    //             },
    //         ]);

    //         console.log("Memory monitor cleaned up");
    //     };
    // }, []);

    // useEffect(() => {
    //     const scene = engineSceneRef.current;
    //     if (!scene) return;

    //     const createMeshPart = (
    //         meshName: string,
    //         vertexData: { positions: number[]; indices: number[] },
    //         baseName: string,
    //     ) => {
    //         const mesh = new Mesh(`${baseName}-${meshName}-from-vertex`, scene);

    //         const positions = vertexData.positions;
    //         const indices = vertexData.indices;
    //         const normals: number[] = [];

    //         const vertexDataObj = new VertexData();
    //         VertexData.ComputeNormals(positions, indices, normals);

    //         vertexDataObj.positions = positions;
    //         vertexDataObj.indices = indices;
    //         vertexDataObj.normals = normals;

    //         vertexDataObj.applyToMesh(mesh);

    //         mesh.position.y = 6;
    //         mesh.flipFaces(true);

    //         const clonedMesh = mesh.clone(`${baseName + 1}-${meshName}-from-vertex`);
    //         clonedMesh.scaling.x = -1;

    //         return { mesh, clonedMesh };
    //     };

    //     // Создаем все части меша
    //     createMeshPart("core", PlayerVertexData.CORE_LEFT_VERTEX, "00");
    //     createMeshPart("box", PlayerVertexData.BOX_LEFT_VERTEX, "00");
    //     createMeshPart("upper-body", PlayerVertexData.UPPER_BODY_LEFT_VERTEX, "00");
    // }, []);
};
