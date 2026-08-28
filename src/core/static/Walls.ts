import {
    Scene,
    Vector3,
    Quaternion,
    Mesh,
    ShadowGenerator,
    PhysicsImpostor,
    TransformNode,
    InstancedMesh,
} from "@babylonjs/core";

import { Nullable } from "types/common";
import { WallConfig } from "types/static/Wall.types";

import { EnemyAnimationFactory } from "core/animations/EnemyAnimationFactory";
import { SplineMover } from "core/animations/SplineMover";

import { WallAssetsManager } from "./WallAssetsManager";

import { deg2rad } from "utils/math";

export class Walls {
    private scene: Scene;
    private walls: (Mesh | InstancedMesh)[] = [];

    private shadowGenerators: Nullable<ShadowGenerator[]> = null;

    private splineMover: Nullable<SplineMover> = null;

    constructor(scene: Scene) {
        this.scene = scene;
        this.shadowGenerators = this.scene.metadata.shadows;

        this.scene.metadata = { ...this.scene.metadata, walls_class: this };
    }

    private updateCollisions() {
        this.scene.metadata.collisions.player_bullets.update(this.scene);
        this.scene.metadata.collisions.enemy_bullets.update(this.scene);
    }

    private createNormalWall(config: WallConfig, index: number, effective: boolean = false) {
        const { position, rotation, disable_physics, not_cast_shadow } = config;

        const assets = WallAssetsManager.getAssets(this.scene);

        const WALL_ASSET_BY_TYPE: Partial<Record<WallConfig["type"], Mesh>> = {
            box: assets.box_wall_light,
            "box-light": assets.box_wall_light,
            "box-dark": assets.box_wall_dark,
            "box-ui": assets.box_wall_ui,
            "box-base": assets.box_wall_base,
            "box-invisible": assets.box_wall_invisible,
            "cylinder-light": assets.cylinder_wall_light,
            "cylinder-dark": assets.cylinder_wall_dark,
            "cylinder-base": assets.cylinder_wall_base,
            "cylinder-invisible": assets.cylinder_wall_invisible,
            "cylinder-transparent": assets.cylinder_wall_transparent,
        };

        const asset = WALL_ASSET_BY_TYPE[config.type];
        if (!asset) {
            return;
        }

        const bulletCollider = config.solid ? "wall" : "barrier";

        const wall =
            !!disable_physics && !config.not_mergeable
                ? asset.clone(`${bulletCollider}-${config.type}-${index}`)
                : asset.createInstance(`${bulletCollider}-${config.type}-${index}`);

        wall.setEnabled(true);

        wall.position.set(position.x, position.y, position.z);

        wall.rotationQuaternion = Quaternion.FromEulerAngles(
            deg2rad(rotation.x),
            deg2rad(rotation.y),
            deg2rad(rotation.z),
        );

        wall.scaling.set(config.size.w, config.size.h, config.size.d);

        if (!disable_physics) {
            wall.physicsImpostor = new PhysicsImpostor(
                wall,
                !wall.name.includes("cylinder")
                    ? PhysicsImpostor.BoxImpostor
                    : PhysicsImpostor.MeshImpostor,
                { mass: 0, disableBidirectionalTransformation: !!!config.parent_name },
                this.scene,
            );
        }

        if (config.parent_name) {
            const parent = this.scene.getNodeByName(config.parent_name);
            wall.parent = parent;
        }

        this.walls.push(wall);
        this.scene.metadata.walls.push(wall);

        this.shadowGenerators?.forEach((generator) => {
            if (not_cast_shadow) return;
            const light = generator.getLight();
            const staticShadow = light?.metadata?.config?.shadowType === "static";

            if (staticShadow) {
                generator.addShadowCaster(wall);
            }
        });

        wall.metadata = {
            ...wall.metadata,
            poolId: config.trigger.pool,
            disposePoolId: config.trigger.dispose_pool,
            mergeable: !!disable_physics && !config.not_mergeable,
        };

        if (config.animation) {
            const unsubscribe = this.animate(config, wall);
            wall.metadata = { ...wall.metadata, animation_unsubscribe: unsubscribe };
        }

        if (effective) {
            const effect = this.scene.metadata?.effects?.wall_appearance;
            effect?.apply(wall, true);
        }
    }

    private createLawaWall(config: WallConfig, index: number, effective: boolean = false) {
        const { position, rotation, disable_physics, not_cast_shadow } = config;

        const container = new TransformNode(`wall-container-${index}`, this.scene);
        container.position = new Vector3(position.x, position.y, position.z);
        container.rotationQuaternion = Quaternion.FromEulerAngles(
            deg2rad(rotation.x),
            deg2rad(rotation.y),
            deg2rad(rotation.z),
        );

        const assets = WallAssetsManager.getAssets(this.scene);

        const WALL_ASSET_BY_TYPE: Partial<Record<WallConfig["type"], Mesh>> = {
            box: assets.lawa_box_wall,
        };

        const asset = WALL_ASSET_BY_TYPE[config.type];
        if (!asset) {
            return;
        }

        const wall =
            !!disable_physics && !config.not_mergeable
                ? asset.clone(`lawa-wall-${config.type}-${index}`)
                : asset.createInstance(`lawa-wall-${config.type}-${index}`);

        if (!!disable_physics && !config.not_mergeable) {
            wall.material = this.scene.metadata.wall_assets.lawa_box_wall_not_instanced;
        }

        wall.setEnabled(true);

        wall.position = Vector3.Zero();

        wall.rotationQuaternion = Quaternion.FromEulerAngles(
            deg2rad(rotation.x),
            deg2rad(rotation.y),
            deg2rad(rotation.z),
        );

        wall.scaling.set(config.size.w, config.size.h, config.size.d);

        if (!disable_physics) {
            wall.physicsImpostor = new PhysicsImpostor(
                wall,
                PhysicsImpostor.SphereImpostor,
                { mass: 0 },
                this.scene,
            );
        }

        if (config.parent_name) {
            const parent = this.scene.getNodeByName(config.parent_name);
            container.parent = parent;
        }

        wall.parent = container;

        this.walls.push(wall);
        this.scene.metadata.walls.push(wall);

        this.shadowGenerators?.forEach((generator) => {
            if (not_cast_shadow) return;
            const light = generator.getLight();
            const staticShadow = light?.metadata?.config?.shadowType === "static";

            if (staticShadow) {
                generator.addShadowCaster(wall);
            }
        });

        wall.metadata = {
            ...wall.metadata,
            poolId: config.trigger.pool,
            disposePoolId: config.trigger.dispose_pool,
            mergeable: !!disable_physics && !config.not_mergeable,
        };

        if (config.animation) {
            const unsubscribe = this.animate(config, container);
            wall.metadata = { ...wall.metadata, animation_unsubscribe: unsubscribe };
        }

        if (effective) {
            const effect = this.scene.metadata?.effects?.wall_appearance;
            effect?.apply(wall, true);
        }
    }

    public create(configs: WallConfig[]) {
        configs.forEach((config, index) => {
            if (!config.trigger.spawn.on_start) return;
            if (!config.is_lava) {
                this.createNormalWall(config, index, config.effective);
            } else {
                this.createLawaWall(config, index, config.effective);
            }
        });

        this.updateCollisions();
    }

    private animate(config: WallConfig, wall: TransformNode) {
        if (config.animation?.name === "spline") {
            const animation = config.animation;

            this.splineMover = new SplineMover({
                scene: this.scene,
                target: wall as Mesh,
                spline: animation.spline,
                speed: animation.speed,
                loop: false,
                rotateToDirection: true,
            });

            this.splineMover.start();
            return;
        }

        const animation = {
            animation_name: config.animation?.name,
            animation_params: config.animation,
        };

        const params = animation.animation_params;
        const frames = params?.frames;
        const delayMove = params?.delay?.[0] ?? 1000;
        const delayPause = params?.delay?.[1] ?? 0;
        const from = params?.from ?? 0;
        const loop = params?.loop ?? true;

        const pos = new Vector3(config.position.x, config.position.y, config.position.z);

        const anim = EnemyAnimationFactory.create(animation, pos);
        if (!anim || !frames) return;

        wall.animations.push(...anim);
        const animatable = this.scene.beginAnimation(wall, 0, frames, loop);

        if (from > 0) {
            animatable.goToFrame(from);
        }

        let state: "move" | "pause" = "move";
        let timer = 0;
        const delayMoveSec = delayMove / 1000;
        const delayPauseSec = delayPause / 1000;

        const isLockedRef = this.scene.metadata.controlsLockedRef;

        const unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            const isLocked = isLockedRef.current;
            if (isLocked) return;

            timer += dt;

            if (state === "move" && timer >= delayMoveSec) {
                animatable.pause();
                state = "pause";
                timer = 0;
            } else if (state === "pause" && timer >= delayPauseSec) {
                animatable.restart();
                state = "move";
                timer = 0;
            }
        });

        return unsubscribe;
    }

    public updateWalls(configs: WallConfig[], poolId: number) {
        const existingWalls = this.walls.filter((w) => w.metadata?.poolId === poolId);

        if (existingWalls.length) {
            existingWalls.forEach((wall) => this.disposeWall(wall));
            this.walls = this.walls.filter((w) => w.metadata?.poolId !== poolId);
            this.scene.metadata.walls = this.scene.metadata.walls.filter(
                (w: Mesh) => w.metadata?.poolId !== poolId,
            );
        }

        const wallsToDispose = this.walls.filter((w) => w.metadata?.disposePoolId === poolId);

        if (wallsToDispose.length) {
            wallsToDispose.forEach((wall) => this.disposeWall(wall));
            this.walls = this.walls.filter((w) => w.metadata?.poolId !== poolId);
            this.scene.metadata.walls = this.scene.metadata.walls.filter(
                (w: Mesh) => w.metadata?.poolId !== poolId,
            );
        }

        configs.forEach((config, index) => {
            if (config.trigger.pool === poolId) {
                if (!config.trigger.spawn.on_update) return;
                if (!config.is_lava) {
                    this.createNormalWall(config, index, config.effective);
                } else {
                    this.createLawaWall(config, index, config.effective);
                }
            }
        });

        this.updateCollisions();
    }

    public disposeWall(wall: Mesh | InstancedMesh) {
        const effect = this.scene.metadata?.effects?.wall_appearance;
        effect?.apply(wall, false);

        this.shadowGenerators?.forEach((generator) => generator.removeShadowCaster(wall));

        if (wall.parent) {
            wall.parent.dispose();
        }

        wall.dispose();

        if (Array.isArray(this.walls)) {
            const index = this.walls.indexOf(wall);
            if (index !== -1) this.walls.splice(index, 1);

            this.scene.metadata.walls = this.walls;
        }
    }

    public dispose() {
        this.walls.forEach((wall) => {
            wall.metadata?.animation_unsubscribe?.();
            this.shadowGenerators?.forEach((generator) => generator.removeShadowCaster(wall));
            if (wall.parent) {
                wall.parent.dispose();
            }
            wall.dispose();
        });
        this.walls = [];

        this.splineMover?.dispose();
    }
}
