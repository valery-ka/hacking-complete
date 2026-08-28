import { Scene, TransformNode } from "@babylonjs/core";

import { BaseAttack } from "../AttackManager/BaseAttack";
import { EnemyShooter } from "core/enemy/EnemyShooter";

import { EnemyAudioEngine } from "core/audio/EnemyAudioEngine";

export class BellAttack extends BaseAttack {
    private shooter: any;

    private delays: number[];

    private callback: () => void;

    private audioEngine: EnemyAudioEngine | null = null;


    constructor(scene: Scene, parent: TransformNode, shooter: EnemyShooter, delays: number[], withAudio: boolean = false, callback: () => void = () => { }) {
        super(scene, parent);

        this.shooter = shooter;
        this.delays = delays;
        this.callback = callback;

        if (withAudio) {
            this.audioEngine = scene.metadata.audio_engine?.getEnemyAudio();
        }
    }

    public start() {
        this.fireSequence();
        this.callback();
    }

    private fireSequence() {
        let elapsed = 0;

        let currentIndex = 0;

        const unsubscribe = this.subscribe((dt: number) => {
            if (this.scene.metadata.gameClock.paused) {
                return;
            }

            elapsed += dt;

            while (
                currentIndex < this.delays.length &&
                elapsed >= this.delays[currentIndex] / 1000
            ) {
                this.shooter.triggerShot();
                this.audioEngine?.playSound("zero_fire", 1.0, this.parent);

                currentIndex++;
            }

            if (currentIndex >= this.delays.length) {
                this.unsubscribe(unsubscribe);
                this.finish();
                this.dispose();
            }
        });
    }

    public override dispose() {
        super.dispose();
    }
}
