import { CreateAudioEngineAsync, AudioEngineV2, Node, Vector3 } from "@babylonjs/core";

import { Nullable } from "types/common";

import { CommonAudioEngine } from "./CommonAudioEngine";
import { PlayerAudioEngine } from "./PlayerAudioEngine";
import { EnemyAudioEngine } from "./EnemyAudioEngine";
import { MusicAudioEngine } from "./MusicAudioEngine";
import { VoiceAudioEngine } from "./VoiceAudioEngine";

import { LS_KEYS } from "core_constants";

export class AudioManager {
    private sharedSFXEngine: Nullable<AudioEngineV2> = null;
    private musicAudioEngine: Nullable<AudioEngineV2> = null;
    private voiceAudioEngine: Nullable<AudioEngineV2> = null;

    private musicAudio: MusicAudioEngine;
    private voiceAudio: VoiceAudioEngine;

    private commonAudio: CommonAudioEngine;
    private playerAudio: PlayerAudioEngine;
    private enemyAudio: EnemyAudioEngine;

    private callback?: (message: string) => void;
    private spatialAudioEnabled: boolean = true;

    /** Runtime-only SFX scale (e.g. final-verse fade). Never persisted; settings stay independent. */
    private sfxVolumeMultiplier: number = 1;
    private sfxFadeRafId: number | null = null;

    constructor(callback?: (message: string) => void) {
        this.commonAudio = new CommonAudioEngine("common");
        this.playerAudio = new PlayerAudioEngine("player");
        this.enemyAudio = new EnemyAudioEngine("enemy");

        this.musicAudio = new MusicAudioEngine("music");
        this.voiceAudio = new VoiceAudioEngine("voice");

        this.callback = callback;
    }

    public async initialize(): Promise<void> {
        this.sharedSFXEngine = await CreateAudioEngineAsync({
            volume: this.getEffectiveSharedSFXVolume(),
            disableDefaultUI: true,
        });
        this.musicAudioEngine = await CreateAudioEngineAsync({
            volume: this.getMusicEngineVolume() * this.getGeneralVolume(),
            disableDefaultUI: true,
        });
        this.voiceAudioEngine = await CreateAudioEngineAsync({
            volume: this.getVoiceEngineVolume() * this.getGeneralVolume(),
            disableDefaultUI: true,
        });

        await Promise.all([
            this.commonAudio.initialize(this.sharedSFXEngine, this.callback),
            this.playerAudio.initialize(this.sharedSFXEngine, this.callback),
            this.enemyAudio.initialize(this.sharedSFXEngine, this.callback),
            this.musicAudio.initialize(this.musicAudioEngine, this.callback),
            this.voiceAudio.initialize(this.voiceAudioEngine, this.callback),
        ]);

        await this.sharedSFXEngine.unlockAsync();
        await this.musicAudioEngine.unlockAsync();
        await this.voiceAudioEngine.unlockAsync();

        this.musicAudio.setupAudioGraph();
        this.musicAudio.createLowpassFilter();
        this.musicAudio.createHighpassFilter();

        this.applyStoredVolumeSettings();
    }

    public getCommonAudio(): CommonAudioEngine {
        return this.commonAudio;
    }

    public getPlayerAudio(): PlayerAudioEngine {
        return this.playerAudio;
    }

    public getEnemyAudio(): EnemyAudioEngine {
        return this.enemyAudio;
    }

    public getMusicAudio(): MusicAudioEngine {
        return this.musicAudio;
    }

    public getVoiceAudio(): VoiceAudioEngine {
        return this.voiceAudio;
    }

    public setSpatialAudioEnabled(enabled: boolean): void {
        this.spatialAudioEnabled = enabled;

        this.commonAudio.setSpatialAudioEnabled(enabled);
        this.playerAudio.setSpatialAudioEnabled(enabled);
        this.enemyAudio.setSpatialAudioEnabled(enabled);

        if (!enabled && this.sharedSFXEngine) {
            this.sharedSFXEngine.listener.detach();
            this.sharedSFXEngine.listener.position = Vector3.Zero();
            this.sharedSFXEngine.listener.rotation = Vector3.Zero();
            this.sharedSFXEngine.listener.update();
        }

        if (!enabled && this.voiceAudioEngine) {
            this.voiceAudioEngine.listener.detach();
            this.voiceAudioEngine.listener.position = Vector3.Zero();
            this.voiceAudioEngine.listener.rotation = Vector3.Zero();
            this.voiceAudioEngine.listener.update();
        }
    }

    public isSpatialAudioEnabled(): boolean {
        return this.spatialAudioEnabled;
    }

    public attachSpatialListener(node: Node): void {
        if (!this.spatialAudioEnabled || !this.sharedSFXEngine || !this.voiceAudioEngine) return;
        this.sharedSFXEngine.listener.attach(node);
        this.voiceAudioEngine.listener.attach(node);
    }

    public detachSpatialListener(): void {
        this.sharedSFXEngine?.listener.detach();
        this.voiceAudioEngine?.listener.detach();
    }

    public dispose(): void {
        this.cancelSharedSFXFade();

        this.commonAudio.dispose();
        this.playerAudio.dispose();
        this.enemyAudio.dispose();
        this.voiceAudio.dispose();

        if (this.sharedSFXEngine) {
            this.sharedSFXEngine.dispose();
            this.sharedSFXEngine = null;
        }

        if (this.musicAudioEngine) {
            this.musicAudioEngine.dispose();
            this.musicAudioEngine = null;
        }

        if (this.voiceAudioEngine) {
            this.voiceAudioEngine.dispose();
            this.voiceAudioEngine = null;
        }
    }

    // Settings
    private readonly generalDefaultVolume: number = 0.5;
    private readonly sfxDefaultVolume: number = 1;
    private readonly musicDefaultVolume: number = 0.5;
    private readonly voiceDefaultVolume: number = 0.5;

    public setGeneralVolume(volume: number): void {
        const clampedVolume = Math.max(0, Math.min(1, volume));

        localStorage.setItem(LS_KEYS.GENERAL_VOLUME, clampedVolume.toString());

        this.applySharedSFXVolume();
        this.applyVoiceEngineVolume();

        if (this.musicAudio?.musicGain && this.musicAudioEngine) {
            const musicChannelVol = this.getMusicChannelVolumeFromStorage(
                LS_KEYS.MUSIC_VOLUME,
                this.musicDefaultVolume,
            );
            this.musicAudio.musicGain.gain.value = musicChannelVol * clampedVolume;
        }
    }

    public getGeneralVolume(): number {
        const stored = localStorage.getItem(LS_KEYS.GENERAL_VOLUME);
        if (stored === null) return this.generalDefaultVolume;
        return parseFloat(stored);
    }

    public setMusicEngineVolume(volume: number) {
        localStorage.setItem(LS_KEYS.MUSIC_VOLUME, volume.toString());

        if (this.musicAudio?.musicGain) {
            const finalVolume = volume * this.getGeneralVolume();
            this.musicAudio.musicGain.gain.value = finalVolume;
        }
    }

    public getMusicEngineVolume(): number {
        const stored = localStorage.getItem(LS_KEYS.MUSIC_VOLUME);
        if (stored === null) return this.musicDefaultVolume;
        return parseFloat(stored);
    }

    public setVoiceEngineVolume(volume: number): void {
        localStorage.setItem(LS_KEYS.VOICE_VOLUME, volume.toString());
        this.applyVoiceEngineVolume();
    }

    public getVoiceEngineVolume(): number {
        const stored = localStorage.getItem(LS_KEYS.VOICE_VOLUME);
        if (stored === null) return this.voiceDefaultVolume;
        return parseFloat(stored);
    }

    public setSharedSFXVolume(volume: number): void {
        localStorage.setItem(LS_KEYS.SFX_VOLUME, volume.toString());
        this.applySharedSFXVolume();
    }

    public getSharedSFXVolume(): number {
        const stored = localStorage.getItem(LS_KEYS.SFX_VOLUME);
        if (stored === null) return this.sfxDefaultVolume;
        return parseFloat(stored);
    }

    /**
     * Smoothly scales shared SFX output without touching localStorage settings.
     * Effective volume = SFX_VOLUME * GENERAL_VOLUME * multiplier.
     */
    public fadeSharedSFXVolume(toMultiplier: number, durationMs: number = 5000): void {
        this.cancelSharedSFXFade();

        const from = this.sfxVolumeMultiplier;
        const to = Math.max(0, Math.min(1, toMultiplier));
        const start = performance.now();

        if (durationMs <= 0) {
            this.sfxVolumeMultiplier = to;
            this.applySharedSFXVolume();
            return;
        }

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            this.sfxVolumeMultiplier = from + (to - from) * t;
            this.applySharedSFXVolume();

            if (t < 1) {
                this.sfxFadeRafId = requestAnimationFrame(tick);
            } else {
                this.sfxFadeRafId = null;
            }
        };

        this.sfxFadeRafId = requestAnimationFrame(tick);
    }

    public resetSharedSFXVolumeMultiplier(): void {
        this.cancelSharedSFXFade();
        this.sfxVolumeMultiplier = 1;
        this.applySharedSFXVolume();
    }

    private getEffectiveSharedSFXVolume(): number {
        return this.getSharedSFXVolume() * this.getGeneralVolume() * this.sfxVolumeMultiplier;
    }

    private applySharedSFXVolume(): void {
        if (!this.sharedSFXEngine) return;
        this.sharedSFXEngine.volume = this.getEffectiveSharedSFXVolume();
    }

    private applyVoiceEngineVolume(): void {
        if (!this.voiceAudioEngine) return;
        this.voiceAudioEngine.volume = this.getVoiceEngineVolume() * this.getGeneralVolume();
    }

    private applyStoredVolumeSettings(): void {
        if (this.musicAudio?.musicGain) {
            this.musicAudio.musicGain.gain.value =
                this.getMusicEngineVolume() * this.getGeneralVolume();
        }

        this.applySharedSFXVolume();
        this.applyVoiceEngineVolume();
    }

    private cancelSharedSFXFade(): void {
        if (this.sfxFadeRafId !== null) {
            cancelAnimationFrame(this.sfxFadeRafId);
            this.sfxFadeRafId = null;
        }
    }

    private getMusicChannelVolumeFromStorage(key: string, defaultValue: number): number {
        const stored = localStorage.getItem(key);
        if (stored === null) return defaultValue;
        return parseFloat(stored);
    }
}
