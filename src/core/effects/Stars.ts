import {
    Scene,
    Vector3,
    Observer,
    StandardMaterial,
    Color4,
    Scalar,
    SolidParticleSystem,
    MeshBuilder,
    Mesh,
} from "@babylonjs/core";

import { Nullable } from "types/common";
import * as EffectsTypes from "types/effects/Effects.types";

const STARS_COLOR = new Color4(0.91, 0.87, 0.73, 0.9);

export class StarsSPS {
    private scene: Scene;
    private starsObserver: Nullable<Observer<Scene>> = null;
    private spsStars: Nullable<SolidParticleSystem> = null;
    private starsMesh: Nullable<Mesh> = null;
    private starsMaterial: Nullable<StandardMaterial> = null;

    private starsConfig: EffectsTypes.StarsConfig | null = null;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public create(config: EffectsTypes.EffectsConfig) {
        this.createStars(config.stars);
    }

    public createStars(starsConfig: EffectsTypes.StarsConfig) {
        this.starsConfig = starsConfig;
        const STARS_AMOUNT = starsConfig.amount;

        const cube = MeshBuilder.CreateBox("star-cube", { size: 1.0 }, this.scene);

        this.spsStars = new SolidParticleSystem("stars-sps", this.scene);
        this.spsStars.addShape(cube, STARS_AMOUNT);
        this.starsMesh = this.spsStars.buildMesh();
        this.starsMesh.hasVertexAlpha = true;

        this.starsMaterial = this.getLightMaterial();
        this.starsMesh.material = this.starsMaterial;

        cube.dispose();

        this.spsStars.initParticles = () => {
            for (let i = 0; i < this.spsStars!.nbParticles; i++) {
                this.initializeStarParticle(this.spsStars!.particles[i]);
            }
        };

        this.spsStars.updateParticle = (p) => this.updateStarParticle(p);

        this.spsStars.initParticles();
        this.spsStars.setParticles();

        this.starsMesh.alwaysSelectAsActiveMesh = true;

        this.starsObserver = this.scene.onBeforeRenderObservable.add(() => {
            if (this.spsStars && this.scene.metadata.gameClock.paused) {
                return;
            }
            this.spsStars?.setParticles();
        });
    }

    private initializeStarParticle(particle: any) {
        const config = this.starsConfig!;
        const OUTER_SIZE = config.outer_box_size;
        const INNER_SIZE = config.inner_box_size;
        const Y_MIN = config.min_box_height;
        const Y_MAX = config.max_box_height;

        let x, y, z;

        do {
            x = Math.random() * (OUTER_SIZE * 2) - OUTER_SIZE;
            y = Y_MIN + Math.random() * (Y_MAX - Y_MIN);
            z = Math.random() * (OUTER_SIZE * 2) - OUTER_SIZE;
        } while (Math.abs(x) < INNER_SIZE && Math.abs(z) < INNER_SIZE);

        particle.position = new Vector3(x, y, z);

        const scale = Scalar.RandomRange(0.2, 0.6);
        particle.scale = new Vector3(scale, scale, scale);

        particle.color = STARS_COLOR;

        const direction = new Vector3(
            Scalar.RandomRange(-1, 1),
            Scalar.RandomRange(-1, 1),
            Scalar.RandomRange(-1, 1),
        ).normalize();

        const speed = Scalar.RandomRange(0.05, 0.1);

        particle.props = {
            originalPosition: particle.position.clone(),
            direction: direction,
            speed: speed,
        };
    }

    private updateStarParticle(particle: any) {
        if (this.scene.metadata.gameClock.paused) return particle;

        const config = this.starsConfig!;
        const OUTER_SIZE = config.outer_box_size;
        const INNER_SIZE = config.inner_box_size;
        const Y_MIN = config.min_box_height;
        const Y_MAX = config.max_box_height;

        const dt = this.scene.getEngine().getDeltaTime();
        const lerp = (speed: number) => 1 - Math.pow(1 - speed, dt / 16.6667);

        const moveDistance = particle.props.speed * lerp(0.05);
        particle.position.x += particle.props.direction.x * moveDistance;
        particle.position.y += particle.props.direction.y * moveDistance;
        particle.position.z += particle.props.direction.z * moveDistance;

        const isOutsideX = Math.abs(particle.position.x) > OUTER_SIZE;
        const isOutsideY = particle.position.y < Y_MIN || particle.position.y > Y_MAX;
        const isOutsideZ = Math.abs(particle.position.z) > OUTER_SIZE;

        const isInExclusionZone =
            Math.abs(particle.position.x) < INNER_SIZE &&
            Math.abs(particle.position.z) < INNER_SIZE;

        if (isOutsideX || isOutsideY || isOutsideZ || isInExclusionZone) {
            let x, y, z;
            do {
                x = Math.random() * (OUTER_SIZE * 2) - OUTER_SIZE;
                y = Y_MIN + Math.random() * (Y_MAX - Y_MIN);
                z = Math.random() * (OUTER_SIZE * 2) - OUTER_SIZE;
            } while (Math.abs(x) < INNER_SIZE && Math.abs(z) < INNER_SIZE);

            particle.position.set(x, y, z);

            const newDirection = new Vector3(
                Scalar.RandomRange(-1, 1),
                Scalar.RandomRange(-1, 1),
                Scalar.RandomRange(-1, 1),
            ).normalize();

            particle.props.direction = newDirection;
            particle.props.speed = Scalar.RandomRange(0.05, 0.2);
        }

        return particle;
    }

    private getLightMaterial(): StandardMaterial {
        return this.scene.metadata.effects_assets?.cubes_explosion_light_material;
    }

    public enableStars() {
        if (this.starsMesh) {
            this.starsMesh.isVisible = true;
        }
    }

    public disableStars() {
        if (this.starsMesh) {
            this.starsMesh.isVisible = false;
        }
    }

    public dispose() {
        if (this.starsObserver) {
            this.scene.onBeforeRenderObservable.remove(this.starsObserver);
            this.starsObserver = null;
        }

        if (this.starsMesh) {
            this.starsMesh.material = null;
        }

        if (this.spsStars) {
            this.spsStars.dispose();
            this.spsStars = null;
        }

        if (this.starsMesh && !this.starsMesh.isDisposed()) {
            this.starsMesh.dispose();
        }

        this.starsMesh = null;
        this.starsMaterial = null;
    }
}
