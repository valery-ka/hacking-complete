import { Scene, TransformNode } from "@babylonjs/core";

import { BaseAttack } from "../AttackManager/BaseAttack";
import { EnemyShooter } from "core/enemy/EnemyShooter";

import { EnemyAudioEngine } from "core/audio/EnemyAudioEngine";

// 3 1 2 1 3 1 2

export class BellAttack extends BaseAttack {
    private shooter: any;

    private readonly delays = [0, 0.41, 0.82, 1.23, 1.64, 2.05, 2.46];
    private readonly sounds = ["simone_bell_3", "simone_bell_1", "simone_bell_2", "simone_bell_1", "simone_bell_3", "simone_bell_1", "simone_bell_2"];

    private audioEngine: EnemyAudioEngine | null = null;

    constructor(scene: Scene, parent: TransformNode, shooter: EnemyShooter, withAudio: boolean = true) {
        super(scene, parent);

        this.shooter = shooter;

        if (withAudio) {
            this.audioEngine = scene.metadata.audio_engine?.getEnemyAudio();
        }
    }

    public start() {
        this.fireSequence();
    }

    private fireSequence() {
        let elapsed = 0;

        let currentIndex = 0;

        const unsubscribe = this.subscribe((dt: number) => {
            if (this.scene.metadata.gameClock.paused) {
                return;
            }

            elapsed += dt;

            while (currentIndex < this.delays.length && elapsed >= this.delays[currentIndex]) {
                this.shooter.triggerShot();
                this.audioEngine?.playSound(this.sounds[currentIndex], 0.5, this.parent);

                currentIndex++;
            }

            if (currentIndex >= this.delays.length) {
                this.unsubscribe(unsubscribe);

                this.dispose();
            }
        });
    }

    public override dispose() {
        super.dispose();
    }
}
