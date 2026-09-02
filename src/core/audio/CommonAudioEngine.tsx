import { ParentAudioEngine } from "./ParentAudioEngine";

export class CommonAudioEngine extends ParentAudioEngine {
    public static readonly BOOT_SOUND_COUNT = 9;

    protected async loadSounds(callback?: (message: string) => void): Promise<void> {
        if (!this.audioEngine) return;

        await this.createSound(
            "ui_button_select",
            "sounds/sfx/ui_button_select.mp3",
            { maxInstances: 1, volume: 1.0 },
            this.audioEngine,
        );

        await this.createSound(
            "ui_button_start",
            "sounds/sfx/ui_button_start.mp3",
            { maxInstances: 1, volume: 0.9 },
            this.audioEngine,
        );

        await this.createSound(
            "ui_pause",
            "sounds/sfx/ui_pause.mp3",
            { maxInstances: 1, volume: 0.9 },
            this.audioEngine,
        );

        await this.createSound(
            "transition_before",
            "sounds/sfx/transition_before.mp3",
            { maxInstances: 1, volume: 1.0 },
            this.audioEngine,
        );

        await this.createSound(
            "transition_after",
            "sounds/sfx/transition_after.mp3",
            { maxInstances: 1, volume: 1.0 },
            this.audioEngine,
        );

        await this.createSound(
            "bullets_collide",
            "sounds/sfx/bullets_collide.mp3",
            { maxInstances: 2, volume: 1.0, spatialEnabled: true },
            this.audioEngine,
        );

        await this.createSound(
            "wall_changed_state",
            "sounds/sfx/wall_changed_state.mp3",
            { maxInstances: 1, volume: 1.0 },
            this.audioEngine,
        );

        await this.createSound(
            "wall_appear",
            "sounds/sfx/wall_appear.mp3",
            { maxInstances: 1, volume: 1.0 },
            this.audioEngine,
        );

        await this.createSound(
            "return_to_menu",
            "sounds/sfx/return_to_menu.mp3",
            { maxInstances: 1, volume: 1.0 },
            this.audioEngine,
        );

        if (callback) {
            callback("Common");
        }
    }
}
