import {
    Scene,
    Mesh,
    SolidParticleSystem,
    StandardMaterial,
    Color3,
    Color4,
    Vector3,
    Quaternion,
    Matrix,
    Scalar,
    MeshBuilder,
    TransformNode,
    Observer,
} from "@babylonjs/core";
import { createWireCube } from "utils/babylon";

import { Nullable } from "types/common";

interface IEffect {
    create(): void;
    dispose(): void;
}

interface ParticleProps {
    lifeTime: number;
    age: number;
    initialScale: number;
    velocity: Vector3;
    gravity: number;
    initialPosition: Vector3;
}

export class PlayerTrailEffect implements IEffect {
    private scene: Scene;
    private parent: Mesh | TransformNode;

    private isLightMaterial: boolean;

    private spsNormal: Nullable<SolidParticleSystem> = null;
    private meshNormal: Nullable<Mesh> = null;
    private matNormal: Nullable<StandardMaterial> = null;

    private spsWire: Nullable<SolidParticleSystem> = null;
    private meshWire: Nullable<Mesh> = null;
    private matWire: Nullable<StandardMaterial> = null;

    private trailEnabled: boolean = false;
    private toggleIntervalId: Nullable<number> = null;

    private afterRenderObserver: Nullable<Observer<Scene>> = null;

    constructor(scene: Scene, parent: Mesh | TransformNode) {
        this.scene = scene;
        this.parent = parent;

        this.isLightMaterial = parent.name.includes("light") || parent.name.includes("god");
    }

    create() {
        const box = MeshBuilder.CreateBox("particle-box", { size: 1.0 }, this.scene);
        const wireBox = createWireCube(this.scene, { size: 1.0 });

        this.spsNormal = new SolidParticleSystem("sps-normal", this.scene);
        this.spsNormal.addShape(box, 6);
        this.meshNormal = this.spsNormal.buildMesh();
        this.meshNormal.hasVertexAlpha = true;

        this.matNormal = this.isLightMaterial ? this.getLightMaterial() : this.getDarkMaterial();
        this.meshNormal.material = this.matNormal;

        this.spsWire = new SolidParticleSystem("sps-wire", this.scene);
        this.spsWire.addShape(wireBox, 2);
        this.meshWire = this.spsWire.buildMesh();
        this.meshWire.hasVertexAlpha = true;

        this.matWire = this.isLightMaterial ? this.getLightMaterial() : this.getDarkMaterial();
        this.meshWire.material = this.matWire;

        box.dispose();
        wireBox.material?.dispose(true, true, true);
        wireBox.dispose();

        this.spsNormal.initParticles = () => {
            for (let i = 0; i < this.spsNormal!.nbParticles; i++) {
                this.initializeParticle(this.spsNormal!.particles[i]);
            }
        };
        this.spsNormal.updateParticle = (p) => this.updateParticle(p);

        this.spsWire.initParticles = () => {
            for (let i = 0; i < this.spsWire!.nbParticles; i++) {
                this.initializeParticle(this.spsWire!.particles[i]);
            }
        };
        this.spsWire.updateParticle = (p) => this.updateParticle(p);

        this.spsNormal.initParticles();
        this.spsNormal.setParticles();
        this.spsWire.initParticles();
        this.spsWire.setParticles();

        this.spsNormal.mesh.alwaysSelectAsActiveMesh = true;
        this.spsWire.mesh.alwaysSelectAsActiveMesh = true;

        this.afterRenderObserver = this.scene.onAfterRenderObservable.add(() => {
            this.spsNormal?.setParticles();
            this.spsWire?.setParticles();
        });
    }

    dispose() {
        this.meshNormal?.dispose();
        this.meshWire?.dispose();
        this.spsNormal = null;
        this.spsWire = null;
        this.meshNormal = null;
        this.meshWire = null;
        this.matNormal = null;
        this.matWire = null;

        if (this.toggleIntervalId !== null) {
            clearInterval(this.toggleIntervalId);
            this.toggleIntervalId = null;
        }

        if (this.afterRenderObserver) {
            this.scene.onAfterRenderObservable.remove(this.afterRenderObserver);
            this.afterRenderObserver = null;
        }
    }

    public enableTrail() {
        this.trailEnabled = true;
    }

    public disableTrail() {
        this.trailEnabled = false;
    }

    private getLightMaterial(): StandardMaterial {
        return this.scene.metadata.effects_assets.cubes_explosion_light_material;
    }

    private getDarkMaterial(): StandardMaterial {
        return this.scene.metadata.effects_assets.cubes_explosion_dark_material;
    }

    private initializeParticle(particle: any) {
        const playerPos = this.parent.position.clone();
        particle.position = this.randomPosition(playerPos);
        particle.rotation = this.randomRotation();
        const scale = 0;
        particle.scale = new Vector3(scale, scale, scale);
        particle.color = new Color4(0.97, 0.95, 0.94, 1.0);

        particle.props = {
            lifeTime: Scalar.RandomRange(0.1, 0.2),
            age: 0,
            initialScale: scale,
            velocity: this.randomVelocity(),
            gravity: 0,
            initialPosition: particle.position.clone(),
        };
    }

    private updateParticle(particle: any) {
        const gameClock = this.scene.metadata.gameClock;
        if (gameClock.paused) return;

        const playerClockSpeed = gameClock.playerSpeed;

        const dt = this.scene.getEngine().getDeltaTime() * playerClockSpeed;
        const props = particle.props as ParticleProps;

        if (props.age >= props.lifeTime) {
            this.resetParticle(particle);
            return particle;
        }

        const lerp = (speed: number) => 1 - Math.pow(1 - speed, dt / 16.6667);

        props.velocity.y += props.gravity * lerp(0.05);
        particle.position.copyFrom(props.initialPosition);
        particle.position.addInPlace(props.velocity.scale(props.age * 10));

        const fadeStart = 0.75;
        const lifeRatio = props.age / props.lifeTime;

        if (particle.color) {
            if (lifeRatio < fadeStart) {
                particle.color.a = 1.0;
            } else {
                const fadeRatio = (lifeRatio - fadeStart) / (1 - fadeStart);
                particle.color.a = 1.0 - fadeRatio;
            }
        }

        props.age += lerp(0.005);
        particle.rotation.x += lerp(0.01);
        particle.rotation.y += lerp(0.01);

        return particle;
    }

    private resetParticle(particle: any) {
        const props = particle.props as ParticleProps;
        props.age = 0;
        props.lifeTime = Scalar.RandomRange(0.1, 0.2);

        const playerPos = this.parent.position.clone();
        particle.position = this.randomPosition(playerPos);

        const scale = this.trailEnabled ? Scalar.RandomRange(0.1, 0.4) : 0;
        particle.scale.set(scale, scale, scale);

        props.initialPosition.copyFrom(particle.position);
        props.velocity = this.randomVelocity();
        particle.color = new Color4(0.97, 0.95, 0.94, 1.0);
    }

    private randomPosition(center: Vector3): Vector3 {
        const range = 0.5;
        const localOffset = new Vector3(
            Scalar.RandomRange(-range, range),
            0,
            Scalar.RandomRange(-range, range),
        );

        let q: Quaternion | null = null;
        if (this.parent.rotationQuaternion) {
            q = this.parent.rotationQuaternion;
        } else if (this.parent) {
            q = Quaternion.FromEulerVector(this.parent.rotation);
        }

        if (q) {
            const rotationMatrix = new Matrix();
            q.toRotationMatrix(rotationMatrix);
            const worldOffset = Vector3.TransformCoordinates(localOffset, rotationMatrix);
            return center.add(worldOffset);
        }

        return center.add(localOffset);
    }

    private randomRotation(): Vector3 {
        const localRot = new Vector3(
            Scalar.RandomRange(0, Math.PI * 2),
            Scalar.RandomRange(0, Math.PI * 2),
            Scalar.RandomRange(0, Math.PI * 2),
        );

        const localQuat = Quaternion.FromEulerVector(localRot);

        let parentQuat: Quaternion | null = null;
        if (this.parent.rotationQuaternion) parentQuat = this.parent.rotationQuaternion;
        else if (this.parent) parentQuat = Quaternion.FromEulerVector(this.parent.rotation);

        if (parentQuat) {
            const worldQuat = localQuat.multiply(parentQuat);
            return worldQuat.toEulerAngles();
        }

        return localRot;
    }

    private randomVelocity(): Vector3 {
        return new Vector3(
            Scalar.RandomRange(-0.1, 0.1),
            Scalar.RandomRange(0.01, 0.05),
            Scalar.RandomRange(-0.1, 0.1),
        )
            .normalize()
            .scale(Scalar.RandomRange(0.0, 1.0));
    }

    public updateMaterial(type: "light" | "dark" | "dual"): void {
        let normalMaterial: StandardMaterial;
        let wireMaterial: StandardMaterial;

        switch (type) {
            case "light":
                normalMaterial = this.getLightMaterial();
                wireMaterial = this.getLightMaterial();
                this.isLightMaterial = true;
                break;
            case "dark":
                normalMaterial = this.getDarkMaterial();
                wireMaterial = this.getDarkMaterial();
                this.isLightMaterial = false;
                break;
            case "dual":
                normalMaterial = this.getLightMaterial();
                wireMaterial = this.getDarkMaterial();
                break;
        }

        this.matNormal = normalMaterial;
        this.matWire = wireMaterial;

        if (this.meshNormal) {
            this.meshNormal.material = this.matNormal;
        }

        if (this.meshWire) {
            this.meshWire.material = this.matWire;
        }

        if (this.spsNormal) {
            this.spsNormal.setParticles();
        }
        if (this.spsWire) {
            this.spsWire.setParticles();
        }
    }
}
