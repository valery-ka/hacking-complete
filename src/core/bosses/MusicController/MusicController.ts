import { AbstractSound, Scene } from "@babylonjs/core";

import { MusicAudioEngine } from "core/audio/MusicAudioEngine";

import { Nullable } from "types/common";

import { CategoryVolume } from "types/music/MusicConfig.types";

export class MusicController {
    private musicAudioEngine: Nullable<MusicAudioEngine> = null;
    private scene: Nullable<Scene> = null;
    private unsubPauseChange: Nullable<() => void> = null;

    private activeTracks = new Set<string>();
    private pausedByController = new Set<string>();
    private wasGamePaused = false;

    constructor(musicAudioEngine: MusicAudioEngine, scene?: Scene) {
        this.musicAudioEngine = musicAudioEngine;

        if (scene) {
            this.bindGamePause(scene);
        }
    }

    private bindGamePause(scene: Scene) {
        this.scene = scene;

        const clock = scene.metadata?.gameClock;
        this.wasGamePaused = !!clock?.paused;

        // Must sync immediately on setPaused — render loop is frozen while the tab is hidden.
        this.unsubPauseChange =
            clock?.onPauseChange?.((paused: boolean) => {
                this.syncPauseState(paused);
            }) ?? null;
    }

    private syncPauseState(paused: boolean) {
        if (paused === this.wasGamePaused) return;

        this.wasGamePaused = paused;

        if (paused) {
            this.pauseMusic();
        } else {
            this.resumeMusic();
        }
    }

    public setLayersVolume(volumes: CategoryVolume, duration: number = 0.0) {
        if (this.musicAudioEngine !== null) {
            this.musicAudioEngine.setLayersVolume(volumes, duration);
        }
    }

    public playMusic(name: string, volume: number = 1.0): AbstractSound | undefined {
        if (this.musicAudioEngine === null) return;

        if (this.musicAudioEngine.isRadioModeEnabled()) return;

        const music = this.musicAudioEngine.getSound(name);
        if (music) {
            music.volume = volume;
            music.play();
            this.activeTracks.add(name);
            this.pausedByController.delete(name);

            if (this.wasGamePaused) {
                music.pause();
                this.pausedByController.add(name);
            }

            return music;
        }
    }

    public stopMusic(name: string) {
        if (this.musicAudioEngine !== null) {
            const music = this.musicAudioEngine.getSound(name);
            if (music) {
                music.stop();
            }
        }

        this.activeTracks.delete(name);
        this.pausedByController.delete(name);
    }

    public stopAllMusic() {
        if (this.musicAudioEngine !== null) {
            this.musicAudioEngine.stopMusic();
        }

        this.activeTracks.clear();
        this.pausedByController.clear();
    }

    public pauseMusic() {
        if (this.musicAudioEngine === null) return;

        for (const name of this.activeTracks) {
            const music = this.musicAudioEngine.getSound(name);
            if (!music) continue;

            music.pause();
            this.pausedByController.add(name);
        }
    }

    public resumeMusic() {
        if (this.musicAudioEngine === null) return;

        for (const name of this.pausedByController) {
            const music = this.musicAudioEngine.getSound(name);
            if (!music) continue;

            music.resume();
        }

        this.pausedByController.clear();
    }

    public dispose() {
        if (this.unsubPauseChange) {
            this.unsubPauseChange();
            this.unsubPauseChange = null;
        }

        this.scene = null;
        this.activeTracks.clear();
        this.pausedByController.clear();

        if (this.musicAudioEngine) {
            this.musicAudioEngine = null;
        }
    }
}
