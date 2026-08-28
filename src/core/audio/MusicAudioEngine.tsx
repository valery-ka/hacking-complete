import {
    AbstractSound,
    AudioParameterRampShape,
    CreateStreamingSoundAsync,
    IStaticSoundOptions,
    Observable,
    Scene,
    StreamingSound,
    setAndStartTimer,
} from "@babylonjs/core";
import { ParentAudioEngine } from "./ParentAudioEngine";

import {
    CategoryVolume,
    MusicSettings,
    MusicTransitionDuration,
} from "types/music/MusicConfig.types";

import { LS_KEYS } from "core_constants";

import { Nullable } from "types/common";

import { alwaysResidentMusic, getChapterMusicPaths } from "verses/chapterMusic";
import { ChapterLabel } from "verses/verseProgression";

interface SoundSettings {
    loopStart?: number;
    loopEnd?: number;
    oneShotDuration?: number;
    chapter: string;
    type: "one_shot" | "full";
}

export class MusicAudioEngine extends ParentAudioEngine {
    private inStage: boolean = false;

    public setInStage(inStage: boolean) {
        const wasInStage = this.inStage;
        this.inStage = inStage;

        if (wasInStage && !inStage) {
            this.clearActiveChapter();
        }
    }

    // Initialization
    public musicGain: GainNode | null = null;

    public setupAudioGraph() {
        const audioContext = (this.audioEngine as any)._audioContext as AudioContext;

        if (!this.musicGain) {
            const engineVolume = (this.audioEngine as any)._volume;
            this.musicGain = audioContext.createGain();
            this.musicGain.gain.value = engineVolume ?? 1.0;

            this.musicGain.connect(audioContext.destination);
        }
    }

    public createLowpassFilter() {
        const audioContext = (this.audioEngine as any)._audioContext as AudioContext;

        if (!this.lowpassFilter) {
            this.lowpassFilter = audioContext.createBiquadFilter();
            this.lowpassFilter.type = "lowpass";

            if (this.highpassFilter) {
                this.lowpassFilter.connect(this.highpassFilter);
            } else {
                this.lowpassFilter.connect(this.musicGain!);
            }

            this.lowpassFilter.frequency.value = this.lowpassOpenFreq;

            this.routeAllSounds();
        }
    }

    public createHighpassFilter() {
        const audioContext = (this.audioEngine as any)._audioContext as AudioContext;

        if (!this.highpassFilter) {
            this.highpassFilter = audioContext.createBiquadFilter();
            this.highpassFilter.type = "highpass";

            this.highpassFilter.connect(this.musicGain!);

            if (this.lowpassFilter) {
                this.lowpassFilter.disconnect();
                this.lowpassFilter.connect(this.highpassFilter);
            }

            this.highpassFilter.frequency.value = this.highpassOpenFreq;

            this.routeAllSounds();
        }
    }

    /**
     * Sounds are created lazily per chapter, long after the filter chain exists, so every new sound
     * has to be patched into it by hand. Without this they would stay on the engine's default bus:
     * no pause muffling, and the music volume slider would not reach them.
     */
    private routeSound(sound?: AbstractSound) {
        const target = this.lowpassFilter ?? this.highpassFilter ?? this.musicGain;
        if (!sound || !target) return;

        const outNode = (sound as any)._outNode as AudioNode | undefined;
        if (!outNode) return;

        outNode.disconnect();
        outNode.connect(target);
    }

    private routeAllSounds() {
        this.sounds.forEach((sound) => this.routeSound(sound));
        this.radioSounds.forEach((sound) => this.routeSound(sound));
    }

    /**
     * routeSound() rewires the raw Web Audio node, but Babylon still tracks the defaultMainBus
     * connection. Restore that link before dispose or Babylon throws on disconnect.
     */
    private restoreSoundRouting(sound: AbstractSound) {
        const outNode = (sound as any)._outNode as AudioNode | undefined;
        const outBus = (sound as any).outBus ?? this.audioEngine?.defaultMainBus;
        const busInNode = outBus ? ((outBus as any)._inNode as AudioNode | undefined) : undefined;

        if (!outNode || !busInNode) return;

        try {
            outNode.disconnect();
        } catch {
            // Already disconnected from the filter chain.
        }

        outNode.connect(busInNode);
    }

    private disposeSoundSafely(sound: AbstractSound) {
        try {
            sound.stop();
        } catch {
            // ignore
        }

        this.restoreSoundRouting(sound);

        try {
            sound.dispose();
        } catch (error) {
            console.warn("[music] Failed to dispose sound cleanly:", error);
        }
    }

    public finalize(count: number, callback?: (message: string) => void): void {
        if (callback) {
            callback("Music");
        }
    }

    private mapSoundPaths(
        obj: any,
        chapter: string,
        durations: { one_shot: number; full: number },
        result: Map<string, SoundSettings>,
    ): void {
        if (!obj) return;

        if (typeof obj === "string" && obj.endsWith(".ogg")) {
            const isOneShot = obj.includes("/one_shot/");
            const type = isOneShot ? "one_shot" : "full";
            const duration = durations[type];

            result.set(obj, {
                chapter,
                type,
                oneShotDuration: type === "one_shot" ? duration : undefined,
                loopStart: type === "full" ? 0 : undefined,
                loopEnd: type === "full" ? duration : undefined,
            });
            return;
        }

        if (typeof obj === "object") {
            for (const key in obj) {
                this.mapSoundPaths(obj[key], chapter, durations, result);
            }
        }
    }

    private pathSettings: Map<string, SoundSettings> = new Map();
    private activeChapter: ChapterLabel | null = null;
    private chapterLoad: Promise<void> = Promise.resolve();
    private missingPathsWarned: Set<string> = new Set();

    private static readonly loadConcurrency: number = 8;

    protected async loadSounds(callback?: (message: string) => void): Promise<void> {
        if (!this.audioEngine) return;

        const main = await fetch("sounds/music/list_main.json");
        const listMain = await main.json();

        const radio = await fetch("sounds/music/list_radio.json");
        const listRadio = await radio.json();

        for (let i = 0; i < listMain.music.length; i++) {
            const musicBlock = listMain.music[i];
            const durationBlock = listMain.durations[i];

            const chapterKey = Object.keys(musicBlock)[0];
            const chapterDurations = durationBlock?.[chapterKey];

            if (!chapterDurations) continue;

            this.mapSoundPaths(
                musicBlock[chapterKey],
                chapterKey,
                chapterDurations,
                this.pathSettings,
            );
        }

        this.radioShuffledList = listRadio.paths;

        // Only the menu tracks are decoded up front. Verse music is loaded per chapter and radio
        // tracks are streamed, because decoding every track at once costs over 6 GB of RAM.
        await this.loadPaths(alwaysResidentMusic);

        // нормальная темка для того, чтоб знать, сколько зацикливать
        // this.sounds.forEach((sound: any) => {
        //     if (sound.name.includes("Menu")) {
        //         console.log(sound.name, sound._buffer.duration);
        //     }
        // });

        this.finalize(alwaysResidentMusic.length, callback);
    }

    private async createMusicSound(path: string): Promise<void> {
        if (!this.audioEngine || this.sounds.has(path)) return;

        const settings = this.pathSettings.get(path);

        const options: Partial<IStaticSoundOptions> =
            settings?.type === "one_shot"
                ? {
                    maxInstances: 1,
                    volume: 0.0,
                    duration: settings.oneShotDuration,
                }
                : {
                    maxInstances: 1,
                    volume: 0.0,
                    loopStart: settings?.loopStart,
                    loopEnd: settings?.loopEnd,
                };

        await this.createSound(path, path, options, this.audioEngine, 0);
        this.routeSound(this.sounds.get(path));
    }

    private async loadPaths(
        paths: readonly string[],
        onProgress?: (loaded: number, total: number) => void,
    ): Promise<void> {
        const queue = paths.filter((path) => !this.sounds.has(path));
        const total = queue.length;

        onProgress?.(0, total);

        if (total === 0) return;

        let loaded = 0;

        const worker = async () => {
            while (queue.length) {
                await this.createMusicSound(queue.shift()!);
                loaded++;
                onProgress?.(loaded, total);
            }
        };

        await Promise.all(
            Array.from({ length: Math.min(MusicAudioEngine.loadConcurrency, total) }, worker),
        );
    }

    private unloadMusicExcept(keep: Set<string>) {
        this.clearFadeOutTimeout();

        const stale = Array.from(this.sounds.keys()).filter((path) => !keep.has(path));

        stale.forEach((path) => {
            const sound = this.sounds.get(path);
            if (sound) {
                this.disposeSoundSafely(sound);
            }
            this.sounds.delete(path);
            this.soundCooldowns.delete(path);
            this.soundLastPlayed.delete(path);
        });
    }

    /** Stops in-level music without touching always-resident menu tracks. */
    private stopChapterMusic() {
        this.clearFadeOutTimeout();
        this.fadeOutDuration = 0;

        const resident = new Set(alwaysResidentMusic);
        this.sounds.forEach((sound, path) => {
            if (!resident.has(path)) {
                this.muteSong(sound);
            }
        });

        this.stopRadioMode();
        this.resetMusicSessionState();
    }

    private resetMenuAudioState() {
        this.restorePausedGain();
        this.disableLowpass();
        this.disableHighpass();
        this.lowpassEnabled = false;
        this.highpassEnabled = false;
    }

    /**
     * Drops decoded chapter tracks when leaving a level; menu tracks stay resident.
     * Runs synchronously so a deferred stopMusic() cannot race playMenuMusic() on menu mount.
     */
    private clearActiveChapter(): void {
        this.stopChapterMusic();
        this.unloadMusicExcept(new Set(alwaysResidentMusic));
        this.activeChapter = null;
        this.resetMenuAudioState();

        this.chapterLoad = this.chapterLoad.catch(() => undefined).then(() => undefined);
    }

    /**
     * Makes the given chapter's music resident and drops every other chapter's.
     *
     * A chapter is the right unit because the last verse of each chapter has `return_to_menu`, so
     * an in-game verse transition never crosses a chapter boundary and never has to decode
     * anything. Restarting a verse reuses the already-decoded sounds too.
     */
    public setActiveChapter(
        chapter: ChapterLabel,
        onProgress?: (loaded: number, total: number) => void,
    ): Promise<void> {
        this.chapterLoad = this.chapterLoad
            .catch(() => undefined)
            .then(async () => {
                const paths = getChapterMusicPaths(chapter);

                this.unloadMusicExcept(new Set([...alwaysResidentMusic, ...paths]));
                await this.loadPaths(paths, onProgress);

                this.activeChapter = chapter;
            });

        return this.chapterLoad;
    }

    public getActiveChapter(): ChapterLabel | null {
        return this.activeChapter;
    }

    /** The chapter lists are hand-maintained, so a missing track is a manifest gap worth reporting. */
    private warnIfNotLoaded(path: string) {
        if (!path || this.sounds.has(path) || !this.pathSettings.has(path)) return;
        if (this.missingPathsWarned.has(path)) return;

        this.missingPathsWarned.add(path);
        console.warn(
            `[music] "${path}" is not loaded for chapter "${this.activeChapter}". ` +
            "Add it to chapterMusic.ts.",
        );
    }

    // Radio Mode
    private radioModeValue: string = this.getRadioMode();
    private radioShuffledList: string[] = [];
    private radioSounds: Map<string, StreamingSound> = new Map();
    private currentSoundIndex: number = 0;
    private radioGeneration: number = 0;

    public getRadioMode(): string {
        const value = localStorage.getItem(LS_KEYS.RADIO_SETTING);
        if (!value) return "OFF";
        return value;
    }

    public isRadioModeEnabled(): boolean {
        return this.radioModeValue === "ON";
    }

    public setRadioMode(option: string) {
        localStorage.setItem(LS_KEYS.RADIO_SETTING, option);
        this.radioModeValue = option;
    }

    public initRadioMode() {
        this.currentSoundIndex = 0;
        this.radioGeneration++;

        this.shuffleRadioList();
        void this.playRadioMode(this.radioGeneration);
    }

    private shuffleRadioList() {
        const shuffled = [...this.radioShuffledList];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        this.radioShuffledList = shuffled;
    }

    /**
     * Streaming preload creates MediaElementAudioSourceNode and rewires the audio graph on the main
     * thread. Run that work during idle time so it does not hitch the render loop.
     */
    private deferToIdle(task: () => void) {
        if (typeof requestIdleCallback !== "undefined") {
            requestIdleCallback(() => task(), { timeout: 2_000 });
        } else {
            setTimeout(task, 0);
        }
    }

    /**
     * Radio tracks are streamed rather than decoded: they are full-length songs played start to
     * finish, with no layers and no loop points, so they gain nothing from an AudioBuffer while
     * costing ~1.7 GB to hold all at once.
     */
    private async createRadioSound(
        path: string,
        generation: number,
        options: { background?: boolean } = {},
    ): Promise<Nullable<StreamingSound>> {
        if (!this.audioEngine) return null;

        const existing = this.radioSounds.get(path);
        if (existing) return existing;

        const sound = await CreateStreamingSoundAsync(
            `${this.getCategoryPrefix()}_${path}`,
            path,
            { volume: 0.0, preloadCount: 1 },
            this.audioEngine,
        );

        // Radio was stopped while this stream was still preloading.
        if (generation !== this.radioGeneration) {
            this.deferToIdle(() => this.disposeSoundSafely(sound));
            return null;
        }

        this.radioSounds.set(path, sound);

        if (options.background) {
            this.deferToIdle(() => this.routeSound(sound));
        } else {
            this.routeSound(sound);
        }

        return sound;
    }

    private scheduleRadioPreload(path: string, generation: number) {
        this.deferToIdle(() => {
            if (generation !== this.radioGeneration) return;
            void this.createRadioSound(path, generation, { background: true });
        });
    }

    private disposeRadioSoundsExcept(keep: Set<string>) {
        Array.from(this.radioSounds.keys())
            .filter((path) => !keep.has(path))
            .forEach((path) => {
                const sound = this.radioSounds.get(path);
                this.radioSounds.delete(path);
                if (!sound) return;

                sound.onEndedObservable.clear();
                this.deferToIdle(() => this.disposeSoundSafely(sound));
            });
    }

    private stopRadioMode() {
        this.radioGeneration++;
        this.disposeRadioSoundsExcept(new Set());
    }

    private async playRadioMode(generation: number): Promise<void> {
        if (generation !== this.radioGeneration) return;
        if (!this.inStage || !this.isRadioModeEnabled()) return;

        const totalSounds = this.radioShuffledList.length;
        if (totalSounds === 0) return;

        const currentSongPath = this.radioShuffledList[this.currentSoundIndex];
        const nextSongPath = this.radioShuffledList[(this.currentSoundIndex + 1) % totalSounds];

        const currentMusic = await this.createRadioSound(currentSongPath, generation);

        if (generation !== this.radioGeneration) return;
        if (!currentMusic || !this.inStage || !this.isRadioModeEnabled()) return;

        this.disposeRadioSoundsExcept(new Set([currentSongPath, nextSongPath]));

        // Background preload may defer routing; the playing track must be wired immediately.
        this.routeSound(currentMusic);
        currentMusic.play();
        currentMusic.setVolume(1.0, {
            duration: 0.0,
            shape: AudioParameterRampShape.Linear,
        });

        currentMusic.onEndedObservable.clear();

        currentMusic.onEndedObservable.addOnce(() => {
            this.currentSoundIndex = (this.currentSoundIndex + 1) % totalSounds;
            void this.playRadioMode(generation);
        });

        // Warm up the next track while this one plays so the switch has no gap.
        this.scheduleRadioPreload(nextSongPath, generation);
    }

    // Volume
    private lastAppliedLayersVolume: CategoryVolume | null = null;
    private pauseLayersSnapshot: CategoryVolume | null = null;
    private activePauseOverrideLayers: CategoryVolume | null = null;
    private isPauseLayerOverrideActive: boolean = false;
    private playOneShotMode: boolean = false;
    private oneShotCompletedFullPaths: Set<string> = new Set();
    private fadeOutDuration: number = 0;
    private fadeOutTimeoutId: ReturnType<typeof setTimeout> | null = null;
    private chapterPlaybackGeneration: number = 0;

    public setFadeOutDuration(duration: number) {
        this.fadeOutDuration = duration > 0 ? duration : 0;
    }

    public getFadeOutDuration(): number {
        return this.fadeOutDuration;
    }

    private invalidateChapterPlayback() {
        this.chapterPlaybackGeneration++;
    }

    private clearFadeOutTimeout() {
        if (this.fadeOutTimeoutId !== null) {
            clearTimeout(this.fadeOutTimeoutId);
            this.fadeOutTimeoutId = null;
        }
    }

    private clearOneShotHandoff(sound: AbstractSound, path: string) {
        if (this.pathSettings.get(path)?.type === "one_shot") {
            sound.onEndedObservable.clear();
        }
    }

    private cloneCategoryVolume(volumes: CategoryVolume): CategoryVolume {
        return JSON.parse(JSON.stringify(volumes));
    }

    private getFullVolumeFromLastApplied(fullPath: string): number | null {
        if (!this.lastAppliedLayersVolume) return null;

        for (const layer of Object.values(this.lastAppliedLayersVolume)) {
            for (const variant of Object.values(layer)) {
                const settings = variant as MusicSettings;
                if (settings.full === fullPath) {
                    return settings.full_volume ?? null;
                }
            }
        }

        return null;
    }

    private shouldDeferFullVolume(fullPath: string): boolean {
        return this.playOneShotMode && !this.oneShotCompletedFullPaths.has(fullPath);
    }

    private getTransitionDurationForStyle(duration: MusicTransitionDuration, style: string): number {
        if (typeof duration === "number") return duration;
        if (style === "8-bit") return duration["8-bit"] ?? duration.default;
        if (style === "original") return duration.original ?? duration.default;
        return duration.default;
    }

    private applyLayersVolume(
        volumes: CategoryVolume,
        duration: MusicTransitionDuration = 1.0,
    ) {
        const layerVolumes = Object.values(volumes);

        layerVolumes.forEach((layer) => {
            const versions = Object.entries(layer);

            versions.forEach(([style, version]: [string, unknown]) => {
                const musicVariant = version as MusicSettings;
                const transitionDuration = this.getTransitionDurationForStyle(duration, style);

                const one_shot = musicVariant.one_shot;
                const one_shot_volume = musicVariant.one_shot_volume ?? 0;

                const full = musicVariant.full;
                const full_volume = musicVariant.full_volume ?? 0;

                if (one_shot) {
                    const oneShotSound = this.sounds.get(one_shot);
                    oneShotSound?.setVolume(one_shot_volume, {
                        duration: transitionDuration,
                        shape: AudioParameterRampShape.Linear,
                    });
                }

                if (full) {
                    const fullSound = this.sounds.get(full);

                    const effectiveFullVolume =
                        !this.isPauseLayerOverrideActive && this.shouldDeferFullVolume(full)
                            ? 0
                            : full_volume;

                    fullSound?.setVolume(effectiveFullVolume, {
                        duration: transitionDuration,
                        shape: AudioParameterRampShape.Linear,
                    });
                }
            });
        });
    }

    public setLayersVolume(volumes: CategoryVolume, duration: MusicTransitionDuration = 1.0) {
        if (this.isPauseLayerOverrideActive) {
            return;
        }

        this.lastAppliedLayersVolume = this.cloneCategoryVolume(volumes);
        this.applyLayersVolume(volumes, duration);
    }

    private clearPauseLayerOverrideState() {
        this.isPauseLayerOverrideActive = false;
        this.pauseLayersSnapshot = null;
        this.activePauseOverrideLayers = null;
    }

    private reapplyPauseLayerOverrideIfActive(duration: number = 0) {
        if (!this.isPauseLayerOverrideActive || !this.activePauseOverrideLayers) return;

        this.applyLayersVolume(this.activePauseOverrideLayers, duration);
    }

    public resetMusicSessionState() {
        this.restorePausedGain();
        this.clearPauseLayerOverrideState();
        this.lastAppliedLayersVolume = null;
        this.playOneShotMode = false;
        this.oneShotCompletedFullPaths.clear();
    }

    public applyInitialLayersVolume(volumes: CategoryVolume, duration: MusicTransitionDuration = 0) {
        this.lastAppliedLayersVolume = this.cloneCategoryVolume(volumes);
        this.applyLayersVolume(volumes, duration);
    }

    private applyPauseLayerOverride(pauseOverrideLayers: CategoryVolume, duration: number = 0.5) {
        if (!this.isPauseLayerOverrideActive) {
            this.pauseLayersSnapshot = this.lastAppliedLayersVolume
                ? this.cloneCategoryVolume(this.lastAppliedLayersVolume)
                : null;
            this.isPauseLayerOverrideActive = true;
        }

        this.activePauseOverrideLayers = this.cloneCategoryVolume(pauseOverrideLayers);
        this.applyLayersVolume(pauseOverrideLayers, duration);
    }

    private restorePauseLayerOverride(duration: number = 0.5) {
        if (!this.isPauseLayerOverrideActive) return;

        const snapshot = this.pauseLayersSnapshot;
        this.clearPauseLayerOverrideState();

        if (snapshot) {
            this.setLayersVolume(snapshot, duration);
        }
    }

    // Playback
    public playMusic(
        oneShotName: string,
        oneShotVolume: number,
        mainName: string,
        mainVolume: number,
        contextObservable: Observable<Scene>,
        playOneShot: boolean = false,
        disableDelayedStart: boolean = false,
    ) {
        if (this.isRadioModeEnabled()) return;

        if (playOneShot) {
            this.playOneShotMode = true;
        }

        this.warnIfNotLoaded(oneShotName);
        this.warnIfNotLoaded(mainName);

        const oneShot = this.sounds.get(oneShotName);
        const main = this.sounds.get(mainName);

        const playWithOneShot = () => {
            if (oneShot && main) {
                const generation = this.chapterPlaybackGeneration;

                oneShot.play();
                oneShot.setVolume(oneShotVolume, {
                    duration: 0.0,
                    shape: AudioParameterRampShape.Linear,
                });

                oneShot.onEndedObservable.addOnce(() => {
                    if (generation !== this.chapterPlaybackGeneration) return;

                    this.oneShotCompletedFullPaths.add(mainName);

                    main.play({ loop: true });

                    if (this.isPauseLayerOverrideActive) {
                        this.reapplyPauseLayerOverrideIfActive(0);
                        return;
                    }

                    const fullVolume =
                        this.getFullVolumeFromLastApplied(mainName) ?? mainVolume;

                    main.setVolume(fullVolume, {
                        duration: 0.0,
                        shape: AudioParameterRampShape.Linear,
                    });
                });
            }
        };

        const playWithoutOneShot = () => {
            if (main) {
                main.play({ loop: true });
                main.setVolume(mainVolume, {
                    duration: 0.0,
                    shape: AudioParameterRampShape.Linear,
                });
            }
        };

        setAndStartTimer({
            timeout: disableDelayedStart ? 0 : 250,
            contextObservable: contextObservable,
            onEnded: () => {
                playOneShot ? playWithOneShot() : playWithoutOneShot();
            },
        });
    }

    private muteSong(song: AbstractSound) {
        song.stop();
    }

    public stopMusic(forceStopRadio: boolean = false) {
        this.clearFadeOutTimeout();
        this.invalidateChapterPlayback();
        this.fadeOutDuration = 0;

        this.sounds.forEach((sound) => this.muteSong(sound));

        if (forceStopRadio || !this.isRadioModeEnabled()) {
            this.stopRadioMode();
        }

        this.resetMusicSessionState();
    }

    public playMenuMusic(path: string, volume: number = 1.0) {
        const sound = this.sounds.get(path);
        if (!sound) return;

        this.resetMenuAudioState();
        this.routeSound(sound);

        sound.play({ loop: true });
        sound.setVolume(volume, {
            duration: 0.0,
            shape: AudioParameterRampShape.Linear,
        });
    }

    public stopMenuMusic(path: string) {
        const sound = this.sounds.get(path);
        if (sound) {
            this.muteSong(sound);
        }
    }

    public stopChapterSong(songName: string, fadeOutDuration?: number) {
        if (!songName) return;

        this.clearFadeOutTimeout();
        this.invalidateChapterPlayback();

        const duration = fadeOutDuration ?? this.fadeOutDuration;

        this.fadeOutDuration = 0;

        const matching: AbstractSound[] = [];
        this.sounds.forEach((sound, path) => {
            if (!sound.name.includes(songName)) return;

            this.clearOneShotHandoff(sound, path);
            matching.push(sound);
        });

        if (duration <= 0) {
            matching.forEach((sound) => this.muteSong(sound));
            this.resetMusicSessionState();
            return;
        }

        matching.forEach((sound) => {
            sound.setVolume(0, {
                duration,
                shape: AudioParameterRampShape.Linear,
            });
        });

        this.resetMusicSessionState();

        this.fadeOutTimeoutId = setTimeout(() => {
            matching.forEach((sound) => this.muteSong(sound));
            this.fadeOutTimeoutId = null;
        }, duration * 1000);
    }

    // Effects
    private lowpassEnabled: boolean = false;
    private lowpassFilter: BiquadFilterNode | null = null;

    private readonly lowpassTargetFreq: number = 200;
    private readonly lowpassOpenFreq: number = 20000;
    private readonly lowpassTransitionDuration: number = 0.01;

    private highpassEnabled: boolean = false;
    private highpassFilter: BiquadFilterNode | null = null;

    private readonly highpassTargetFreq: number = 200;
    private readonly highpassOpenFreq: number = 20;
    private readonly highpassTransitionDuration: number = 0.01;

    public enableLowpass() {
        if (!this.lowpassFilter) return;

        const audioContext = (this.audioEngine as any)._audioContext as AudioContext;

        const now = audioContext.currentTime;
        this.lowpassFilter.frequency.cancelScheduledValues(now);
        this.lowpassFilter.frequency.setValueAtTime(this.lowpassFilter.frequency.value, now);
        this.lowpassFilter.frequency.exponentialRampToValueAtTime(
            this.lowpassTargetFreq,
            now + this.lowpassTransitionDuration,
        );
    }

    public disableLowpass() {
        if (!this.lowpassFilter) return;

        const audioContext = (this.audioEngine as any)._audioContext as AudioContext;

        const now = audioContext.currentTime;
        this.lowpassFilter.frequency.cancelScheduledValues(now);
        this.lowpassFilter.frequency.setValueAtTime(this.lowpassFilter.frequency.value, now);
        this.lowpassFilter.frequency.exponentialRampToValueAtTime(
            this.lowpassOpenFreq,
            now + this.lowpassTransitionDuration,
        );
    }

    public toggleLowpassFilter() {
        if (this.lowpassEnabled) {
            this.disableLowpass();
            this.lowpassEnabled = false;
        } else {
            this.enableLowpass();
            this.lowpassEnabled = true;
        }
    }

    public enableHighpass() {
        if (!this.highpassFilter) {
            this.createHighpassFilter();
        }

        const audioContext = (this.audioEngine as any)._audioContext as AudioContext;

        const now = audioContext.currentTime;
        this.highpassFilter!.frequency.cancelScheduledValues(now);
        this.highpassFilter!.frequency.setValueAtTime(this.highpassFilter!.frequency.value, now);
        this.highpassFilter!.frequency.exponentialRampToValueAtTime(
            this.highpassTargetFreq,
            now + this.highpassTransitionDuration,
        );
    }

    public disableHighpass() {
        if (!this.highpassFilter) return;

        const audioContext = (this.audioEngine as any)._audioContext as AudioContext;

        const now = audioContext.currentTime;
        this.highpassFilter.frequency.cancelScheduledValues(now);
        this.highpassFilter.frequency.setValueAtTime(this.highpassFilter.frequency.value, now);
        this.highpassFilter.frequency.exponentialRampToValueAtTime(
            this.highpassOpenFreq,
            now + this.highpassTransitionDuration,
        );
    }

    public toggleHighpassFilter() {
        if (this.highpassEnabled) {
            this.disableHighpass();
            this.highpassEnabled = false;
        } else {
            this.enableHighpass();
            this.highpassEnabled = true;
        }
    }

    private readonly pauseIncrement: number = 0.2;
    private readonly musicDefaultVolume: number = 0.5;
    private readonly generalDefaultVolume: number = 0.5;
    private originalGainValue: number | null = null;

    private getConfiguredMusicGain(): number {
        const musicStored = localStorage.getItem(LS_KEYS.MUSIC_VOLUME);
        const musicChannelVolume =
            musicStored === null ? this.musicDefaultVolume : parseFloat(musicStored);

        const generalStored = localStorage.getItem(LS_KEYS.GENERAL_VOLUME);
        const generalVolume =
            generalStored === null ? this.generalDefaultVolume : parseFloat(generalStored);

        return musicChannelVolume * generalVolume;
    }

    private restorePausedGain() {
        const gain = this.musicGain?.gain;
        if (!gain) return;

        if (this.originalGainValue !== null) {
            gain.value = this.originalGainValue;
            this.originalGainValue = null;
            return;
        }

        gain.value = this.getConfiguredMusicGain();
    }

    public gamePaused(isPaused: boolean, notMuteOnPause: boolean = false, pauseOverrideLayers: CategoryVolume | null = null) {
        if (notMuteOnPause) {
            if (isPaused && pauseOverrideLayers) {
                this.applyPauseLayerOverride(pauseOverrideLayers);
            } else if (!isPaused) {
                this.restorePauseLayerOverride();
            }
            return;
        }

        if (!isPaused) {
            this.restorePauseLayerOverride();
        }

        const gain = this.musicGain?.gain;
        if (!gain) return;

        if (isPaused) {
            if (this.originalGainValue === null) {
                this.originalGainValue = gain.value;
            }
            gain.value = this.originalGainValue * this.pauseIncrement;
            this.enableLowpass();
            this.enableHighpass();
        } else {
            this.restorePausedGain();
            this.disableLowpass();
            this.disableHighpass();
        }
    }

    public dispose(): void {
        this.clearFadeOutTimeout();
        this.stopRadioMode();
        this.pathSettings.clear();
        this.activeChapter = null;

        super.dispose();
    }
}
