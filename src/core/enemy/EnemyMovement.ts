import { TransformNode, Vector3, Scene, Mesh, Observer, Matrix, Quaternion } from "@babylonjs/core";

import { Nullable } from "types/common";
import { EnemyConfig } from "types/enemy/Enemies.types";

import { normalizeAngleDifference } from "utils/math";
import { addCallbacks } from "utils/babylon";

const ENEMY_FOLLOW_SPEED = Math.sqrt(1.5);
// const ENEMY_FOLLOW_SPEED = 5;

export class EnemyMovement {
    private scene: Scene;
    private enemy!: TransformNode;
    private collider!: Mesh;

    private config: EnemyConfig;
    private physics!: string;
    private isInsideMovement: boolean;

    private players!: TransformNode[];

    private moveSpeed: number = Math.sqrt(1.5);
    private moveObserver: Nullable<Observer<Scene>> = null;
    private angularSpeed: number = 1.0;
    private rotateObserver: Nullable<Observer<Scene>> = null;

    private pingPongEnabled: boolean;
    private followRotationSpeed: EnemyConfig["toggle_follow_rotation"];

    constructor(scene: Scene, enemy: TransformNode, collider: Mesh) {
        this.scene = scene;
        this.enemy = enemy;
        this.collider = collider;

        this.config = enemy.metadata.config;
        this.physics = enemy.metadata.config.ground.physics;
        this.isInsideMovement = enemy.metadata.config.is_inside_ground;

        this.players = scene.metadata.players;

        this.moveSpeed = this.config.follow_player.speed ?? this.moveSpeed;
        this.angularSpeed = this.config.rotate_to_player.angular_speed ?? this.angularSpeed;

        this.pingPongEnabled = this.config.ping_pong?.enabled ?? false;
        this.followRotationSpeed = this.config?.toggle_follow_rotation ?? {
            enabled: false,
            follow: { from: 0, to: 10 },
            rotation: { from: 0, to: 10 },
        };

        this.enemy.metadata = {
            ...this.enemy.metadata,
            change_behavior: this.config.change_behavior,
        };

        addCallbacks(this.enemy, {
            auto_rotation: () => this.rotateLocalY(),
            rotate_to_player: () => this.rotateLocalYToPlayer(),
            follow_player: () => this.followPlayer(),
            update_collider: (force: boolean = false) => this.updateCollider(force),
            start_ping_pong: () => this.startPingPongPlane(),
            toggle_follow_rotation_speed: () => this.toggleFollowRotationSpeed(),
        });

        this.setWorldPosition();
        this.setWorldRotation();

        this.startPingPongPlane();
        this.toggleFollowRotationSpeed();
    }

    public setPosition(position: Vector3) {
        this.collider.position.copyFrom(position);
    }

    public setMoveSpeed(speed: number) {
        this.moveSpeed = speed;
    }

    public setAngularSpeed(speed: number) {
        this.angularSpeed = speed;
    }

    public setPingPongEnabled(enabled: boolean) {
        this.pingPongEnabled = enabled;
    }

    public setFollowRotationSpeed(config: EnemyConfig["toggle_follow_rotation"]) {
        this.followRotationSpeed = config;
    }

    public setWorldPosition() {
        switch (this.physics) {
            case "plane":
                const position_plane = this.config.on_spawn.position;
                this.enemy.position.copyFrom(
                    this.getWorldPositionOnPlane(
                        position_plane.x!,
                        position_plane.y!,
                        position_plane.z!,
                    ),
                );
                break;
            case "cylinder":
                const position_cylinder = this.config.on_spawn.position;
                this.enemy.position.copyFrom(
                    this.getWorldPositionOnCylinder(position_cylinder.long!, position_cylinder.h!),
                );
                break;
            case "sphere":
                const position_sphere = this.config.on_spawn.position;
                this.enemy.position.copyFrom(
                    this.getWorldPositionOnSphere(position_sphere.long!, position_sphere.lat!),
                );
                break;
            default:
                break;
        }
    }

    public setWorldRotation() {
        let initialYaw = this.config.on_spawn.rotation_y;

        switch (this.physics) {
            case "plane":
                this.enemy.rotation.y = initialYaw;
                break;
            case "cylinder":
                this.setCylinderYaw(initialYaw);
                break;
            case "sphere":
                this.setSphereYaw(initialYaw);
                this.currentYawSphere = initialYaw;
                break;
            default:
                break;
        }
    }

    public rotateLocalYToPlayer() {
        if (!this.players?.length) return;

        this.disposeRotateObserver();

        switch (this.physics) {
            case "plane":
                this.rotateOnPlane(this.config.rotate_to_player.angular_speed, true);
                break;
            case "cylinder":
                this.rotateOnCylinder(this.config.rotate_to_player.angular_speed, true);
                break;
            case "sphere":
                this.rotateOnSphere(this.config.rotate_to_player.angular_speed, true);
                break;
            default:
                break;
        }
    }

    public rotateLocalY() {
        if (!this.players?.length) return;

        this.disposeRotateObserver();
        this.angularSpeed = this.config.auto_rotation.angular_speed ?? this.angularSpeed;

        switch (this.physics) {
            case "plane":
                this.rotateOnPlane(this.config.auto_rotation.angular_speed, false);
                break;
            case "cylinder":
                this.rotateOnCylinder(this.config.auto_rotation.angular_speed, false);
                break;
            case "sphere":
                this.rotateOnSphere(this.config.auto_rotation.angular_speed, false);
                break;
            default:
                break;
        }
    }

    public followPlayer() {
        if (!this.players?.length) return;

        this.disposeMoveObserver();

        // A collider built while the enemy was standing still is massless and stays
        // frozen no matter the velocity, so it has to be rebuilt once movement starts.
        const rebuildCollider =
            !this.config.follow_player.enabled && this.collider?.physicsImpostor?.mass === 0;

        this.enemy.metadata.is_following = true;
        this.updateCollider(rebuildCollider);

        switch (this.physics) {
            case "plane":
                const position_plane = this.config.on_spawn.position;

                this.collider.position.copyFrom(
                    this.getWorldPositionOnPlane(
                        position_plane.x!,
                        position_plane.y!,
                        position_plane.z!,
                    ),
                );
                this.moveOnPlane(this.config.follow_player.speed);
                break;
            case "cylinder":
                const position_cylinder = this.config.on_spawn.position;

                this.collider.position.copyFrom(
                    this.getWorldPositionOnCylinder(position_cylinder.long!, position_cylinder.h!),
                );
                this.moveOnCylinder(this.config.follow_player.speed);
                break;
            case "sphere":
                const position_sphere = this.config.on_spawn.position;

                this.collider.position.copyFrom(
                    this.getWorldPositionOnSphere(position_sphere.long!, position_sphere.lat!),
                );
                this.moveOnSphere(this.config.follow_player.speed);
                break;
            default:
                break;
        }
    }

    public updateCollider(force: boolean = false) {
        if (!this.collider || force) {
            if (force) {
                this.collider?.dispose();
            }
            const meshes = this.enemy.getChildMeshes();
            meshes.forEach((mesh) => {
                const impostor = mesh?.physicsImpostor;
                if (impostor) {
                    impostor.dispose();
                }
            });
            this.collider = this.enemy.metadata?.callbacks?.create_collider(this.enemy.position);
        }
    }

    public dispose() {
        this.disposeMoveObserver();
        this.disposeRotateObserver();
    }

    private disposeMoveObserver() {
        if (this.moveObserver) {
            this.scene.onBeforeRenderObservable.remove(this.moveObserver);
            this.moveObserver = null;
        }
    }

    private disposeRotateObserver() {
        if (this.rotateObserver) {
            this.scene.onBeforeRenderObservable.remove(this.rotateObserver);
            this.rotateObserver = null;
        }
    }

    private getClosestPlayer(): TransformNode | null {
        if (!this.players.length) return null;

        const triggers = this.config.triggers_by_player;
        if (!triggers) return this.players[0];

        let closestPlayer: TransformNode | null = null;
        let minDistance = Infinity;

        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];

            if (!triggers[i]) continue;

            const dist = this.enemy.position.subtract(player.position).length();

            if (dist < minDistance) {
                minDistance = dist;
                closestPlayer = player;
            }
        }

        if (!closestPlayer) {
            closestPlayer = this.players[0];
        }

        return closestPlayer;
    }

    private stopMovement() {
        if (!this.collider?.physicsImpostor) return;

        this.collider.physicsImpostor.setLinearVelocity(Vector3.Zero());
        this.collider.physicsImpostor.setAngularVelocity(Vector3.Zero());
    }

    public toggleFollowRotationSpeed(toggleTime: number = 1) {
        if (!this.followRotationSpeed?.enabled) return;

        const { from: followFrom, to: followTo } = this.followRotationSpeed.follow;
        const { from: rotationFrom, to: rotationTo } = this.followRotationSpeed.rotation;

        this.moveSpeed = followTo;
        this.angularSpeed = rotationFrom;

        const impostor = this.collider.physicsImpostor;
        if (!impostor) return;

        let startTime = 0;
        let isActive = false;

        impostor.onCollideEvent = (_, collidedWith) => {
            if (!this.followRotationSpeed?.enabled || isActive) return;

            const mesh = collidedWith.object as Mesh;
            if (!mesh.name.includes("wall")) return;

            isActive = true;
            startTime = Date.now();

            this.moveSpeed = followFrom;
            this.angularSpeed = rotationTo;

            const checkInterval = setInterval(() => {
                if (Date.now() - startTime >= toggleTime * 1000) {
                    this.moveSpeed = followTo;
                    this.angularSpeed = rotationFrom;
                    clearInterval(checkInterval);
                    isActive = false;
                }
            }, 16);
        };
    }

    //
    // "Physics" start
    // Plane
    protected getWorldPositionOnPlane(x: number, y: number, z: number): Vector3 {
        return new Vector3(x, y, z);
    }

    protected getDirectionOnPlane(autoRotationEnabled: boolean = true): Vector3 {
        if (autoRotationEnabled) {
            const targetPlayer = this.getClosestPlayer();
            if (!targetPlayer) return Vector3.Zero();

            const dir = targetPlayer.position.subtract(this.enemy.position);
            dir.y = 0;
            return dir;
        }

        return new Vector3(Math.sin(this.enemy.rotation.y), 0, Math.cos(this.enemy.rotation.y));
    }

    protected getHoverOnPlane() {
        const size = this.config.ground.size;
        const height = typeof size === "number" ? size / 2 : size.h / 2;
        const hover = this.enemy.metadata.hover_factor.plane;

        const finalHover = height + hover;

        return this.isInsideMovement ? -finalHover : finalHover;
    }

    public startPingPongPlane() {
        if (!this.pingPongEnabled) return;

        const rotateToPlayerEnabled = this.config.rotate_to_player.enabled;
        const autoRotationEnabled = this.config.auto_rotation.enabled;

        const rotationEnabled =
            (rotateToPlayerEnabled || autoRotationEnabled) && this.angularSpeed !== 0;

        if (!rotationEnabled) {
            const impostor = this.collider.physicsImpostor;
            if (!impostor) return;

            impostor.onCollideEvent = (collider, collidedWith) => {
                if (!this.pingPongEnabled) {
                    return;
                }

                const mesh = collidedWith.object as Mesh;
                if (!mesh.name.includes("wall")) return;

                this.enemy.rotation.y -= Math.PI / 2;
            };
        }
    }

    protected randomMovementState = {
        speedModifier: 1,
        rotationOffset: 0,
    };

    protected getRandomMovementState = () => ({
        speedModifier: 1,
        rotationOffset: 0,
    });

    protected createRandomMovementState() {
        let speedModifier = 1;

        const gameClock = this.scene.metadata.gameClock;

        let nextJumpTime = gameClock.getTime() + this.randomRange(0.5, 1.5);

        let jumpEndTime = 0;

        return () => {
            const now = gameClock.getTime();

            let rotationOffset = 0;

            if (now >= nextJumpTime && jumpEndTime === 0) {
                speedModifier = -30;

                rotationOffset = this.randomRange(-Math.PI, Math.PI);

                jumpEndTime = now + 0.05;

                nextJumpTime = now + this.randomRange(0.5, 1.5);
            }

            if (jumpEndTime > 0 && now >= jumpEndTime) {
                speedModifier = 1;
                jumpEndTime = 0;
            }

            return {
                speedModifier,
                rotationOffset,
            };
        };
    }

    protected moveOnPlane(movementSpeed = ENEMY_FOLLOW_SPEED) {
        const randomizeMovement = this.config?.metadata?.randomize_movement;

        this.getRandomMovementState = randomizeMovement
            ? this.createRandomMovementState()
            : () => ({
                speedModifier: 1,
                rotationOffset: 0,
            });

        this.moveObserver = this.scene.onBeforeRenderObservable.add(() => {
            const impostor = this.collider.physicsImpostor;

            if (!impostor || this.scene.metadata.gameClock.paused) {
                this.stopMovement();
                return;
            }

            this.randomMovementState = this.getRandomMovementState();

            const speed = this.scene.metadata.gameClock.speed;

            const dir = this.getDirectionOnPlane(this.config.auto_rotation.enabled);

            const velocity = dir.equals(Vector3.Zero())
                ? Vector3.Zero()
                : dir
                    .normalize()
                    .scale(this.moveSpeed * this.randomMovementState.speedModifier * speed);

            impostor.setLinearVelocity(velocity);

            this.collider.position.y = this.getHoverOnPlane();
            this.enemy.position.copyFrom(this.collider.position);
        });
    }

    private randomRange(min: number, max: number) {
        return min + Math.random() * (max - min);
    }

    protected rotateOnPlane(turnSpeed: number = 1.0, toPlayer: boolean = true) {
        this.rotateObserver = this.scene.onBeforeRenderObservable.add(() => {
            const gameClock = this.scene.metadata.gameClock;
            if (gameClock.paused) return;

            const deltaTime = gameClock.getGlobalDeltaTime();
            const maxStep = this.angularSpeed * gameClock.speed * deltaTime;

            if (toPlayer) {
                const targetPlayer = this.getClosestPlayer();
                if (!targetPlayer) return;

                const dir = targetPlayer.position.subtract(this.enemy.position);
                dir.y = 0;

                const targetY = Math.atan2(dir.x, dir.z);
                const currentY = this.enemy.rotation.y + this.randomMovementState.rotationOffset;
                const angleDiff = normalizeAngleDifference(targetY, currentY);

                this.enemy.rotation.y = currentY + Math.max(-maxStep, Math.min(maxStep, angleDiff));
            } else {
                this.enemy.rotation.y += maxStep;
            }
        });
    }

    // Cylinder
    protected currentForwardCylinder = new Vector3();
    protected currentNormalCylinder = new Vector3();

    protected getCylinderPosition(): Vector3 {
        const groundID = this.enemy.metadata.config.ground.id;
        const groundNode = this.scene.metadata.grounds[groundID];
        return groundNode.getAbsolutePosition();
    }

    protected getCylinderRadius() {
        const size = this.config.ground.size;
        const radius = typeof size === "number" ? size / 2 : size.d / 2;
        const hover = this.enemy.metadata.hover_factor.cylinder;

        const finalRadius = this.isInsideMovement ? radius - hover : radius + hover;

        return finalRadius;
    }

    protected getCylinderHeight() {
        const size = this.config.ground.size;
        const height = typeof size === "number" ? size : size.h;

        return height;
    }

    protected getWorldPositionOnCylinder(longitude: number, height: number): Vector3 {
        const cylinderRadius = this.getCylinderRadius();
        const cylinderPos = this.getCylinderPosition();

        const x = Math.cos(longitude) * cylinderRadius;
        const y = height;
        const z = Math.sin(longitude) * cylinderRadius;
        const localPos = new Vector3(x, y, z);

        const rotatedPos = Vector3.TransformCoordinates(localPos, Matrix.RotationY(Math.PI / 2));
        return cylinderPos.add(rotatedPos);
    }

    protected getCylinderNormal(): Vector3 {
        const enemyPos = this.enemy.getAbsolutePosition();
        const cylinderPos = this.getCylinderPosition();

        const relativePos = enemyPos.subtract(cylinderPos);
        return new Vector3(relativePos.x, 0, relativePos.z).normalize();
    }

    protected getCylinderTangent(normal?: Vector3): Vector3 {
        const n = normal || this.getCylinderNormal();
        return new Vector3(-n.z, 0, n.x);
    }

    protected getCylinderBaseRotation(normal?: Vector3): Quaternion {
        const n = normal || this.getCylinderNormal();
        const yaw = Math.atan2(n.x, n.z);
        return Quaternion.RotationAxis(Vector3.Up(), yaw)
            .multiply(Quaternion.FromEulerAngles(Math.PI / 2, 0, 0))
            .multiply(Quaternion.FromEulerAngles(0, Math.PI, 0));
    }

    protected getCylinderForward(yaw: number, normal?: Vector3): Vector3 {
        const n = normal || this.getCylinderNormal();
        const tangent = this.getCylinderTangent(n);
        const rotMat = Matrix.RotationAxis(n, yaw);
        return Vector3.TransformCoordinates(tangent, rotMat).normalize();
    }

    protected setCylinderYaw(yaw: number) {
        const normal = this.getCylinderNormal();
        const baseRot = this.getCylinderBaseRotation(normal);
        this.enemy.rotationQuaternion = baseRot.multiply(
            Quaternion.FromEulerAngles(0, yaw + Math.PI / 2, this.isInsideMovement ? Math.PI : 0),
        );

        const forward = this.getCylinderForward(yaw, normal);
        this.currentForwardCylinder.copyFrom(forward);
        this.currentNormalCylinder.copyFrom(normal);
    }

    protected getCylinderCurrentYaw(): number {
        const normal = this.getCylinderNormal();
        const tangent = this.getCylinderTangent(normal);
        const forward = this.currentForwardCylinder || this.enemy.forward || Vector3.Forward();
        const projected = forward.subtract(normal.scale(Vector3.Dot(forward, normal))).normalize();
        return Math.atan2(
            Vector3.Dot(Vector3.Cross(tangent, projected), normal),
            Vector3.Dot(tangent, projected),
        );
    }

    protected getDirectionOnCylinder(
        autoRotationEnabled: boolean = true,
        enemyPos: Vector3,
        normal: Vector3,
    ): Vector3 {
        if (autoRotationEnabled) {
            const targetPlayer = this.getClosestPlayer();
            if (!targetPlayer) return Vector3.Zero();

            const toPlayer = targetPlayer.getAbsolutePosition().subtract(enemyPos);
            const dir = toPlayer.subtract(normal.scale(Vector3.Dot(toPlayer, normal))).normalize();
            return dir;
        }
        return this.currentForwardCylinder.clone();
    }

    protected moveOnCylinder(movementSpeed: number = ENEMY_FOLLOW_SPEED) {
        this.moveObserver = this.scene.onBeforeRenderObservable.add(() => {
            const impostor = this.collider.physicsImpostor;

            if (!impostor || this.scene.metadata.gameClock.paused) {
                this.stopMovement();
                return;
            }

            const speed = this.scene.metadata.gameClock.speed;

            const enemyPos = this.collider.getAbsolutePosition();
            const normal = this.getCylinderNormal();

            const dir = this.getDirectionOnCylinder(
                this.config.auto_rotation.enabled,
                enemyPos,
                normal,
            );

            const velocity = dir.scale(this.moveSpeed * speed);
            impostor.setLinearVelocity(velocity);

            const cylinderPos = this.getCylinderPosition();
            const relativePos = enemyPos.subtract(cylinderPos);
            const currentRadius = Math.sqrt(
                relativePos.x * relativePos.x + relativePos.z * relativePos.z,
            );

            const correction = normal.scale(this.getCylinderRadius() - currentRadius);
            this.collider.position.addInPlace(correction);

            const halfHeight = this.getCylinderHeight() / 2;
            const relativeY = this.collider.position.y - cylinderPos.y;
            const clampedRelativeY = Math.max(-halfHeight, Math.min(halfHeight, relativeY));
            this.collider.position.y = cylinderPos.y + clampedRelativeY;

            this.enemy.position.copyFrom(this.collider.position);
        });
    }

    protected rotateOnCylinder(turnSpeed: number = 1.0, toPlayer: boolean = true) {
        let yaw = this.getCylinderCurrentYaw();

        this.rotateObserver = this.scene.onBeforeRenderObservable.add(() => {
            const gameClock = this.scene.metadata.gameClock;
            if (gameClock.paused) return;

            const deltaTime = gameClock.getGlobalDeltaTime();
            const maxStep = this.angularSpeed * gameClock.speed * deltaTime;

            const normal = this.getCylinderNormal();
            const tangent = this.getCylinderTangent(normal);

            if (toPlayer) {
                const targetPlayer = this.getClosestPlayer();
                if (!targetPlayer) return;

                const toPlayer = targetPlayer
                    .getAbsolutePosition()
                    .subtract(this.enemy.getAbsolutePosition())
                    .normalize();

                const projected = toPlayer
                    .subtract(normal.scale(Vector3.Dot(toPlayer, normal)))
                    .normalize();

                const targetYaw = Math.atan2(
                    Vector3.Dot(Vector3.Cross(tangent, projected), normal),
                    Vector3.Dot(tangent, projected),
                );

                const yawDiff = normalizeAngleDifference(targetYaw, yaw);
                yaw += Math.max(-maxStep, Math.min(maxStep, yawDiff));
            } else {
                yaw += maxStep;
            }

            this.setCylinderYaw(yaw);
        });
    }

    // Sphere
    protected currentForwardSphere = new Vector3();
    protected currentUpSphere = new Vector3();
    protected currentYawSphere = 0;

    protected readonly POLE_LIMIT_RAD = Math.PI / 2 - 0.05;
    protected readonly POLE_SOFT_ZONE_RAD = Math.PI / 2 - 0.1;

    private getSpherePosition(): Vector3 {
        const groundID = this.enemy.metadata.config.ground.id;
        const groundNode = this.scene.metadata.grounds[groundID];
        return groundNode.getAbsolutePosition();
    }

    protected getLatitude(pos: Vector3, spherePos: Vector3): number {
        const relativePos = pos.subtract(spherePos);
        const y = relativePos.y / relativePos.length();
        return Math.asin(Math.max(-1, Math.min(1, y)));
    }

    protected getSphereRadius() {
        const size = this.config.ground.size;
        const radius = typeof size === "number" ? size / 2 : size.d / 2;
        const hover = this.enemy.metadata.hover_factor.sphere;
        const insideCorrection = 0.55;

        const finalRadius = this.isInsideMovement
            ? radius - hover - insideCorrection
            : radius + hover;

        return finalRadius;
    }

    protected getWorldPositionOnSphere(longitude: number, latitude: number): Vector3 {
        const spherePos = this.getSpherePosition();
        const sphereRadius = this.getSphereRadius();
        const x = sphereRadius * Math.cos(latitude) * Math.cos(longitude);
        const y = sphereRadius * Math.sin(latitude);
        const z = sphereRadius * Math.cos(latitude) * Math.sin(longitude);

        return spherePos.add(new Vector3(x, y, z));
    }

    protected getSphereUp(): Vector3 {
        const spherePos = this.getSpherePosition();
        const relativePos = this.enemy.position.subtract(spherePos);
        return relativePos.normalize();
    }

    protected getSphereTangent(up?: Vector3): Vector3 {
        const u = up || this.getSphereUp();
        let tangent: Vector3;

        if (Math.abs(u.y) > 0.999) {
            tangent = Vector3.Cross(u, Vector3.Forward());
            if (tangent.lengthSquared() < 1e-6) {
                tangent = Vector3.Cross(u, Vector3.Right());
            }
        } else {
            tangent = Vector3.Cross(u, Vector3.Up());
        }

        return tangent.normalize();
    }

    protected getSphereForward(yaw: number, up?: Vector3): Vector3 {
        const u = up || this.getSphereUp();
        const tangent = this.getSphereTangent(u);
        const forward = Vector3.Cross(tangent, u).normalize();
        const rotationMat = Matrix.RotationAxis(u, yaw);
        return Vector3.TransformCoordinates(forward, rotationMat).normalize();
    }

    protected setSphereYaw(yaw: number) {
        const up = this.getSphereUp();
        const forward = this.getSphereForward(yaw, up);
        this.enemy.rotationQuaternion = Quaternion.FromLookDirectionRH(
            forward,
            this.isInsideMovement ? up.scale(-1) : up,
        );

        this.currentForwardSphere.copyFrom(forward);
        this.currentUpSphere.copyFrom(up);
    }

    protected getSphereCurrentYaw(): number {
        const up = this.getSphereUp();
        const forward = this.enemy.forward || Vector3.Forward();
        const projected = forward.subtract(up.scale(Vector3.Dot(forward, up))).normalize();
        return Math.atan2(
            Vector3.Dot(Vector3.Cross(forward, projected), up),
            Vector3.Dot(forward, projected),
        );
    }

    protected getDirectionOnSphere(
        autoRotationEnabled: boolean = true,
        enemyPos: Vector3,
        spherePos: Vector3,
        up: Vector3,
    ): Vector3 {
        let targetDir: Vector3;
        if (autoRotationEnabled) {
            const targetPlayer = this.getClosestPlayer();
            if (!targetPlayer) return this.currentForwardSphere.clone();

            const toPlayer = targetPlayer.position.subtract(enemyPos).normalize();
            targetDir = toPlayer.subtract(up.scale(Vector3.Dot(toPlayer, up))).normalize();
        } else {
            targetDir = this.currentForwardSphere.clone();
        }

        const relativePos = enemyPos.subtract(spherePos);
        const lat = Math.asin(Math.max(-1, Math.min(1, relativePos.y / relativePos.length())));
        const absLat = Math.abs(lat);

        if (absLat <= this.POLE_SOFT_ZONE_RAD) {
            return targetDir;
        }

        let slideDir = Vector3.Cross(up, Vector3.Up()).normalize();

        if (slideDir.lengthSquared() < 0.001) {
            slideDir = Vector3.Cross(up, this.currentForwardSphere).normalize();
            if (slideDir.lengthSquared() < 0.001) slideDir = Vector3.Right();
        }

        let t =
            (absLat - this.POLE_SOFT_ZONE_RAD) / (this.POLE_LIMIT_RAD - this.POLE_SOFT_ZONE_RAD);
        t = Math.max(0, Math.min(1, t));

        const northDir = Vector3.Cross(slideDir, up).normalize();
        const dirToPole = lat > 0 ? northDir : northDir.negate();

        const moveTowardsPole = Vector3.Dot(targetDir, dirToPole);

        if (moveTowardsPole > 0 || t >= 1.0) {
            const dotRight = Vector3.Dot(targetDir, slideDir);
            const finalSlideDir = dotRight >= 0 ? slideDir : slideDir.negate();

            if (t >= 0.99) {
                targetDir = finalSlideDir.clone();
            } else {
                targetDir = Vector3.Lerp(targetDir, finalSlideDir, t).normalize();
            }
        }

        if (targetDir.lengthSquared() < 0.001) {
            return slideDir.normalize();
        }

        return targetDir;
    }

    protected moveOnSphere(movementSpeed: number = ENEMY_FOLLOW_SPEED) {
        this.moveObserver = this.scene.onBeforeRenderObservable.add(() => {
            const impostor = this.collider.physicsImpostor;
            if (!impostor || this.scene.metadata.gameClock.paused) {
                this.stopMovement();
                return;
            }

            const speedMultiplier = this.scene.metadata.gameClock.speed;
            const spherePos = this.getSpherePosition();
            const enemyPos = this.collider.position;
            const relativePos = enemyPos.subtract(spherePos);
            const up = relativePos.clone().normalize();

            const dir = this.getDirectionOnSphere(
                this.config.auto_rotation.enabled,
                enemyPos,
                spherePos,
                up,
            );

            const velocity = dir.scale(this.moveSpeed * speedMultiplier);
            impostor.setLinearVelocity(velocity);

            const lat = this.getLatitude(enemyPos, spherePos);
            const absLat = Math.abs(lat);
            let finalRelativePos = relativePos;

            if (absLat > this.POLE_LIMIT_RAD) {
                const safeLat = (lat > 0 ? 1 : -1) * this.POLE_LIMIT_RAD;
                const currentRadius = this.getSphereRadius();
                const longitude = Math.atan2(relativePos.z, relativePos.x);

                const newX = currentRadius * Math.cos(safeLat) * Math.cos(longitude);
                const newY = currentRadius * Math.sin(safeLat);
                const newZ = currentRadius * Math.cos(safeLat) * Math.sin(longitude);

                finalRelativePos = new Vector3(newX, newY, newZ);
            } else {
                finalRelativePos = up.scale(this.getSphereRadius());
            }

            const finalPos = spherePos.add(finalRelativePos);
            this.collider.position = finalPos;
            this.enemy.position.copyFrom(finalPos);
        });
    }

    protected rotateOnSphere(turnSpeed: number = 1.0, toPlayer: boolean = true) {
        let yaw = this.currentYawSphere ?? this.getSphereCurrentYaw();

        this.rotateObserver = this.scene.onBeforeRenderObservable.add(() => {
            const gameClock = this.scene.metadata.gameClock;
            if (gameClock.paused) return;

            const deltaTime = gameClock.getGlobalDeltaTime();
            const maxStep = this.angularSpeed * gameClock.speed * deltaTime;

            const up = this.getSphereUp();
            const tangent = this.getSphereTangent(up);

            if (toPlayer) {
                const targetPlayer = this.getClosestPlayer();
                if (!targetPlayer) return;

                const toPlayer = targetPlayer.position
                    .clone()
                    .subtract(this.enemy.position)
                    .normalize();

                const forward = Vector3.Cross(tangent, up).normalize();
                const projected = toPlayer
                    .subtract(up.scale(Vector3.Dot(toPlayer, up)))
                    .normalize();

                const targetYaw = Math.atan2(
                    Vector3.Dot(Vector3.Cross(forward, projected), up),
                    Vector3.Dot(forward, projected),
                );

                const yawDiff = normalizeAngleDifference(targetYaw, yaw);
                yaw += Math.max(-maxStep, Math.min(maxStep, yawDiff));
            } else {
                yaw += maxStep;
            }

            this.setSphereYaw(yaw);
            this.currentYawSphere = yaw;
        });
    }

    // "Physics" end
    //
}
