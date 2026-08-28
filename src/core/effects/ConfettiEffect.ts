import { Mesh, Scene, TransformNode } from "@babylonjs/core";
import { Nullable } from "types/common";
import { DisposableSceneEffect } from "core/effects/EffectLifetime";

export class ConfettiEffect extends DisposableSceneEffect {
    public apply(parent: Nullable<Mesh | TransformNode> = null): void {
        const cubes = this.scene.metadata?.effects?.cubes_explosion;
        cubes?.applyConfettiExplosion(parent);
    }
}
