import { AbstractMesh, Scene, Mesh } from "@babylonjs/core";

const collisionMeshNamePatternsPlayer = [
    "wall",
    "enemy-minion",
    "enemy-minion-cheer",
    "enemy-bullet",
    "shield",
    "reflector",
    "enemy-rocket",
    "enemy-rabbit-hit-box",
    "barrier-cylinder-transparent",
];
const collisionMeshNamePatternsEnemy = [
    "wall",
    "player-hit-box",
    "enemy-minion-box",
    "enemy-minion",
    "shield",
    "enemy-minion-sphere-bomb",
    "laser",
];

const safeDispose = (mesh: Mesh) => {
    mesh.metadata?.callbacks?.dispose?.();
};

export const COLLISION_MAP = [collisionMeshNamePatternsPlayer, collisionMeshNamePatternsEnemy];

export const COLLISION_RULES = [
    // player
    {
        a: "player-bullet-mesh",
        b: "wall",
        action: (a: Mesh, b: Mesh) => {
            a.getScene()
                .metadata.audio_engine?.getPlayerAudio()
                .playSound("player_bullet_wall", 1.0, a?.parent);
            a.metadata?.callbacks?.on_wall_hit?.();
            safeDispose(a);
        },
    },
    {
        a: "player-bullet-mesh-light",
        b: "physical",
        action: (a: Mesh, b: Mesh) => {
            a.metadata?.callbacks?.on_bullets_hit?.();
            a.getScene()
                .metadata.audio_engine?.getCommonAudio()
                .playSound("bullets_collide", 1.0, a);
            safeDispose(a);
            safeDispose(b);
        },
    },
    {
        a: "player-bullet-mesh-dark",
        b: "magical",
        action: (a: Mesh, b: Mesh) => {
            a.metadata?.callbacks?.on_bullets_hit?.();
            a.getScene()
                .metadata.audio_engine?.getCommonAudio()
                .playSound("bullets_collide", 1.0, a);
            safeDispose(a);
            safeDispose(b);
        },
    },
    {
        a: "player-bullet-mesh-light",
        b: "chlorine",
        action: (a: Mesh, b: Mesh) => safeDispose(a),
    },
    {
        a: "player-bullet-mesh-dark",
        b: "chlorine",
        action: (a: Mesh, b: Mesh) => safeDispose(a),
    },
    {
        a: "chlorine",
        b: "enemy-minion",
        action: (a: Mesh, b: Mesh) => {
            if (a?.parent?.metadata?.enemyName === b?.parent?.name) return;
            if (b?.parent?.metadata?.config?.metadata?.not_damageable_with_chlorine) return;
            safeDispose(a);
            b?.parent?.metadata?.callbacks?.on_damage(50);
        },
    },
    {
        a: "chlorine",
        b: "shield",
        action: (a: Mesh, b: Mesh) => {
            if (a?.parent?.metadata?.enemyName === b?.parent?.parent?.name) return;
            if (b?.parent?.parent?.metadata?.config?.metadata?.not_damageable_with_chlorine) return;
            safeDispose(a);
            b?.parent?.parent?.metadata?.callbacks?.on_damage(50);
        },
    },
    {
        a: "player-bullet-mesh-dark",
        b: "chlorine",
        action: (a: Mesh, b: Mesh) => safeDispose(b),
    },
    {
        a: "player-bullet-mesh",
        b: "shield",
        action: (a: Mesh, b: Mesh) => {
            a.metadata?.callbacks?.on_shield_hit?.();
            safeDispose(a);
            b.getScene().metadata?.effects.sheild_damage?.apply(b);
            b.getScene()
                .metadata.audio_engine?.getEnemyAudio()
                .playSound("enemy_shield_hit", 1.0, b);
        },
    },
    {
        a: "player-bullet-mesh",
        b: "reflector",
        action: (a: Mesh, b: Mesh) => {
            a.metadata?.callbacks?.reflect?.(b);
        },
    },
    {
        a: "player-bullet-mesh",
        b: "enemy-minion-cheer",
        action: (a: Mesh, b: Mesh) => {
            a.getScene().metadata?.effects.enemy_damage?.applyBaseEffect(a, b);
            safeDispose(a);
            b?.parent?.metadata?.callbacks?.on_cheer_damaged();
        },
    },
    {
        a: "player-bullet-mesh",
        b: "enemy-minion",
        action: (a: Mesh, b: Mesh) => {
            a.getScene().metadata?.effects.enemy_damage?.applyBaseEffect(a, b);
            safeDispose(a);
            b?.parent?.metadata?.callbacks?.on_damage();
        },
    },
    {
        a: "player-bullet-mesh",
        b: "enemy-rocket",
        action: (a: Mesh, b: Mesh) => {
            safeDispose(a);
            b?.parent?.metadata?.callbacks?.on_damage();
        },
    },
    {
        a: "player-bullet-mesh",
        b: "enemy-rabbit-hit-box",
        action: (a: Mesh, b: Mesh) => {
            a.getScene().metadata?.effects.enemy_damage?.applyBaseEffect(a, b);
            safeDispose(a);
            b?.parent?.metadata?.callbacks?.on_rabbit_damaged();
        },
    },
    {
        a: "player-bullet-mesh-light",
        b: "barrier-cylinder-transparent",
        action: (a: Mesh, b: Mesh) => {
            a.getScene()
                .metadata.audio_engine?.getPlayerAudio()
                .playSound("player_bullet_wall", 1.0, a?.parent);
            a.metadata?.callbacks?.on_wall_hit?.();
            safeDispose(a);
        },
    },
    {
        a: "player-bullet-mesh-dark",
        b: "barrier-cylinder-transparent",
        action: (a: Mesh, b: Mesh) => {
            a.getScene()
                .metadata.audio_engine?.getPlayerAudio()
                .playSound("player_bullet_wall", 1.0, a?.parent);
            a.metadata?.callbacks?.on_wall_hit?.();
            safeDispose(a);
        },
    },
    // enemy
    {
        a: "enemy-bullet-mesh-chlorine",
        b: "player-hit-box",
        action: (a: Mesh, b: Mesh) => {
            b.parent?.metadata?.callbacks?.apply_random_effect();
            if (b.parent?.metadata?.config?.throughable) return;
            safeDispose(a);
        },
    },
    {
        a: "enemy-bullet-mesh-physical",
        b: "player-hit-box",
        action: (a: Mesh, b: Mesh) => {
            b.parent?.metadata?.callbacks?.on_damage();
            safeDispose(a);
        },
    },
    {
        a: "enemy-bullet-mesh-magical",
        b: "player-hit-box",
        action: (a: Mesh, b: Mesh) => {
            b.parent?.metadata?.callbacks?.on_damage();
            safeDispose(a);
        },
    },
    {
        a: "enemy-bullet-mesh",
        b: "enemy-minion-box",
        action: (a: Mesh, b: Mesh) => {
            safeDispose(a);
        },
    },
    {
        a: "enemy-bullet-mesh",
        b: "enemy-minion-sphere-bomb",
        action: (a: Mesh, b: Mesh) => {
            safeDispose(a);
            b?.parent?.metadata?.callbacks?.destroy(true, false);
        },
    },
    {
        a: "enemy-bullet-mesh",
        b: "wall",
        action: (a: Mesh, b: Mesh) => {
            a.getScene()
                .metadata.audio_engine?.getEnemyAudio()
                .playSound("enemy_bullet_wall", 1.0, a.parent);
            safeDispose(a);
        },
    },
    // fallback
    // { a: "*", b: "*", action: (a: Mesh, b: Mesh) => console.log(a.name, b.name) },
];

export class BulletCollisionManager {
    private collidableMeshes: AbstractMesh[] = [];
    private initialized = false;
    private patterns: string[];

    constructor(type: number = 0) {
        this.patterns = COLLISION_MAP[type];
    }

    public initialize(scene: Scene) {
        if (this.initialized) return;

        this.collidableMeshes = scene.meshes.filter(
            (mesh) =>
                this.patterns.some((pattern) => mesh.name.includes(pattern)) && mesh.isEnabled(),
        );

        this.initialized = true;
    }

    // добавить приоритеты, очевидно
    public getCollidableMeshes(): AbstractMesh[] {
        const sorted = [...this.collidableMeshes].sort(
            (a, b) =>
                Number(a.name?.includes("barrier-cylinder-transparent")) -
                Number(b.name?.includes("barrier-cylinder-transparent")),
        );

        return sorted;
    }

    public update(scene: Scene) {
        this.collidableMeshes = scene.meshes.filter(
            (mesh) =>
                this.patterns.some((pattern) => mesh.name.includes(pattern)) && mesh.isEnabled(),
        );
    }

    public dispose(): void {
        this.collidableMeshes = [];
        this.initialized = false;
    }
}
