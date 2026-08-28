import { Scene, ParticleSystem, Texture, Vector3, Observer } from "@babylonjs/core";

import { Nullable } from "types/common";
import * as EffectsTypes from "types/effects/Effects.types";

export class Particles {
    private scene: Scene;
    private starsObserver: Nullable<Observer<Scene>> = null;
    public backgroundStars: Nullable<ParticleSystem> = null;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public create(config: EffectsTypes.EffectsConfig) {
        this.createStars(config.stars);
    }

    public createStars(starsConfig: EffectsTypes.StarsConfig) {
        const STARS_AMOUNT = starsConfig.amount;

        const OUTER_SIZE = starsConfig.outer_box_size;
        const INNER_SIZE = starsConfig.inner_box_size;

        const Y_MIN = starsConfig.min_box_height;
        const Y_MAX = starsConfig.max_box_height;

        this.backgroundStars = new ParticleSystem("stars", STARS_AMOUNT, this.scene);

        this.backgroundStars.particleTexture = new Texture("textures/flare.png", this.scene);
        this.backgroundStars.emitter = new Vector3(0, 0, 0);

        this.backgroundStars.startPositionFunction = function (worldMatrix, position) {
            let x, y, z;

            do {
                x = Math.random() * (OUTER_SIZE * 2) - OUTER_SIZE;
                y = Y_MIN + Math.random() * (Y_MAX - Y_MIN);
                z = Math.random() * (OUTER_SIZE * 2) - OUTER_SIZE;
            } while (Math.abs(x) < INNER_SIZE && Math.abs(z) < INNER_SIZE);

            position.x = x;
            position.y = y;
            position.z = z;
        };

        this.backgroundStars.minSize = 0.1;
        this.backgroundStars.maxSize = 0.5;

        this.backgroundStars.minLifeTime = Number.MAX_SAFE_INTEGER;
        this.backgroundStars.maxLifeTime = Number.MAX_SAFE_INTEGER;

        this.backgroundStars.emitRate = STARS_AMOUNT;
        this.backgroundStars.targetStopDuration = 1;

        this.starsObserver = this.scene.onBeforeRenderObservable.add(() => {
            if (!this.backgroundStars) return;
            this.backgroundStars.paused = this.scene.metadata.gameClock.paused;
        });
    }

    public enableStars() {
        if (this.backgroundStars) {
            this.backgroundStars.start();
        }
    }

    public disableStars() {
        if (this.backgroundStars) {
            this.backgroundStars.stop();
            this.backgroundStars.reset();
        }
    }

    public dispose() {
        if (this.backgroundStars) {
            this.backgroundStars.dispose(true, true, true);
            this.backgroundStars = null;
        }
        if (this.starsObserver) {
            this.scene.onBeforeRenderObservable.remove(this.starsObserver);
            this.starsObserver = null;
        }
    }
}
