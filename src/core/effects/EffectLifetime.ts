import { AbstractMesh, GlowLayer, HighlightLayer, Material, Mesh, Scene } from "@babylonjs/core";

type EffectLayer = GlowLayer | HighlightLayer;

/**
 * Tracks in-flight effect runs so verse/restart cleanup can cancel them
 * (unsubscribe + dispose meshes) instead of leaving GameClock listeners
 * that never reach their `elapsed >= lifetime` branch.
 */
export class EffectLifetime {
    private readonly pending = new Set<() => void>();

    track(cancel: () => void): () => void {
        let done = false;
        const run = () => {
            if (done) return;
            done = true;
            this.pending.delete(run);
            cancel();
        };
        this.pending.add(run);
        return run;
    }

    dispose() {
        const pending = [...this.pending];
        this.pending.clear();
        for (const run of pending) {
            run();
        }
    }
}

export class DisposableSceneEffect {
    protected readonly lifetime = new EffectLifetime();

    constructor(protected readonly scene: Scene) {}

    public dispose() {
        this.lifetime.dispose();
    }
}

const LAYER_KEYS = [
    "glow_layer_player_1_main",
    "glow_layer_player_1_sub",
    "highlight_layer_player_1",
    "glow_layer_player_2_main",
    "glow_layer_player_2_sub",
    "highlight_layer_player_2",
] as const;

function eachEffectLayer(scene: Scene, fn: (layer: EffectLayer) => void) {
    const effects = scene.metadata?.effects;
    if (!effects) return;

    for (const key of LAYER_KEYS) {
        const layer = effects[key] as EffectLayer | null | undefined;
        if (layer) fn(layer);
    }
}

export function excludeMeshFromEffectLayers(scene: Scene, mesh: Mesh) {
    eachEffectLayer(scene, (layer) => {
        if ("addExcludedMesh" in layer) {
            layer.addExcludedMesh(mesh);
        }
    });
}

export function removeMeshFromEffectLayers(scene: Scene, mesh: AbstractMesh) {
    if (!mesh || mesh.isDisposed()) return;

    eachEffectLayer(scene, (layer) => {
        if ("removeExcludedMesh" in layer) {
            layer.removeExcludedMesh(mesh as Mesh);
        }
    });
}

export function isDisposedObject(obj: { isDisposed?: boolean | (() => boolean) } | null | undefined) {
    if (!obj) return true;
    const flag = obj.isDisposed as boolean | (() => boolean) | undefined;
    if (typeof flag === "function") return !!flag.call(obj);
    return !!flag;
}

export function disposeTrackedMesh(
    scene: Scene,
    mesh: AbstractMesh | null | undefined,
    material?: Material | null,
    disposeMaterial: boolean | [boolean?, boolean?, boolean?] = [true, false, true],
) {
    if (mesh && !mesh.isDisposed()) {
        removeMeshFromEffectLayers(scene, mesh);
        mesh.material = null;
        mesh.dispose();
    }

    if (!material) return;

    const mat = material as Material & { isDisposed?: boolean | (() => boolean) };
    if (isDisposedObject(mat)) return;

    if (disposeMaterial === true) {
        material.dispose(true, false, true);
    } else if (Array.isArray(disposeMaterial)) {
        material.dispose(disposeMaterial[0], disposeMaterial[1], disposeMaterial[2]);
    }
}

export function runTimedEffect(
    lifetime: EffectLifetime,
    scene: Scene,
    duration: number,
    onFrame: (progress: number) => void,
    onDone: () => void,
    getSpeed: () => number = () => 1,
) {
    let elapsed = 0;
    let unsubscribe = () => {};
    const finish = lifetime.track(() => {
        unsubscribe();
        onDone();
    });

    unsubscribe = scene.metadata.gameClock.subscribe((dt: number) => {
        elapsed += dt * getSpeed();
        if (elapsed / duration >= 1) {
            finish();
            return;
        }
        onFrame(elapsed / duration);
    });

    return finish;
}
