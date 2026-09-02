import {
    CreateAudioEngineAsync,
    AudioEngineV2,
    CreateSoundAsync,
    IStaticSoundOptions,
    AbstractSound,
    TransformNode,
    Mesh,
    InstancedMesh,
    Vector3,
} from "@babylonjs/core";

import { Nullable } from "types/common";

export abstract class ParentAudioEngine {
    protected audioEngine: Nullable<AudioEngineV2> = null;
    protected sounds: Map<string, AbstractSound> = new Map();
    protected soundCooldowns: Map<string, number> = new Map();
    protected soundLastPlayed: Map<string, number> = new Map();
    protected soundPools: Map<string, string[]> = new Map();
    protected soundPoolIndices: Map<string, number> = new Map();
    protected soundPoolLastPlayed: Map<string, string> = new Map();
    protected spatialAudioEnabled: boolean = true;
    protected categoryPrefix: string;
    protected onSoundLoaded?: () => void;

    public setOnSoundLoaded(handler?: () => void) {
        this.onSoundLoaded = handler;
    }

    constructor(categoryPrefix: string) {
        this.categoryPrefix = categoryPrefix;
    }

    protected async createSound(
        name: string,
        path: string,
        options: Partial<IStaticSoundOptions>,
        engine?: AudioEngineV2,
        cooldown: number = 50,
    ): Promise<void> {
        const targetEngine = engine || this.audioEngine;
        if (!targetEngine) return;

        const fullSoundName = `${this.categoryPrefix}_${name}`;
        try {
            const sound = await CreateSoundAsync(fullSoundName, path, options, targetEngine);
            this.sounds.set(name, sound);
            this.soundCooldowns.set(name, cooldown);
        } finally {
            this.onSoundLoaded?.();
        }
    }

    public setSpatialAudioEnabled(enabled: boolean): void {
        this.spatialAudioEnabled = enabled;
    }

    public isSpatialAudioEnabled(): boolean {
        return this.spatialAudioEnabled;
    }

    protected async unlockAudio(): Promise<void> {
        if (this.audioEngine) {
            await this.audioEngine.unlockAsync();
        }
    }

    public async initialize(
        sharedSFXEngine?: AudioEngineV2,
        callback?: (message: string) => void,
    ): Promise<void> {
        if (sharedSFXEngine) {
            this.audioEngine = sharedSFXEngine;
        }
        await this.loadSounds(callback);
        if (!sharedSFXEngine) {
            await this.unlockAudio();
        }
    }

    protected abstract loadSounds(callback?: (message: string) => void): Promise<void>;

    public playSound(
        soundName: string,
        volume: number = 1.0,
        sourceObject?: TransformNode | Mesh | InstancedMesh,
    ): boolean {
        const sound = this.sounds.get(soundName);
        if (!sound) {
            return false;
        }

        const currentTime = Date.now();
        const lastPlayedTime = this.soundLastPlayed.get(soundName) || 0;
        const cooldown = this.soundCooldowns.get(soundName) || 100;

        if (currentTime - lastPlayedTime < cooldown) {
            return false;
        }

        if (sound._isSpatial) {
            if (this.spatialAudioEnabled && sourceObject) {
                // if (soundName.includes("robovoice")) {
                //     console.log("spatial audio enabled", sourceObject.getAbsolutePosition());
                // }
                sound.spatial.position = sourceObject.getAbsolutePosition();
                sound.spatial.minDistance = 1;
                sound.spatial.maxDistance = 100;
                sound.spatial.coneInnerAngle = 15;
                sound.spatial.coneOuterAngle = 90;
                sound.spatial.coneOuterVolume = 0.1;
            } else if (!this.spatialAudioEnabled) {
                // Flat playback without disposing the panner (async recreate breaks restore).
                sound.spatial.position = Vector3.Zero();
                sound.spatial.coneInnerAngle = Math.PI * 2;
                sound.spatial.coneOuterAngle = Math.PI * 2;
                sound.spatial.coneOuterVolume = 1;
            }
        }

        sound.play({ volume: volume });
        this.soundLastPlayed.set(soundName, currentTime);
        return true;
    }

    public stopSound(soundName: string): void {
        const sound = this.sounds.get(soundName);
        sound?.stop();
    }

    /** Register an ordered list of sound names that can be advanced with playNextFromPool. */
    public registerSoundPool(poolId: string, soundNames: string[]): void {
        this.soundPools.set(poolId, soundNames);
        if (!this.soundPoolIndices.has(poolId)) {
            this.soundPoolIndices.set(poolId, 0);
        }
    }

    public hasSoundPool(poolId: string): boolean {
        return this.soundPools.has(poolId);
    }

    /**
     * Play the next sound in the pool, then advance the cursor.
     * Wraps to the first sound after the last one. Stops the previous pool sound if still playing.
     * @returns played sound name, or null if nothing played
     */
    public playNextFromPool(poolId: string, volume: number = 1.0): string | null {
        const pool = this.soundPools.get(poolId);
        if (!pool?.length) return null;

        const lastSound = this.soundPoolLastPlayed.get(poolId);
        if (lastSound) {
            this.stopSound(lastSound);
        }

        const index = this.soundPoolIndices.get(poolId) ?? 0;
        const soundName = pool[index % pool.length];
        const played = this.playSound(soundName, volume);

        if (played) {
            this.soundPoolLastPlayed.set(poolId, soundName);
            this.soundPoolIndices.set(poolId, (index + 1) % pool.length);
            return soundName;
        }

        return null;
    }

    public stopSoundPool(poolId: string): void {
        const lastSound = this.soundPoolLastPlayed.get(poolId);
        if (lastSound) {
            this.stopSound(lastSound);
            this.soundPoolLastPlayed.delete(poolId);
        }
    }

    public resetSoundPool(poolId: string): void {
        if (!this.soundPools.has(poolId)) return;
        this.stopSoundPool(poolId);
        this.soundPoolIndices.set(poolId, 0);
    }

    public getSound(soundName: string): AbstractSound | undefined {
        return this.sounds.get(soundName);
    }

    public setSoundVolume(soundName: string, volume: number): void {
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.volume = volume;
        }
    }

    public setSoundCooldown(soundName: string, cooldown: number): void {
        this.soundCooldowns.set(soundName, cooldown);
    }

    public getSoundCooldown(soundName: string): number {
        return this.soundCooldowns.get(soundName) || 100;
    }

    public isSoundOnCooldown(soundName: string): boolean {
        const currentTime = Date.now();
        const lastPlayedTime = this.soundLastPlayed.get(soundName) || 0;
        const cooldown = this.soundCooldowns.get(soundName) || 100;

        return currentTime - lastPlayedTime < cooldown;
    }

    public getTimeUntilAvailable(soundName: string): number {
        const currentTime = Date.now();
        const lastPlayedTime = this.soundLastPlayed.get(soundName) || 0;
        const cooldown = this.soundCooldowns.get(soundName) || 100;

        const remainingTime = cooldown - (currentTime - lastPlayedTime);
        return Math.max(0, remainingTime);
    }

    public dispose(): void {
        for (const [_, sound] of this.sounds) {
            sound.dispose();
        }
        this.sounds.clear();
        this.soundCooldowns.clear();
        this.soundLastPlayed.clear();
        this.soundPools.clear();
        this.soundPoolIndices.clear();
        this.soundPoolLastPlayed.clear();
    }

    public getEngine(): Nullable<AudioEngineV2> {
        return this.audioEngine;
    }

    public getCategoryPrefix(): string {
        return this.categoryPrefix;
    }
}
