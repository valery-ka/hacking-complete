import { Scene } from "@babylonjs/core";

type GameClockListener = (dt: number, time: number, speed: number) => void;
type PauseListener = (paused: boolean) => void;

const RADICAL_6 = Math.sqrt(6);
/** Caps hitch / background-tab spikes so timers don't catch up in one frame. */
const MAX_DELTA_TIME = 0.05;

export class GameClock {
    private globalDeltaTime = 0;

    private time = 0;
    private speed = 1;
    private paused = false;
    private listeners = new Set<GameClockListener>();
    private pauseListeners = new Set<PauseListener>();

    private playerSpeed = 1;

    constructor(private scene: Scene) {
        this.scene.onBeforeRenderObservable.add(this.tick);
    }

    private tick = () => {
        this.scene.animatables.forEach((anim) => {
            anim.speedRatio = this.paused ? 0 : this.speed;
        });

        const rawDt = Math.min(this.scene.getEngine().getDeltaTime() / 1000, MAX_DELTA_TIME);
        this.globalDeltaTime = rawDt;

        this.updateWorldClock(rawDt);
    };

    private updateWorldClock(rawDt: number) {
        if (this.paused) return;

        const dt = rawDt * this.speed;
        this.time += dt;

        for (const listener of this.listeners) {
            listener(dt, this.time, this.speed);
        }
    }

    public setSpeed(speed: number = RADICAL_6) {
        this.speed = speed;
    }

    public resetSpeed() {
        this.speed = 1;
    }

    public setPlayerSpeed(speed: number = 1 / RADICAL_6) {
        this.playerSpeed = speed;
    }

    public resetPlayerSpeed() {
        this.playerSpeed = 1;
    }

    public setPaused(paused: boolean) {
        if (this.paused === paused) return;

        this.paused = paused;

        for (const fn of this.pauseListeners) {
            fn(paused);
        }
    }

    public onPauseChange(fn: PauseListener) {
        this.pauseListeners.add(fn);
        return () => this.pauseListeners.delete(fn);
    }

    public subscribe(fn: GameClockListener) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    public getTime() {
        return this.time;
    }

    public getGlobalDeltaTime() {
        return this.globalDeltaTime;
    }

    public dispose() {
        this.scene.onBeforeRenderObservable.removeCallback(this.tick);
        this.listeners.clear();
        this.pauseListeners.clear();
    }
}
