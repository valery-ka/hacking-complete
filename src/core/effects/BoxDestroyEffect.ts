import { Scene, Mesh, TransformNode } from "@babylonjs/core";
import { Nullable } from "types/common";
import { DisposableSceneEffect } from "core/effects/EffectLifetime";

interface IEffect {
    apply(parent: Nullable<Mesh | TransformNode>): void;
}

export class BoxDestroyEffect extends DisposableSceneEffect implements IEffect {
    public apply(parent: Nullable<Mesh | TransformNode> = null): void {
        const cubes = this.scene.metadata?.effects?.cubes_explosion;
        cubes?.applyTinyExplosion(parent, "white", "small");
    }
}
