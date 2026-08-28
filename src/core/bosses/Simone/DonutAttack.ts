import {
    Mesh,
    MeshBuilder,
    Quaternion,
    Scene,
    ShadowGenerator,
    TransformNode,
    Vector3,
} from "@babylonjs/core";

import { BaseAttack } from "../AttackManager/BaseAttack";

import { EnemyAudioEngine } from "core/audio/EnemyAudioEngine";

// 3 1 2 1 2

export interface DonutData {
    mesh: Mesh;
    center: Vector3;
    majorRadius: number;
    minorRadius: number;
    rotationQuaternion: Quaternion;
    active: boolean;
}

export class DonutAttack extends BaseAttack {
    private donuts: DonutData[] = [];

    private audioEngine: EnemyAudioEngine | null = null;

    constructor(
        scene: Scene,
        parent: TransformNode,
        private readonly onDamage: (mesh: Mesh) => void,
        withAudio: boolean = true,
    ) {
        super(scene, parent);

        if (withAudio) {
            this.audioEngine = scene.metadata.audio_engine?.getEnemyAudio();
        }
    }

    public start() {
        this.startSpawnSequence();
        this.observeCollisions();
    }

    private startSpawnSequence() {
        const schedule: { delay: number; finalDiameter: number, sound: string }[] = [
            { delay: 0, finalDiameter: 10, sound: "simone_bell_3" },
            { delay: 0.41, finalDiameter: 19, sound: "simone_bell_1" },
            { delay: 0.82, finalDiameter: 28, sound: "simone_bell_2" },
            { delay: 1.23, finalDiameter: 37, sound: "simone_bell_1" },
            { delay: 1.64, finalDiameter: 46, sound: "simone_bell_2" },
        ];

        let elapsed = 0;

        const unsubscribe = this.subscribe((dt: number) => {
            if (this.scene.metadata.gameClock.paused) return;

            elapsed += dt;

            while (schedule.length && elapsed >= schedule[0].delay) {
                const item = schedule.shift()!;

                this.spawnDonut(item.finalDiameter, item.sound);
            }

            if (schedule.length === 0) {
                this.unsubscribe(unsubscribe);
            }
        });
    }

    private getSpawnTransform() {
        return {
            position: this.parent.getAbsolutePosition().clone(),
            rotation: this.parent.absoluteRotationQuaternion?.clone(),
        };
    }

    private addShadow(mesh: Mesh) {
        const shadowGenerators = this.scene.metadata.shadows;

        shadowGenerators?.forEach((generator: ShadowGenerator) => {
            const light = generator.getLight();
            const dynamicShadow = light?.metadata?.config?.shadowType === "dynamic";

            if (dynamicShadow) {
                generator.addShadowCaster(mesh);
            }
        });
    }

    private spawnDonut(finalDiameter: number, sound: string) {
        const material = this.scene.metadata.enemy_assets.laser_active_material;

        const startDiameter = 1;
        const thickness = 0.3 / finalDiameter;

        const donut = MeshBuilder.CreateTorus(
            "simone-donut-laser-beam",
            {
                diameter: startDiameter,
                thickness,
                tessellation: 64,
            },
            this.scene,
        );

        this.addShadow(donut);

        const spawn = this.getSpawnTransform();

        donut.position.copyFrom(spawn.position);
        donut.position.y -= 1.3;

        if (spawn.rotation) {
            donut.rotationQuaternion = spawn.rotation.clone();
        }

        donut.material = material;
        donut.scaling.set(5, 1, 5);

        const donutData: DonutData = {
            mesh: donut,
            center: donut.getAbsolutePosition().clone(),
            majorRadius: (startDiameter * donut.scaling.x) / 2,
            minorRadius: thickness / 2,
            rotationQuaternion: donut.absoluteRotationQuaternion?.clone() ?? Quaternion.Identity(),
            active: true,
        };

        this.donuts.push(donutData);

        this.animateExpand(donutData, finalDiameter);

        this.audioEngine?.playSound(sound, 0.5, this.parent);
    }

    private animateExpand(donutData: DonutData, finalDiameter: number) {
        const donut = donutData.mesh;

        const duration = 1;

        let elapsed = 0;

        const startDiameter = donut.scaling.x;

        const startY = donut.position.y;

        const deltaY = 5;

        const unsubscribe = this.subscribe((dt: number) => {
            elapsed += dt;

            const progress = Math.min(elapsed / duration, 1.5);

            const easedProgress = 1 - Math.pow(1 - progress, 3);

            if (progress >= 1.5) {
                this.unsubscribe(unsubscribe);

                this.animateFall(donutData);

                return;
            }

            if (progress < 1) {
                const currentDiameter =
                    startDiameter + (finalDiameter - startDiameter) * easedProgress;

                const increasedDiameter = Math.max(5, currentDiameter);

                const currentY = startY + deltaY * easedProgress;

                donut.scaling.set(increasedDiameter, 1, increasedDiameter);

                donut.position.y = currentY;

                donut.computeWorldMatrix(true);

                donutData.center.copyFrom(donut.getAbsolutePosition());

                donutData.majorRadius = increasedDiameter / 2;

                donutData.rotationQuaternion =
                    donut.absoluteRotationQuaternion?.clone() ?? Quaternion.Identity();
            }
        });
    }

    private animateFall(donutData: DonutData) {
        const donut = donutData.mesh;

        const duration = 0.5;

        let elapsed = 0;

        const startY = donut.position.y;

        const deltaY = -5;

        const unsubscribe = this.subscribe((dt: number) => {
            elapsed += dt;

            const progress = Math.min(elapsed / duration, 1.5);

            const easedProgress = 1 - Math.pow(1 - progress, 3);

            if (progress >= 1.5) {
                donutData.active = false;

                donut.dispose();

                const index = this.donuts.indexOf(donutData);

                if (index !== -1) {
                    this.donuts.splice(index, 1);
                }

                this.unsubscribe(unsubscribe);

                if (!this.donuts.length) {
                    this.dispose();
                }

                return;
            }

            if (progress < 1) {
                const currentY = startY + deltaY * easedProgress;

                donut.position.y = currentY;

                donut.computeWorldMatrix(true);

                donutData.center.copyFrom(donut.getAbsolutePosition());
            }
        });
    }

    private observeCollisions() {
        const players = this.scene.metadata.players;

        if (!players?.length) return;

        const collidableMeshes = players
            .map((player: TransformNode) => player.getChildMeshes())
            .flat()
            .filter((mesh: TransformNode) => mesh.name.includes("hit-box"));

        if (!collidableMeshes.length) return;

        this.subscribe(() => {
            for (const mesh of collidableMeshes as Mesh[]) {
                const playerPos = mesh.getAbsolutePosition();

                for (const donut of this.donuts) {
                    if (!donut.active) continue;

                    if (
                        this.isPointInsideDonut(
                            playerPos,
                            donut.center,
                            donut.rotationQuaternion,
                            donut.majorRadius,
                        )
                    ) {
                        this.onDamage(mesh);
                    }
                }
            }
        });
    }

    private isPointInsideDonut(
        worldPoint: Vector3,
        center: Vector3,
        rotation: Quaternion,
        majorRadius: number,
    ): boolean {
        const localPoint = worldPoint
            .subtract(center)
            .applyRotationQuaternion(rotation.conjugate());

        const distXZ = Math.sqrt(localPoint.x * localPoint.x + localPoint.z * localPoint.z);

        const dx = distXZ - majorRadius;

        const dy = localPoint.y * 2;

        return dx * dx + dy * dy <= 0.35;
    }

    public override dispose() {
        this.donuts.forEach((donut) => {
            donut.mesh.dispose();
        });

        this.donuts = [];

        super.dispose();
    }
}
