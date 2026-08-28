import {
    Scene,
    StandardMaterial,
    Color3,
    Vector3,
    InstancedMesh,
    Quaternion,
    TransformNode,
    MeshBuilder,
    ShaderMaterial,
} from "@babylonjs/core";
import { CommonAudioEngine } from "core/audio/CommonAudioEngine";
import { DisposableSceneEffect, disposeTrackedMesh } from "core/effects/EffectLifetime";
import { Nullable } from "types/common";

interface IEffect {
    apply(parent: Nullable<InstancedMesh>): void;
}

export class WallAppearance extends DisposableSceneEffect implements IEffect {
    private lawaSkeletonMaterial!: ShaderMaterial;

    private audioEngine: CommonAudioEngine;

    constructor(scene: Scene) {
        super(scene);
        this.audioEngine = scene.metadata.audio_engine?.getCommonAudio();
    }

    private applyLawaEffect(superParent: TransformNode, scale: Vector3, parentQuat: Quaternion) {
        if (!this.lawaSkeletonMaterial) {
            this.lawaSkeletonMaterial = this.scene.metadata.wall_assets.lawa_box_wall_transparent;
        }

        const lawaSkeleton = MeshBuilder.CreateBox("lawa-wall-skeleton", { size: 1 }, this.scene);

        lawaSkeleton.position.copyFrom(superParent.position);
        lawaSkeleton.scaling.copyFrom(scale);
        lawaSkeleton.rotationQuaternion = parentQuat;

        lawaSkeleton.material = this.lawaSkeletonMaterial;

        let elapsed = 0;
        const duration = 0.5;
        let unsubscribe = () => {};
        const finish = this.lifetime.track(() => {
            unsubscribe();
            disposeTrackedMesh(this.scene, lawaSkeleton, null);
        });

        unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;
            if (elapsed >= duration) {
                finish();
            }
        });
    }

    public apply(parent: Nullable<InstancedMesh> = null, appear: boolean = false): void {
        if (!parent) return;

        const superParent = (parent.parent ?? parent) as TransformNode;
        const clone = parent.sourceMesh.clone("effective-glow");
        clone.setEnabled(true);
        clone.physicsImpostor?.dispose();

        const scale = parent.scaling;

        clone.position.copyFrom(superParent.position);
        clone.scaling.copyFrom(scale);

        let parentQuat = parent.rotationQuaternion;
        if (!parentQuat) {
            const { x, y, z } = parent.rotation;
            parentQuat = Quaternion.FromEulerAngles(x, y, z);
        }

        clone.rotationQuaternion = parentQuat;

        const isLawa = parent.name.includes("lawa");
        if (isLawa) {
            this.applyLawaEffect(superParent, scale, parentQuat);
        }

        const material = new StandardMaterial("wall-glow-effect");
        const white = new Color3(0.1, 0.1, 0.08);
        const black = new Color3(0, 0, 0);

        const scale0 = new Vector3(scale.x * 1.2, scale.y * 2, scale.z * 1.2);
        const scale1 = new Vector3(scale.x, scale.y * 12, scale.z);

        material.alpha = 0.0;
        material.emissiveColor = new Color3(0, 0, 0);

        clone.material = material;
        clone.scaling = scale0;

        const duration = 0.15;
        const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

        let elapsedFade = 0;
        let elapsedScale = 0;
        let unsubscribe = () => {};
        const finish = this.lifetime.track(() => {
            unsubscribe();
            disposeTrackedMesh(this.scene, clone, material, [true, true]);
        });

        unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            elapsedScale += dt;
            const progressScale = Math.min(elapsedScale / (duration * 2), 1);
            if (!clone.isDisposed()) {
                clone.scaling = Vector3.Lerp(scale0, scale1, progressScale);
            }

            elapsedFade += dt;
            let progressFade = Math.min(elapsedFade / duration, 1);
            progressFade = easeInOut(progressFade);

            if (!clone.isDisposed()) {
                if (elapsedFade <= duration) {
                    material.emissiveColor = Color3.Lerp(black, white, progressFade);
                } else if (elapsedFade <= duration * 2) {
                    const progressOut = easeInOut((elapsedFade - duration) / duration);
                    material.emissiveColor = Color3.Lerp(white, black, progressOut);
                }
            }

            if (elapsedFade >= duration * 2 && progressScale >= 1) {
                finish();
            }
        });

        if (appear) {
            this.audioEngine?.playSound("wall_appear");
        } else {
            this.audioEngine?.playSound("wall_changed_state");
        }
    }
}
