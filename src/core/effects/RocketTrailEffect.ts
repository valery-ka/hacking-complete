import {
    Scene,
    Mesh,
    SolidParticleSystem,
    Color4,
    Vector3,
    MeshBuilder,
    TransformNode,
    Observer,
    Quaternion,
    SolidParticle,
} from "@babylonjs/core";

import { Nullable } from "types/common";
import { getWorldOffset } from "utils/babylon";

interface ParticleProps {
    age: number;
    lifeTime: number;
    initialPosition: Vector3;
    index: number;
    isActive: boolean;
    rocketId: number;
    spawnTime: number;
}

export class RocketTrailManager {
    private scene: Scene;
    private sps: Nullable<SolidParticleSystem> = null;
    private mesh: Nullable<Mesh> = null;
    private afterRenderObserver: Nullable<Observer<Scene>> = null;

    private rocketTrails: Map<
        number,
        {
            parent: TransformNode;
            particleIndices: number[];
            lastSpawnTime: number;
        }
    > = new Map();

    private nextRocketId = 0;
    private readonly PARTICLES_PER_ROCKET = 4;
    private readonly SPAWN_INTERVAL = 100;
    private readonly TRAIL_COLOR = new Color4(1.0, 0.7, 0.4, 1.0);

    constructor(scene: Scene) {
        this.scene = scene;
        this.initializeSPS();
    }

    private initializeSPS() {
        const MAX_ROCKETS = 100;
        const totalParticles = MAX_ROCKETS * this.PARTICLES_PER_ROCKET;

        const box = MeshBuilder.CreateBox(
            "missile-trail",
            {
                width: 0.9,
                height: 0.1,
                depth: 0.25,
            },
            this.scene,
        );

        this.sps = new SolidParticleSystem("global-rocket-trail-sps", this.scene);
        this.sps.addShape(box, totalParticles);
        this.mesh = this.sps.buildMesh();
        this.mesh.hasVertexAlpha = true;
        this.mesh.material = this.scene.metadata.enemy_assets.rocket_material_body;
        this.mesh.alwaysSelectAsActiveMesh = true;

        box.dispose();

        this.sps.initParticles = () => {
            for (let i = 0; i < this.sps!.nbParticles; i++) {
                const particle = this.sps!.particles[i];
                particle.position = new Vector3(0, -1000, 0);
                particle.rotation = Vector3.Zero();
                particle.color = this.TRAIL_COLOR.clone();

                particle.props = {
                    age: 0,
                    lifeTime: 0.4,
                    initialPosition: particle.position.clone(),
                    index: i,
                    isActive: false,
                    rocketId: -1,
                    spawnTime: 0,
                };
            }
        };

        this.sps.updateParticle = (particle) => this.updateParticle(particle);
        this.sps.initParticles();
        this.sps.setParticles();

        this.afterRenderObserver = this.scene.onAfterRenderObservable.add(() => {
            this.updateAllTrails();
        });
    }

    private checkAndResetRocketId() {
        if (this.nextRocketId >= 100) {
            this.nextRocketId = 0;
        }
    }

    public registerRocket(rocket: TransformNode): number {
        this.checkAndResetRocketId();
        const rocketId = this.nextRocketId++;

        const particleIndices: number[] = [];
        for (let i = 0; i < this.PARTICLES_PER_ROCKET; i++) {
            const particleIndex = rocketId * this.PARTICLES_PER_ROCKET + i;
            if (particleIndex < this.sps!.nbParticles) {
                particleIndices.push(particleIndex);
            }
        }

        this.rocketTrails.set(rocketId, {
            parent: rocket,
            particleIndices,
            lastSpawnTime: 0,
        });

        return rocketId;
    }

    public unregisterRocket(rocketId: number) {
        const trailInfo = this.rocketTrails.get(rocketId);
        if (!trailInfo) return;

        trailInfo.particleIndices.forEach((index) => {
            const particle = this.sps!.particles[index];
            particle.props.isActive = false;
            particle.position = new Vector3(0, -1000, 0);
        });

        this.rocketTrails.delete(rocketId);
    }

    private updateAllTrails() {
        const now = Date.now();

        this.rocketTrails.forEach((trailInfo, rocketId) => {
            if (!trailInfo.parent.metadata) {
                this.unregisterRocket(rocketId);
                return;
            }

            if (now - trailInfo.lastSpawnTime >= this.SPAWN_INTERVAL) {
                this.spawnParticleForRocket(rocketId, trailInfo);
                trailInfo.lastSpawnTime = now;
            }
        });

        this.sps?.setParticles();
    }

    private spawnParticleForRocket(rocketId: number, trailInfo: any) {
        const availableIndex = trailInfo.particleIndices.find((index: number) => {
            const particle = this.sps!.particles[index];
            return !particle.props.isActive;
        });

        if (availableIndex !== undefined) {
            const particle = this.sps!.particles[availableIndex];
            this.activateParticle(particle, rocketId, trailInfo.parent);
        }
    }

    private activateParticle(particle: SolidParticle, rocketId: number, parent: TransformNode) {
        const props = particle.props as ParticleProps;

        props.age = 0;
        props.lifeTime = 0.4;
        props.isActive = true;
        props.rocketId = rocketId;
        props.spawnTime = Date.now();

        const parentPos = parent.position.clone();
        let quat = parent.rotationQuaternion;

        if (!quat) {
            const rot = parent.rotation;
            quat = Quaternion.FromEulerAngles(rot.x, rot.y, rot.z);
        }

        const offsetLocal = new Vector3(0, 0, -0.75);
        const offsetWorld = getWorldOffset(offsetLocal, parentPos, quat.toEulerAngles());

        particle.position = offsetWorld;
        particle.rotationQuaternion = quat;
        particle.color = this.TRAIL_COLOR.clone();
    }

    private updateParticle(particle: any) {
        if (this.scene.metadata.gameClock.paused) return;

        const dt = this.scene.getEngine().getDeltaTime();
        const props = particle.props as ParticleProps;

        if (!props.isActive) {
            return particle;
        }

        props.age += dt / 1000;

        if (props.age >= props.lifeTime) {
            props.isActive = false;
            particle.position = new Vector3(0, -1000, 0);
            return particle;
        }

        const fadeStart = 0;
        const lifeRatio = props.age / props.lifeTime;

        if (particle.color) {
            if (lifeRatio < fadeStart) {
                particle.color.a = 1.0;
            } else {
                const fadeRatio = (lifeRatio - fadeStart) / (1 - fadeStart);
                particle.color.a = 1.0 - fadeRatio;
            }
        }

        return particle;
    }

    public dispose() {
        if (this.afterRenderObserver) {
            this.scene.onAfterRenderObservable.remove(this.afterRenderObserver);
            this.afterRenderObserver = null;
        }

        if (this.mesh) {
            this.mesh.material = null;
        }

        if (this.sps) {
            this.sps.dispose();
            this.sps = null;
        }

        if (this.mesh && !this.mesh.isDisposed()) {
            this.mesh.dispose();
            this.mesh = null;
        }

        this.rocketTrails.clear();
    }
}
