import { ParentAudioEngine } from "./ParentAudioEngine";

export class PlayerAudioEngine extends ParentAudioEngine {
    public static readonly BOOT_SOUND_COUNT = 7;

    protected async loadSounds(callback?: (message: string) => void): Promise<void> {
        if (!this.audioEngine) return;

        await this.createSound(
            "player_bullet_fire",
            "sounds/sfx/player_bullet_fire.mp3",
            { maxInstances: 2, volume: 0.1, spatialEnabled: true },
            this.audioEngine,
            100,
        );

        await this.createSound(
            "player_bullet_wall",
            "sounds/sfx/player_bullet_wall.mp3",
            { maxInstances: 2, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
            100,
        );

        await this.createSound(
            "player_physical_damage",
            "sounds/sfx/player_damage_1hp.mp3",
            { maxInstances: 2, volume: 0.3, spatialEnabled: true },
            this.audioEngine,
            100,
        );

        await this.createSound(
            "player_hacking_damage",
            "sounds/sfx/player_hacking_damage.mp3",
            { maxInstances: 2, volume: 2.0, spatialEnabled: true },
            this.audioEngine,
            100,
        );

        await this.createSound(
            "player_self_destruct_start",
            "sounds/sfx/player_self_destruct_start.mp3",
            { maxInstances: 1, volume: 2.0, spatialEnabled: false },
            this.audioEngine,
            0,
        );

        await this.createSound(
            "player_destroy",
            "sounds/sfx/player_destroy.mp3",
            { maxInstances: 2, volume: 0.3, spatialEnabled: true },
            this.audioEngine,
            100,
        );

        await this.createSound(
            "player_destroy",
            "sounds/sfx/player_destroy.mp3",
            { maxInstances: 2, volume: 0.3, spatialEnabled: true },
            this.audioEngine,
            100,
        );

        if (callback) {
            callback("Player");
        }
    }
}
