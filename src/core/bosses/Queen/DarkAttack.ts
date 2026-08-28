import { Scene, TransformNode } from "@babylonjs/core";

import { BaseAttack } from "../AttackManager/BaseAttack";
import { EnemyShooter } from "core/enemy/EnemyShooter";

import { EnemyConfig } from "types/enemy/Enemies.types";

import { generateDirections } from "utils/math";

import { DARK_BULLETS } from "./QueenConfig";

const DIRECTIONS = 22;

const PATTERN: [number, number, number][] = Array(DIRECTIONS).fill([0, 1, 1]);

const DUMMY_ENEMY_CONFIG: EnemyConfig = {
    trigger: { pool: { self: 0, to_trigger: 0 } },
    enemy_type: "sphere",
    on_spawn: { position: { x: 0, y: 0, z: 0 }, rotation_y: 0, hp: 0 },
    ground: { id: 0, physics: "plane", size: 0 },
    is_inside_ground: false,
    follow_player: { enabled: false },
    triggers_by_player: [false, false],
    rotate_to_player: { enabled: false },
    auto_rotation: { enabled: false },
    animation: { enabled: false },
    shooter: {
        enabled: true,
        initial_delay: 10,
        cooldown: 100,
        directions: generateDirections(DIRECTIONS / 2),
        pattern: PATTERN,
        spreading: 0.001,
    },
};

export class DarkAttack extends BaseAttack {
    private darkBulletsNode: TransformNode;
    private shooter: EnemyShooter;
    private delays: number[];
    private count: number;
    private onCountUpdate?: (newCount: number) => void;

    constructor(
        scene: Scene,
        parent: TransformNode,
        count: number,
        onCountUpdate?: (newCount: number) => void,
    ) {
        super(scene, parent);

        this.darkBulletsNode = new TransformNode("dark-bullets-node");
        this.darkBulletsNode.parent = parent;
        this.darkBulletsNode.metadata = { config: DUMMY_ENEMY_CONFIG };

        this.shooter = new EnemyShooter(this.scene, this.darkBulletsNode);
        this.shooter.shooterEnabled = false;

        this.delays = DARK_BULLETS;
        this.count = count;
        this.onCountUpdate = onCountUpdate;
    }

    public start() {
        this.fireSequence();
    }

    private fireSequence() {
        let elapsed = 0;

        let currentIndex = 0;

        const unsubscribe = this.subscribe((dt: number) => {
            if (this.scene.metadata.gameClock.paused) {
                return;
            }

            elapsed += dt;

            while (
                currentIndex < this.delays.length &&
                elapsed >= this.delays[currentIndex] / 1000
            ) {
                this.shooter.triggerShot();
                this.shooter.triggerShot();

                currentIndex++;
                this.count++;

                if (this.onCountUpdate) {
                    this.onCountUpdate(this.count);
                }
            }

            if (currentIndex >= this.delays.length) {
                this.unsubscribe(unsubscribe);
                this.finish();
                this.disposeAfterBulletsClear();
            }
        });
    }

    private disposeAfterBulletsClear() {
        const unsubscribe = this.subscribe(() => {
            if (this.shooter.hasActiveBullets()) {
                return;
            }

            this.unsubscribe(unsubscribe);
            this.dispose();
        });
    }

    public override dispose() {
        if (this.isDisposed) return;

        this.shooter.dispose();

        if (!this.darkBulletsNode.isDisposed()) {
            this.darkBulletsNode.dispose();
        }

        super.dispose();
    }
}
