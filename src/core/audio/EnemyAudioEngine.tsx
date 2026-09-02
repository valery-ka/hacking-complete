import { ParentAudioEngine } from "./ParentAudioEngine";

export class EnemyAudioEngine extends ParentAudioEngine {
    public static readonly BOOT_SOUND_COUNT = 15;

    protected async loadSounds(callback?: (message: string) => void): Promise<void> {
        if (!this.audioEngine) return;

        await this.createSound(
            "enemy_bullet_fire",
            "sounds/sfx/enemy_bullet_fire.mp3",
            { maxInstances: 2, volume: 0.1, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "enemy_bullet_wall",
            "sounds/sfx/enemy_bullet_wall.mp3",
            { maxInstances: 2, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "enemy_bullet_explode",
            "sounds/sfx/enemy_bullet_explode.mp3",
            { maxInstances: 2, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "enemy_core_destroy",
            "sounds/sfx/enemy_core_destroy.mp3",
            { maxInstances: 2, volume: 0.2, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "enemy_core_shield_destroy",
            "sounds/sfx/enemy_core_shield_destroy.mp3",
            { maxInstances: 2, volume: 0.2, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "enemy_damage",
            "sounds/sfx/enemy_damage.mp3",
            { maxInstances: 2, volume: 0.15, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "enemy_destroy",
            "sounds/sfx/enemy_destroy.mp3",
            { maxInstances: 2, volume: 0.15, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "enemy_shield_hit",
            "sounds/sfx/enemy_shield_hit.mp3",
            { maxInstances: 2, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "enemy_spawn",
            "sounds/sfx/enemy_spawn.mp3",
            { maxInstances: 2, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "simone_bell_1",
            "sounds/sfx/simone_bell_1.mp3",
            { maxInstances: 5, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "simone_bell_2",
            "sounds/sfx/simone_bell_2.mp3",
            { maxInstances: 5, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "simone_bell_3",
            "sounds/sfx/simone_bell_3.mp3",
            { maxInstances: 5, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "kamikaze_alarm",
            "sounds/sfx/kamikaze_alarm.mp3",
            { maxInstances: 1, volume: 0.5, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "zero_fire",
            "sounds/sfx/zero_fire.mp3",
            { maxInstances: 2, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "zero_reflected",
            "sounds/sfx/zero_reflected.mp3",
            { maxInstances: 5, volume: 2.0, spatialEnabled: true },
            this.audioEngine,
        );

        if (callback) {
            callback("Enemy");
        }
    }
}
