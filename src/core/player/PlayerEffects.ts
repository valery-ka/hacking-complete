import {
    Scene,
    TransformNode,
    Vector3,
    KeyboardEventTypes,
    Observer,
    KeyboardInfo,
} from "@babylonjs/core";
import { Nullable } from "types/common";

import { PlayerTrailEffect } from "core/effects/PlayerTrailEffect";
import { PostProcessesPipeline } from "core/effects/PostProcessesPipeline";
import { PlayerAudioEngine } from "core/audio/PlayerAudioEngine";

export class PlayerEffects {
    private scene: Scene;
    private player: Nullable<TransformNode>;
    private postProcesses: Nullable<PostProcessesPipeline> = null;

    private lastPosition = new Vector3();
    private isPlayerMoving: boolean = false;

    private isWiggleActive: boolean = false;
    private isRadialBlurActive: boolean = false;

    private isRandomEffectApplieable: boolean = false;

    private playerTrail?: {
        create: () => void;
        dispose: () => void;
        enableTrail: () => void;
        disableTrail: () => void;
        updateMaterial: (type: "light" | "dark" | "dual") => void;
    };

    private beforeRenderObserver: Nullable<Observer<Scene>> = null;
    private keyboardObserver: Nullable<Observer<KeyboardInfo>> = null;

    private audioEngine: PlayerAudioEngine;

    constructor(
        scene: Scene,
        player: Nullable<TransformNode>,
        postProcesses: Nullable<PostProcessesPipeline>,
    ) {
        this.scene = scene;
        this.player = player;
        this.postProcesses = postProcesses;

        this.audioEngine = scene.metadata.audio_engine?.getPlayerAudio();
    }

    public observe() {
        if (!this.player) return;

        this.playerTrail = new PlayerTrailEffect(this.scene, this.player);
        this.playerTrail.create();

        this.lastPosition.copyFrom(this.player.position);

        this.beforeRenderObserver = this.scene.onBeforeRenderObservable.add(() =>
            this.checkMovement(),
        );

        this.keyboardObserver = this.scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === KeyboardEventTypes.KEYDOWN && kbInfo.event.code === "Digit1") {
                // const effect = this.scene.metadata?.effects?.confetti_effect;
                // effect?.apply(this.player);
            }
        });

        const clock = this.scene.metadata.gameClock;
        if (!clock) return;

        const duration = 1;
        let elapsed = 0;

        const unsubscribe = clock.subscribe((dt: number) => {
            elapsed += dt;

            if (elapsed >= duration) {
                if (!this.player) {
                    unsubscribe();
                    return;
                }

                this.isRandomEffectApplieable = true;

                unsubscribe();
            }
        });
    }

    private checkMovement() {
        if (!this.player || !this.playerTrail) return;

        const moved = !this.player.position.equalsWithEpsilon(this.lastPosition, 0.001);
        this.updateTrailEffect(moved);
        this.lastPosition.copyFrom(this.player.position);
    }

    private updateTrailEffect(moved: boolean) {
        if (moved !== this.isPlayerMoving) {
            this.isPlayerMoving = moved;
            if (this.isPlayerMoving) this.playerTrail?.enableTrail();
            else this.playerTrail?.disableTrail();
        }
    }

    public updateTrailMaterial(type: "light" | "dark" | "dual") {
        this.playerTrail?.updateMaterial(type);
    }

    public wigglePlayerCamera() {
        if (this.isWiggleActive) return;
        this.isWiggleActive = true;

        const camera = this.player?.metadata?.camera;
        if (!camera) return;

        const clock = this.scene.metadata.gameClock;
        if (!clock) return;

        const MAX_Z_DELTA = 0.5;

        const initialTarget = camera.target.clone();

        let elapsed = 0;
        const duration = 0.4;

        const unsubscribe = clock.subscribe((dt: number) => {
            elapsed += dt;

            const currentTime = Math.min(elapsed, duration);
            const progress = currentTime / duration;

            const amplitude = MAX_Z_DELTA * (1 - progress);

            const frequency = 25;
            const wiggleZ = Math.sin(currentTime * frequency) * amplitude;

            camera.target.z = initialTarget.z + wiggleZ;

            if (elapsed >= duration) {
                camera.target.copyFrom(initialTarget);
                this.isWiggleActive = false;
                unsubscribe();
            }
        });
    }

    public radialBlurCamera(duration: number = 0.2) {
        if (this.isRadialBlurActive) return;
        this.isRadialBlurActive = true;

        const radialBlurEffect = this.postProcesses?.radialBlurPostProcess;
        if (!radialBlurEffect) return;

        const clock = this.scene.metadata.gameClock;
        if (!clock) return;

        this.postProcesses?.enableRadialBlurPostProcess();

        const MAX_STRENGTH = 0.2;
        const FADE_IN_RATIO = 0.2;
        let elapsed = 0;

        const easeInOutQuad = (t: number): number => {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        };

        const easeOutQuad = (t: number): number => {
            return 1 - (1 - t) * (1 - t);
        };

        const unsubscribe = clock.subscribe((dt: number) => {
            elapsed += dt;

            radialBlurEffect!.onApply = (effect) => {
                const progress = Math.min(elapsed / duration, 1);
                let strength = 0;

                if (progress <= FADE_IN_RATIO) {
                    const fadeInProgress = progress / FADE_IN_RATIO;
                    strength = MAX_STRENGTH * easeInOutQuad(fadeInProgress);
                } else {
                    const fadeOutProgress = (progress - FADE_IN_RATIO) / (1 - FADE_IN_RATIO);
                    strength = MAX_STRENGTH * (1 - easeOutQuad(fadeOutProgress));
                }

                effect.setFloat("strength", strength);
            };

            if (elapsed >= duration) {
                this.postProcesses?.disableRadialBlurPostProcess();
                this.isRadialBlurActive = false;
                unsubscribe();
            }
        });
    }

    public applyRandomEffect() {
        // return;
        if (!this.isRandomEffectApplieable) return;

        this.postProcesses?.applyRandomPostProcess();
        this.audioEngine?.playSound("player_hacking_damage", 1.0, this.player!);
    }

    public dispose() {
        this.playerTrail?.dispose();

        if (this.beforeRenderObserver) {
            this.scene.onBeforeRenderObservable.remove(this.beforeRenderObserver);
            this.beforeRenderObserver = null;
        }

        if (this.keyboardObserver) {
            this.scene.onKeyboardObservable.remove(this.keyboardObserver);
            this.keyboardObserver = null;
        }
    }
}
