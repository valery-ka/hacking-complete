import * as BABYLON from "@babylonjs/core";

import * as LightTypes from "types/engine/Light.types";
import * as GroundTypes from "types/static/Ground.types";
import * as WallTypes from "types/static/Wall.types";

export function applyEmissiveColorFactor(
    light: LightTypes.SupportedLight,
    material: BABYLON.StandardMaterial,
    isEnemy: boolean = false,
    multiplier: number = 0.7,
) {
    const lightIntensity = light.intensity;
    const diffuseColor = material.diffuseColor;

    if (light instanceof BABYLON.HemisphericLight || light instanceof BABYLON.DirectionalLight) {
        material.emissiveColor = new BABYLON.Color3(
            (1 - lightIntensity) * diffuseColor.r,
            (1 - lightIntensity) * diffuseColor.g,
            (1 - lightIntensity) * diffuseColor.b,
        ).scale(isEnemy ? multiplier : 1.0);
    } else if (light instanceof BABYLON.PointLight) {
        material.emissiveColor = new BABYLON.Color3(
            ((1 - lightIntensity) * diffuseColor.r) / 2,
            ((1 - lightIntensity) * diffuseColor.g) / 2,
            ((1 - lightIntensity) * diffuseColor.b) / 2,
        );
    } else if (light instanceof BABYLON.SpotLight) {
        material.emissiveColor = new BABYLON.Color3(0, 0, 0);
    }
}

export function getLightType(
    scene: BABYLON.Scene,
    config: LightTypes.LightConfig,
    position: LightTypes.Position,
    target: LightTypes.Target,
) {
    let light: LightTypes.SupportedLight;

    if (config.type === "directional") {
        light = new BABYLON.DirectionalLight(
            `directional-light-${config.name}`,
            new BABYLON.Vector3(target.x, target.y, target.z),
            scene,
        );
        light.position = new BABYLON.Vector3(position.x, position.y, position.z);
    } else if (config.type === "spot") {
        light = new BABYLON.SpotLight(
            `spot-light-${config.name}`,
            new BABYLON.Vector3(position.x, position.y, position.z),
            new BABYLON.Vector3(target.x, target.y, target.z),
            Math.PI / 2,
            1,
            scene,
        );
        light.angle = Math.PI / 2;
    } else if (config.type === "point") {
        light = new BABYLON.PointLight(
            `point-light-${config.name}`,
            new BABYLON.Vector3(target.x, target.y, target.z),
            scene,
        );
    } else {
        light = new BABYLON.HemisphericLight(
            `hemispheric-light-${config.name}`,
            new BABYLON.Vector3(target.x, target.y, target.z),
            scene,
        );
    }

    return light;
}

export function createShapeByType(
    scene: BABYLON.Scene,
    config: GroundTypes.GroundConfig | WallTypes.WallConfig,
    object: string,
    index: number,
) {
    let shape: BABYLON.Mesh;

    if (config.type === "cylinder") {
        shape = BABYLON.MeshBuilder.CreateCylinder(
            `${object}-cylinder-${index}`,
            {
                height: config.size.h,
                diameter: config.size.d,
                tessellation: 128,
            },
            scene,
        );
    } else if (config.type === "dodecagon") {
        shape = BABYLON.MeshBuilder.CreateCylinder(
            `${object}-cylinder-${index}`,
            {
                height: config.size.h,
                diameter: config.size.d,
                tessellation: 12,
            },
            scene,
        );
    } else if (config.type === "polygon") {
        shape = BABYLON.MeshBuilder.CreateCylinder(
            `${object}-polygon-${index}`,
            {
                height: config.size.h,
                diameter: config.size.d,
                tessellation: config.edges,
            },
            scene,
        );
    } else if (config.type === "box") {
        shape = BABYLON.MeshBuilder.CreateBox(`${object}-rectangle-${index}`, {}, scene);
        shape.scaling = new BABYLON.Vector3(config.size.w, config.size.h, config.size.d);
    } else if (config.type === "sphere") {
        shape = BABYLON.MeshBuilder.CreateIcoSphere(
            `${object}-sphere-${index}`,
            {
                radiusX: config.size.w / 2,
                radiusY: config.size.h / 2,
                radiusZ: config.size.d / 2,
                subdivisions: config.subdivisions,
            },
            scene,
        );
    } else {
        shape = BABYLON.MeshBuilder.CreateBox("unknown-type");
    }

    return shape;
}

export function getProjectedBoundingBox(
    mesh: BABYLON.Mesh,
    scene: BABYLON.Scene,
    camera: BABYLON.Camera,
    engine: BABYLON.Engine,
) {
    if (!mesh || !scene || !camera || !engine) {
        return { center: new BABYLON.Vector2(0, 0), radius: new BABYLON.Vector2(0, 0) };
    }

    const bbox = mesh.getBoundingInfo().boundingBox;
    const vertices = bbox.vectorsWorld;

    const projectedVerts = vertices.map((v) =>
        BABYLON.Vector3.Project(
            v,
            BABYLON.Matrix.Identity(),
            scene.getTransformMatrix(),
            camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight()),
        ),
    );

    const minX = Math.min(...projectedVerts.map((p) => p.x));
    const maxX = Math.max(...projectedVerts.map((p) => p.x));
    const minY = Math.min(...projectedVerts.map((p) => p.y));
    const maxY = Math.max(...projectedVerts.map((p) => p.y));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const radiusX = (maxX - minX) / 2;
    const radiusY = (maxY - minY) / 2;

    const center = new BABYLON.Vector2(centerX, engine.getRenderHeight() - centerY);
    const radius = new BABYLON.Vector2(radiusX, radiusY);

    return { center, radius };
}

export function createWireCube(
    scene: BABYLON.Scene,
    { size = 1, thickness = 0.06, color = new BABYLON.Color3(1, 0, 0), name = "wire-cube" } = {},
) {
    const half = size / 2;

    const edges = [
        [new BABYLON.Vector3(-half, -half, -half), new BABYLON.Vector3(half, -half, -half)],
        [new BABYLON.Vector3(half, -half, -half), new BABYLON.Vector3(half, -half, half)],
        [new BABYLON.Vector3(half, -half, half), new BABYLON.Vector3(-half, -half, half)],
        [new BABYLON.Vector3(-half, -half, half), new BABYLON.Vector3(-half, -half, -half)],

        [new BABYLON.Vector3(-half, half, -half), new BABYLON.Vector3(half, half, -half)],
        [new BABYLON.Vector3(half, half, -half), new BABYLON.Vector3(half, half, half)],
        [new BABYLON.Vector3(half, half, half), new BABYLON.Vector3(-half, half, half)],
        [new BABYLON.Vector3(-half, half, half), new BABYLON.Vector3(-half, half, -half)],

        [new BABYLON.Vector3(-half, -half, -half), new BABYLON.Vector3(-half, half, -half)],
        [new BABYLON.Vector3(half, -half, -half), new BABYLON.Vector3(half, half, -half)],
        [new BABYLON.Vector3(half, -half, half), new BABYLON.Vector3(half, half, half)],
        [new BABYLON.Vector3(-half, -half, half), new BABYLON.Vector3(-half, half, half)],
    ];

    const tubes = edges.map((points, i) => {
        const tube = BABYLON.MeshBuilder.CreateTube(
            `${name}_edge_${i}`,
            { path: points, radius: thickness, tessellation: 6 },
            scene,
        );
        return tube;
    });

    const merged = BABYLON.Mesh.MergeMeshes(tubes, true, true, undefined, false, true);

    if (!merged) {
        throw new Error("Failed to merge wire cube meshes");
    }

    merged.name = name;
    merged.material?.dispose();

    return merged;
}

export function isInsideRotatedBox(playerPos: BABYLON.Vector3, box: BABYLON.Mesh) {
    const invWorld = BABYLON.Matrix.Invert(box.getWorldMatrix());
    const localPos = BABYLON.Vector3.TransformCoordinates(playerPos, invWorld);

    const halfSize = box.getBoundingInfo().boundingBox.extendSize;

    return (
        localPos.x >= -halfSize.x &&
        localPos.x <= halfSize.x &&
        localPos.y >= -halfSize.y &&
        localPos.y <= halfSize.y &&
        localPos.z >= -halfSize.z &&
        localPos.z <= halfSize.z
    );
}

export function getLocalYRotation(node: BABYLON.TransformNode): number {
    if (node.rotationQuaternion) {
        const euler = node.rotationQuaternion.toEulerAngles();
        return euler.y;
    } else if (node.rotation) {
        return node.rotation.y;
    } else {
        return 0;
    }
}

export function getLocalRotation(node: BABYLON.TransformNode): BABYLON.Vector3 {
    if (node.rotationQuaternion) {
        const euler = node.rotationQuaternion.toEulerAngles();
        return euler;
    } else if (node.rotation) {
        return node.rotation;
    } else {
        return BABYLON.Vector3.Zero();
    }
}

export function getWorldOffset(
    localOffset: BABYLON.Vector3,
    position: BABYLON.Vector3,
    rotation: BABYLON.Vector3,
): BABYLON.Vector3 {
    const quaternion = BABYLON.Quaternion.FromEulerAngles(rotation.x, rotation.y, rotation.z);
    const parentMatrix = BABYLON.Matrix.Compose(BABYLON.Vector3.One(), quaternion, position);
    return BABYLON.Vector3.TransformCoordinates(localOffset, parentMatrix);
}

export function addCallbacks(node: BABYLON.TransformNode, newCallbacks: Record<string, Function>) {
    const oldCallbacks = node.metadata?.callbacks ?? {};

    node.metadata = {
        ...node.metadata,
        callbacks: {
            ...oldCallbacks,
            ...newCallbacks,
        },
    };
}

export const captureUIScene = async (
    engine: BABYLON.Engine,
    camera: BABYLON.Camera,
): Promise<BABYLON.Texture> => {
    return new Promise((resolve) => {
        BABYLON.Tools.CreateScreenshotUsingRenderTarget(
            engine,
            camera,
            { width: engine.getRenderWidth(), height: engine.getRenderHeight() },
            (data) => {
                const tex = new BABYLON.Texture(data, engine, false, false);
                resolve(tex);
            },
        );
    });
};

/** Drops the freeze-frame Texture + its base64 url from the shared engine cache. */
export function disposeMenuTexture(ref: { current: BABYLON.Texture | null }) {
    const texture = ref.current;
    if (!texture) return;

    ref.current = null;
    texture.dispose();
}

/** Replace the previous screenshot so old data: URLs cannot stack in heap. */
export function assignMenuTexture(ref: { current: BABYLON.Texture | null }, texture: BABYLON.Texture) {
    disposeMenuTexture(ref);
    ref.current = texture;
}

/**
 * Babylon 8.55 UtilityLayerRenderer.dispose() removes `_afterRenderObserver` from
 * `onAfterCameraRenderObservable`, but the observer was added to
 * `onAfterRenderCameraObservable`. The orphaned observer keeps the layer (+ its
 * virtual scene / ADT / meshes) alive across verse restarts.
 *
 * Call this instead of `layer.dispose()`. Dispose ADT/UI *before* this.
 */
export function disposeUtilityLayer(layer: BABYLON.UtilityLayerRenderer) {
    const observer = (layer as any)._afterRenderObserver as BABYLON.Nullable<BABYLON.Observer<BABYLON.Camera>>;
    const original = layer.originalScene;

    if (observer && original) {
        original.onAfterRenderCameraObservable.remove(observer);
        original.onAfterCameraRenderObservable.remove(observer);
        (layer as any)._afterRenderObserver = null;
    }

    layer.dispose();
}

function forEachLayerMeshEntry(
    map: Record<string, { mesh?: BABYLON.AbstractMesh } | BABYLON.AbstractMesh> | undefined,
    visit: (mesh: BABYLON.AbstractMesh) => void,
) {
    if (!map) return;

    for (const value of Object.values(map)) {
        const mesh = (value as { mesh?: BABYLON.AbstractMesh })?.mesh ?? value;
        if (mesh && typeof (mesh as BABYLON.AbstractMesh).uniqueId === "number") {
            visit(mesh as BABYLON.AbstractMesh);
        }
    }
}

/**
 * Unregister highlighted / excluded meshes from Glow/Highlight maps, then dispose.
 * Leaving maps populated keeps source meshes (e.g. player-bullet-mesh-*) alive.
 */
export function disposeEffectLayer(
    layer: BABYLON.Nullable<BABYLON.GlowLayer | BABYLON.HighlightLayer>,
) {
    if (!layer) return;

    const anyLayer = layer as any;

    forEachLayerMeshEntry(anyLayer._meshes, (mesh) => {
        try {
            anyLayer.removeMesh?.(mesh);
        } catch {
            // mesh or layer already tearing down
        }
    });

    forEachLayerMeshEntry(anyLayer._excludedMeshes, (mesh) => {
        try {
            anyLayer.removeExcludedMesh?.(mesh);
        } catch {
            // mesh or layer already tearing down
        }
    });

    forEachLayerMeshEntry(anyLayer._includedOnlyMeshes, (mesh) => {
        try {
            anyLayer.removeIncludedOnlyMesh?.(mesh);
        } catch {
            // mesh or layer already tearing down
        }
    });

    layer.dispose();
}

export function disposeLeftoverCameraPostProcesses(camera: BABYLON.Nullable<BABYLON.Camera>) {
    if (!camera || camera.isDisposed?.()) return;

    const attached = [
        ...((camera as any)._postProcesses ?? []),
        ...((camera as any)._postProcessesTaken ?? []),
    ].filter(Boolean) as BABYLON.PostProcess[];

    for (const pp of [...new Set(attached)]) {
        try {
            camera.detachPostProcess(pp);
        } catch {
            // already detached
        }
        try {
            pp.dispose(camera);
        } catch {
            // already disposed
        }
    }
}

export const sanitizeMetadata = (md: any) => {
    if (!md || typeof md !== "object") return;

    if (md.callbacks && typeof md.callbacks === "object") {
        Object.keys(md.callbacks).forEach((k) => {
            md.callbacks[k] = null;
        });
        md.callbacks = null;
    }

    Object.keys(md).forEach((key) => {
        const v = md[key];
        if (typeof v === "function") {
            md[key] = null;
        }
    });
};

export function syncColliderPhysics(collider: BABYLON.Nullable<BABYLON.Mesh>, position?: BABYLON.Vector3) {
    if (!collider) return;

    if (position) {
        collider.position.copyFrom(position);
    }

    const impostor = collider.physicsImpostor;
    if (!impostor) return;

    impostor.forceUpdate();
    impostor.setLinearVelocity(BABYLON.Vector3.Zero());
    impostor.setAngularVelocity(BABYLON.Vector3.Zero());
}

export function resetPhysicsTimeAccumulator(scene: BABYLON.Scene) {
    scene._physicsTimeAccumulator = 0;
}

/**
 * One Engine per canvas for the whole app. Disposing it (especially with
 * loseContextOnDispose) kills the WebGL context and the next GUI/texture
 * allocation fails. Scenes come and go; the engine stays.
 */
export function getSharedEngine(
    canvas: HTMLCanvasElement,
    engineRef: { current: BABYLON.Engine | undefined },
): BABYLON.Engine {
    const existing = engineRef.current;
    if (existing && !existing.isDisposed) {
        existing.stopRenderLoop();
        return existing;
    }

    const engine = new BABYLON.Engine(canvas, true, { loseContextOnDispose: true });
    engineRef.current = engine;
    return engine;
}
