import { Scene, Mesh, Vector3 } from "@babylonjs/core";
import { Nullable } from "types/common";
import { DisposableSceneEffect } from "core/effects/EffectLifetime";

interface IEffect {
    apply(parent: Nullable<Mesh>): void;
}

export class SphereBombDiscSpawnAnimation extends DisposableSceneEffect implements IEffect {
    public apply(disc: Nullable<Mesh> = null): void {
        if (!disc) return;

        const scale0 = new Vector3(0.25, 0.25, 0.25);
        const scale1 = new Vector3(1, 1, 1);

        const duration = 0.1;
        let elapsedScale = 0;
        let unsubscribe = () => {};
        const finish = this.lifetime.track(() => {
            unsubscribe();
        });

        unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            elapsedScale += dt;
            const progressScale = Math.min(elapsedScale / (duration * 2), 1);
            if (!disc.isDisposed()) {
                disc.scaling = Vector3.Lerp(scale0, scale1, progressScale);
            }

            if (progressScale >= 1) {
                finish();
            }
        });
    }
}
