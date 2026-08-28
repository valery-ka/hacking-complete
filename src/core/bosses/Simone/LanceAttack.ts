import { Mesh, MeshBuilder, Scene, TransformNode } from "@babylonjs/core";

import { BaseAttack } from "../AttackManager/BaseAttack";

import { EnemyAudioEngine } from "core/audio/EnemyAudioEngine";

// 2

export class LanceAttack extends BaseAttack {
    private beams: Mesh[] = [];

    private collisionUnsubscribe: (() => void) | null = null;

    private readonly ATTACK_DELAY = 1;
    private readonly ATTACK_DURATION = 5;

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
        this.createBeams();
        this.activateAfterDelay();
    }

    private createBeams() {
        const rays = 5;
        const angleStep = (Math.PI * 2) / rays;

        const material = this.scene.metadata.enemy_assets.laser_inactive_material;

        for (let i = 0; i < rays; i++) {
            const angle = i * angleStep;

            const beam = MeshBuilder.CreateCylinder(
                `simone-lance-laser-beam-${i}`,
                {
                    height: 100,
                    diameter: 0.35,
                    tessellation: 4,
                },
                this.scene,
            );

            beam.parent = this.parent;

            beam.rotation.z = Math.PI / 2;
            beam.rotation.y = angle;

            beam.position.y = -1.3;

            beam.material = material;

            this.beams.push(beam);
        }
    }

    private activateAfterDelay() {
        let elapsed = 0;

        const unsubscribe = this.subscribe((dt: number) => {
            elapsed += dt;

            if (elapsed >= this.ATTACK_DELAY) {
                this.unsubscribe(unsubscribe);

                this.activate();
            }
        });
    }

    private deactivateAfterDuration() {
        let elapsed = 0;

        const unsubscribe = this.subscribe((dt: number) => {
            elapsed += dt;

            if (elapsed >= this.ATTACK_DURATION) {
                this.unsubscribe(unsubscribe);

                this.deactivate();
            }
        });
    }

    private activate() {
        const activeMaterial = this.scene.metadata.enemy_assets.laser_active_material;

        this.beams.forEach((beam) => {
            beam.material = activeMaterial;
        });

        this.observeCollisions();
        this.deactivateAfterDuration();

        this.audioEngine?.playSound("simone_bell_2", 0.5, this.parent);
    }

    private deactivate() {
        const inactiveMaterial = this.scene.metadata.enemy_assets.laser_inactive_material;

        this.beams.forEach((beam) => {
            beam.material = inactiveMaterial;
        });

        if (this.collisionUnsubscribe) {
            this.unsubscribe(this.collisionUnsubscribe);

            this.collisionUnsubscribe = null;
        }

        this.disposeAfterDelay();
    }

    private disposeAfterDelay() {
        let elapsed = 0;

        const unsubscribe = this.subscribe((dt: number) => {
            elapsed += dt;

            if (elapsed >= this.ATTACK_DELAY) {
                this.unsubscribe(unsubscribe);

                this.dispose();
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

        this.collisionUnsubscribe = this.subscribe(() => {
            for (const mesh of collidableMeshes as Mesh[]) {
                for (const beam of this.beams) {
                    if (mesh.intersectsMesh(beam, true)) {
                        this.onDamage(mesh);
                    }
                }
            }
        });
    }

    public override dispose() {
        if (this.isDisposed) return;

        if (this.collisionUnsubscribe) {
            this.unsubscribe(this.collisionUnsubscribe);

            this.collisionUnsubscribe = null;
        }

        this.beams.forEach((beam) => {
            beam.dispose();
        });

        this.beams = [];

        super.dispose();
    }
}
