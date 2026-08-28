import {
    TransformNode,
    Vector3,
    Scene,
    Mesh,
    ShadowGenerator,
    MeshBuilder,
    Color3,
} from "@babylonjs/core";

import { EnemyConfig } from "types/enemy/Enemies.types";
import { EnemyAnimationFactory } from "core/animations/EnemyAnimationFactory";

import { EnemyShooter } from "./EnemyShooter";
import { EnemyMovement } from "./EnemyMovement";
import { EnemyAOE } from "./EnemyAOE";

import { addCallbacks, sanitizeMetadata } from "utils/babylon";
import { getScaledEnemyHp } from "utils/autoAim";

import { EnemyAudioEngine } from "core/audio/EnemyAudioEngine";
import { VoiceAudioEngine } from "core/audio/VoiceAudioEngine";

export abstract class Enemy {
    protected scene: Scene;
    public config: EnemyConfig;

    public node!: TransformNode;
    protected mesh!: Mesh;
    protected collider!: Mesh;

    public movement!: EnemyMovement;
    public shooter!: EnemyShooter;
    public aoe: EnemyAOE;

    public runningAway: boolean = false;

    public isInvincible = false;
    public hp: number;
    private maxHp: number;
    private iframeDuration = 200;

    private debugArrows?: Mesh[];

    public audioEngine: EnemyAudioEngine;
    public voiceEngine: VoiceAudioEngine;

    constructor(scene: Scene, enemy_config: EnemyConfig, index?: number) {
        this.scene = scene;
        this.config = enemy_config;

        this.hp = getScaledEnemyHp(
            enemy_config.on_spawn.hp ?? 3,
            enemy_config.enemy_type,
            enemy_config.scale_hp_by_difficulty,
        );
        this.maxHp = this.hp;

        this.node = new TransformNode(`enemy-node-${index}-${enemy_config.enemy_type}`, this.scene);
        this.node.metadata = {
            ...this.node.metadata,
            config: enemy_config,
            pool: enemy_config.trigger.pool,
            spawned: false,
        };

        this.audioEngine = scene.metadata.audio_engine?.getEnemyAudio();
        this.voiceEngine = scene.metadata.audio_engine?.getVoiceAudio();

        addCallbacks(this.node, {
            on_damage: (iframes?: number, amount?: number, ignoreInvincible?: boolean) =>
                this.onDamage(this.node, undefined, iframes, amount, ignoreInvincible),
            destroy: (force: boolean, useBomb: boolean) => this.handleDestroy(force, useBomb),
        });

        this.scene.metadata.enemies.push(this.node);

        this.runningAway = !!(
            this.config.follow_player?.speed && this.config.follow_player?.speed < 0
        );

        const isInsideMovement = this.config.is_inside_ground;
        this.node!.rotation.z = isInsideMovement ? Math.PI : 0;

        this.aoe = new EnemyAOE(scene, this);

        // this.createDebugArrows(this.config.shooter.directions!);
    }

    public abstract createMeshInstance(position: Vector3, behaviour: any): void;

    public initializeEnemyShooter() {
        this.shooter = new EnemyShooter(this.scene, this.node);

        const disabledOnStart = this.config.shooter.disabled_on_start;
        if (disabledOnStart) {
            this.shooter.shooterEnabled = false;
        }

        const reflection = this.config.reflection;
        const reflectionEnabled = reflection?.enabled;
        if (!reflection || !reflectionEnabled) return;

        this.shooter.shooterEnabled = false;
    }

    public initializeEnemyBehaviour() {
        this.movement = new EnemyMovement(this.scene, this.node, this.collider);

        if (this.config.rotate_to_player.enabled) this.movement.rotateLocalYToPlayer();
        if (this.config.auto_rotation.enabled) this.movement.rotateLocalY();

        if (this.config.follow_player.enabled) {
            this.movement.followPlayer();
            if (this.config.follow_player?.speed && this.config.follow_player?.speed < 0) {
                this.mesh.rotation.y = Math.PI;

                this.mesh.metadata ??= {};
                this.mesh.metadata.flipped = true;
            }
        }

        if (this.config.animation.enabled) this.animate();
    }

    public onSpawn(iframes: number = 500) {
        this.node.metadata.spawned = true;

        if (this.config.on_spawn.spawn_animation !== false) {
            if (
                this.config.enemy_type === "cylinder-bomb" ||
                this.config.enemy_type === "kamikaze"
            ) {
                const effect = this.scene.metadata?.effects?.enemy_cylinder_bomb_spawn_animation;
                effect?.apply(this.node);
            } else {
                const effect = this.scene.metadata?.effects?.enemy_spawn_animation;
                effect?.apply(this.node);
            }
        } else if (this.config.on_spawn.spawn_animation === undefined) {
            if (
                this.config.enemy_type === "cylinder-bomb" ||
                this.config.enemy_type === "kamikaze"
            ) {
                const effect = this.scene.metadata?.effects?.enemy_cylinder_bomb_spawn_animation;
                effect?.apply(this.node);
            } else {
                const effect = this.scene.metadata?.effects?.enemy_spawn_animation;
                effect?.apply(this.node);
            }
        }


        if (this.config.sounds?.on_spawn) {
            const engine = this.config.sounds.on_spawn.engine;
            if (engine === "enemy") {
                const sound = this.config.sounds.on_spawn.sound[Math.floor(Math.random() * this.config.sounds.on_spawn.sound.length)];
                this.audioEngine?.playSound(sound, 1.0, this.node);
            } else if (engine === "voice") {
                const sound = this.config.sounds.on_spawn.sound[Math.floor(Math.random() * this.config.sounds.on_spawn.sound.length)];
                this.voiceEngine?.playSound(sound, 1.0, this.node);
            }
        } else {
            this.audioEngine?.playSound("enemy_spawn", 1.0, this.node);
        }

        this.triggerIframes(iframes);
    }

    public onDamage(
        enemy: TransformNode,
        passRotation?: Vector3,
        iframes?: number,
        amount: number = 1,
        ignoreInvincible: boolean = false,
    ) {
        if (!enemy || (this.isInvincible && !ignoreInvincible)) return;

        if (this.node.metadata.has_shield) {
            this.scene.metadata?.effects.player_bullet_hits_shield?.apply(enemy);
            this.audioEngine?.playSound("enemy_shield_hit", 1.0, this.node);
            return;
        }

        this.hp -= amount;

        if (this.config.enemy_type === "sphere") {
            this.scene.metadata.effects.core_damage?.apply(enemy);
        } else {
            this.scene.metadata.effects.enemy_damage?.apply(enemy, passRotation);
        }

        if (this.config.enemy_type !== "rocket") {
            if (this.config.sounds?.on_damage) {
                const engine = this.config.sounds.on_damage.engine;
                if (engine === "enemy") {
                    const sound = this.config.sounds.on_damage.sound[Math.floor(Math.random() * this.config.sounds.on_damage.sound.length)];
                    this.audioEngine?.playSound(sound, 1.0, this.node);
                } else if (engine === "voice") {
                    const sound = this.config.sounds.on_damage.sound[Math.floor(Math.random() * this.config.sounds.on_damage.sound.length)];
                    this.voiceEngine?.playSound(sound, 1.0, this.node);
                }
            } else {
                this.audioEngine?.playSound("enemy_damage", 1.0, this.node);
            }
        }

        if (this.handleDestroy()) return;
        this.triggerIframes(iframes);
        this.reflectWave();
    }

    public reflectWave() {
        const reflection = this.config.reflection;
        const reflectionEnabled = reflection?.enabled;
        if (!reflection || !reflectionEnabled) return;

        let time = reflection.time;
        if (reflection.by_hp) {
            time = 0.15 * (this.maxHp - this.hp);
        }

        this.shooter.shooterEnabled = true;

        const gameClock = this.scene.metadata.gameClock;
        let elapsed = 0;

        const unsubscribe = gameClock.subscribe((dt: number) => {
            elapsed += dt;

            if (elapsed >= time) {
                unsubscribe();
                this.shooter.shooterEnabled = false;
            }
        });
    }

    private destroyEffects() {
        const explosion = this.scene.metadata?.effects?.cubes_explosion;

        if (
            this.config.enemy_type === "sphere" ||
            this.config.enemy_type === "simone" ||
            this.config.enemy_type === "shadowlord" ||
            this.config.enemy_type === "zero"
        ) {
            const effect = this.scene.metadata?.effects?.core_destroy;
            effect?.apply(this.node);
            explosion?.applyCore(this.node);
            this.scene.metadata.killing_counter++;
            this.audioEngine?.playSound("enemy_core_destroy", 1.0, this.node);
        } else if (this.config.enemy_type === "box") {
            this.scene.metadata.effects.box_destroy?.apply(this.node);
            this.audioEngine?.playSound("enemy_destroy", 0.5, this.node);
        } else if (this.config.enemy_type === "rabbit") {
            const effect = this.scene.metadata?.effects?.core_destroy;
            effect?.apply(this.node);
            explosion?.applyCore(this.node);
            this.audioEngine?.playSound("enemy_core_destroy", 1.0, this.node);
        } else if (this.config.enemy_type === "cylinder-bomb") {
            this.scene.metadata.effects.enemy_cylinder_bomb_destroy_effect?.apply(this.node);
            this.audioEngine?.playSound("enemy_destroy", 1.0, this.node);
        } else if (this.config.enemy_type === "sphere-bomb") {
            this.scene.metadata.effects.sphere_bomb_destroy_effect?.apply(this.node);
            this.audioEngine?.playSound("enemy_destroy", 1.0, this.node);
        } else {
            if (!this.node.metadata) return;

            const effect = this.scene.metadata?.effects?.enemy_destroy;
            effect?.apply(this.node);
            explosion?.apply(this.node);

            if (this.config.enemy_type !== "rocket") {
                this.scene.metadata.killing_counter++;
                this.audioEngine?.playSound("enemy_destroy", 1.0, this.node);
            } else {
                this.audioEngine?.playSound("enemy_destroy", 0.7, this.node);
            }
        }
    }

    public handleDestroy(force: boolean = false, useBomb: boolean = true, effect: boolean = true) {
        // if ((this.hp < 1 || force) && !this.isInvincible) {
        if (this.hp < 1 || force) {
            if (effect) {
                this.destroyEffects();
            }

            if (useBomb) this.checkBombEffect(this.node.uniqueId);

            if (this.config.sounds?.on_death) {
                const engine = this.config.sounds.on_death.engine;
                if (engine === "enemy") {
                    const sound = this.config.sounds.on_death.sound[Math.floor(Math.random() * this.config.sounds.on_death.sound.length)];
                    this.audioEngine?.playSound(sound, 1.0, this.node);
                } else if (engine === "voice") {
                    const sound = this.config.sounds.on_death.sound[Math.floor(Math.random() * this.config.sounds.on_death.sound.length)];
                    this.voiceEngine?.playSound(sound, 1.0, this.node);
                }
            }

            this.dispose();
            this.updateCollisions();

            return true;
        }
        return false;
    }

    protected triggerIframes(time?: number) {
        this.isInvincible = true;

        const duration = (time ?? this.iframeDuration) / 1000;
        let elapsed = 0;

        const unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;

            if (elapsed >= duration) {
                this.isInvincible = false;
                unsubscribe();
            }
        });
    }

    protected updateCollisions() {
        this.scene.metadata.collisions.player_bullets.update(this.scene);
        this.scene.metadata.collisions.enemy_bullets.update(this.scene);
    }

    protected checkBombEffect(id: number) {
        const bombRadius = this.node.metadata?.bomb_radius;
        if (!bombRadius) return;

        const bombPosition = this.node.getAbsolutePosition();
        const radiusSq = bombRadius * bombRadius;

        const enemiesToDestroy: TransformNode[] = [];

        this.scene.metadata.enemies.forEach((enemy: TransformNode) => {
            if (enemy.uniqueId === id) return;

            const enemyPosition = enemy.getAbsolutePosition();
            const distanceSq = Vector3.DistanceSquared(bombPosition, enemyPosition);

            if (
                enemy.metadata.spawned &&
                distanceSq <= radiusSq &&
                !enemy.metadata.has_shield &&
                !enemy.metadata.bomb_radius
            ) {
                enemiesToDestroy.push(enemy);
            }
        });

        enemiesToDestroy.forEach((enemy) => {
            enemy.metadata?.callbacks?.destroy(true);
        });
    }

    protected addShadow(mesh: Mesh) {
        const shadowGenerators = this.scene.metadata.shadows;

        shadowGenerators?.forEach((generator: ShadowGenerator) => {
            const light = generator.getLight();

            const dynamicShadow = light?.metadata?.config?.shadowType === "dynamic";

            if (dynamicShadow) {
                generator.addShadowCaster(mesh);
            }
        });
    }

    protected animate() {
        const animation = {
            animation_name: this.config.animation.name,
            animation_params: this.config.animation.params,
        };

        const position = this.config.on_spawn.position;

        const pos = new Vector3(position.x, position.y, position.z);

        const anim = EnemyAnimationFactory.create(animation, pos);
        const frames = animation.animation_params?.frames;

        const from = animation.animation_params?.from ?? 0;

        if (anim && frames) {
            this.node.animations.push(...anim);

            const animatable = this.scene.beginAnimation(this.node, 0, frames, true);

            if (from > 0) {
                animatable.goToFrame(from);
            }
        }
    }

    protected createDebugArrows(angles: number[] = []) {
        const arrowLength = 5;
        const arrows: Mesh[] = [];

        for (const angle of angles) {
            const arrow = MeshBuilder.CreateLines(
                `enemy-debug-arrow-${angle.toFixed(2)}`,
                {
                    points: [
                        new Vector3(0, 0, 0),
                        new Vector3(0, 0, arrowLength),
                        new Vector3(0.05, 0, arrowLength - 0.1),
                        new Vector3(-0.05, 0, arrowLength - 0.1),
                        new Vector3(0, 0, arrowLength),
                    ],
                },
                this.scene,
            );

            arrow.color = Color3.Red();
            arrow.rotation = new Vector3(0, angle, 0);
            arrow.parent = this.node;
            arrows.push(arrow);
        }

        this.debugArrows = arrows;
    }

    private clearMetadata() {
        if (this.node?.metadata) {
            this.node.metadata?.callbacks?.dispose_childrens?.();
            sanitizeMetadata(this.node.metadata);
        }
        if (this.mesh?.metadata) {
            sanitizeMetadata(this.mesh.metadata);
        }
        if (this.collider?.metadata) {
            sanitizeMetadata(this.collider.metadata);
        }
    }

    public dispose() {
        this.clearMetadata();

        this.mesh?.dispose();
        this.node?.dispose();
        this.collider?.dispose();

        this.movement?.dispose();
        // this.shooter?.dispose();
        this.aoe.dispose();

        this.debugArrows?.forEach((arr) => arr.dispose());

        const enemies = this.scene?.metadata?.enemies;
        if (Array.isArray(enemies)) {
            const index = enemies.indexOf(this.node);
            if (index !== -1) enemies.splice(index, 1);
        }
    }
}
