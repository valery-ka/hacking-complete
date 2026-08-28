import {
    MeshBuilder,
    StandardMaterial,
    TransformNode,
    Scene,
    Vector3,
    Mesh,
    ShadowGenerator,
    PhysicsImpostor,
} from "@babylonjs/core";

import { PlayerConfig } from "types/player/Player.types";

const MODEL_OFFSET = 0.0;

export class PlayerModel {
    private scene: Scene;
    private player: TransformNode;

    private isLightModel?: boolean;
    private isDarkModel?: boolean;
    private isGodModel?: boolean;

    private allMeshes: Mesh[] = [];
    private allMaterials: StandardMaterial[] = [];

    constructor(scene: Scene, name: string = "player-light") {
        this.scene = scene;

        this.isLightModel = name === "light";
        this.isDarkModel = name === "dark";
        this.isGodModel = name === "god";

        this.player = new TransformNode(`player-${name}`, scene);
    }

    // === Model / Collision ===
    public build(config: PlayerConfig): TransformNode {
        this.createHitBox(this.player);

        if (this.isLightModel) {
            this.updateAllToLight();
        } else if (this.isDarkModel) {
            this.updateAllToDark();
        } else if (this.isGodModel) {
            this.updateAllToGod();
        }

        return this.player;
    }

    public updateAllToLight(): void {
        const assets = this.scene.metadata.player_assets;

        this.clearHitBoxInstances();

        const hp3 = assets.player_light_3_hp.createInstance("player-light-3-hp");
        const hp2 = assets.player_light_2_hp.createInstance("player-light-2-hp");
        const hp1 = assets.player_light_1_hp.createInstance("player-light-1-hp");

        hp3.parent = this.player;
        hp2.parent = this.player;
        hp1.parent = this.player;

        hp3.setEnabled(true);
        hp2.setEnabled(false);
        hp1.setEnabled(false);

        this.addShadow(hp3);
        this.addShadow(hp2);
        this.addShadow(hp1);

        this.player.metadata = { ...this.player.metadata, hp3, hp2, hp1 };

        this.isLightModel = true;
        this.isDarkModel = false;
        this.isGodModel = false;
    }

    public updateAllToDark(): void {
        const assets = this.scene.metadata.player_assets;

        this.clearHitBoxInstances();

        const hp3 = assets.player_dark_3_hp.createInstance("player-dark-3-hp");
        const hp2 = assets.player_dark_2_hp.createInstance("player-dark-2-hp");
        const hp1 = assets.player_dark_1_hp.createInstance("player-dark-1-hp");

        hp3.parent = this.player;
        hp2.parent = this.player;
        hp1.parent = this.player;

        hp3.setEnabled(true);
        hp2.setEnabled(false);
        hp1.setEnabled(false);

        this.addShadow(hp3);
        this.addShadow(hp2);
        this.addShadow(hp1);

        this.player.metadata = { ...this.player.metadata, hp3, hp2, hp1 };

        this.isLightModel = false;
        this.isDarkModel = true;
        this.isGodModel = false;
    }

    public updateAllToGod(): void {
        const assets = this.scene.metadata.player_assets;

        this.clearHitBoxInstances();

        const hp3 = assets.player_light_3_hp.createInstance("player-light-3-hp");
        const hp2 = assets.player_dark_2_hp.createInstance("player-dark-2-hp");
        const hp1 = assets.player_dual_1_hp.createInstance("player-dual-1-hp");

        hp3.parent = this.player;
        hp2.parent = this.player;
        hp1.parent = this.player;

        hp3.setEnabled(true);
        hp2.setEnabled(false);
        hp1.setEnabled(false);

        this.addShadow(hp3);
        this.addShadow(hp2);
        this.addShadow(hp1);

        this.player.metadata = { ...this.player.metadata, hp3, hp2, hp1 };

        this.isLightModel = false;
        this.isDarkModel = false;
        this.isGodModel = true;
    }

    public updateAllToDual(): void {
        const assets = this.scene.metadata.player_assets;

        this.clearHitBoxInstances();

        const hp3 = assets.player_dual_3_hp.createInstance("player-dual-3-hp");
        const hp2 = assets.player_dual_2_hp.createInstance("player-dual-2-hp");
        const hp1 = assets.player_dual_1_hp.createInstance("player-dual-1-hp");

        hp3.parent = this.player;
        hp2.parent = this.player;
        hp1.parent = this.player;

        hp3.setEnabled(true);
        hp2.setEnabled(false);
        hp1.setEnabled(false);

        this.addShadow(hp3);
        this.addShadow(hp2);
        this.addShadow(hp1);

        this.player.metadata = { ...this.player.metadata, hp3, hp2, hp1 };

        this.isLightModel = false;
        this.isDarkModel = false;
        this.isGodModel = true;
    }

    private clearHitBoxInstances(): void {
        const metadata = this.player.metadata;
        if (metadata) {
            if (metadata.hp3) {
                metadata.hp3.dispose();
            }
            if (metadata.hp2) {
                metadata.hp2.dispose();
            }
            if (metadata.hp1) {
                metadata.hp1.dispose();
            }
        }
    }

    public createCollisionBox() {
        const mesh = MeshBuilder.CreateCylinder(
            "player-collision-box",
            { height: 0.3, diameter: 0.75, tessellation: 6 },
            this.scene,
        );

        const mat = new StandardMaterial("player-collision-box-material", this.scene);
        mat.wireframe = true;
        mat.alpha = 0.3;

        mesh.position.copyFrom(this.player.position);
        mesh.isVisible = false;
        mesh.material = mat;

        mesh.physicsImpostor = new PhysicsImpostor(
            mesh,
            PhysicsImpostor.SphereImpostor,
            {
                mass: 1,
            },
            this.scene,
        );

        this.trackMesh(mesh, mat);

        return mesh;
    }

    private createHitBox(player: TransformNode) {
        const mesh = MeshBuilder.CreateCylinder(
            "player-hit-box",
            {
                height: 0.75,
                diameter: 0.55,
                tessellation: 4,
            },
            this.scene,
        );

        this.playerModelOffset(mesh);

        mesh.isPickable = false;
        mesh.alwaysSelectAsActiveMesh = false;

        mesh.position.y = 0.2;

        const mat = new StandardMaterial("hit-box-material", this.scene);
        mat.wireframe = true;

        mesh.isVisible = false;
        mesh.material = mat;
        mesh.parent = player;

        this.trackMesh(mesh, mat);
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

    private playerModelOffset(mesh: Mesh) {
        mesh.position.z -= MODEL_OFFSET;
    }

    private scaleBodyMesh(mesh: Mesh) {
        mesh.position.scaleInPlace(0.825);
        mesh.scaling.multiplyInPlace(new Vector3(0.825, 0.9, 0.9));
    }

    private trackMesh(mesh: Mesh, material?: StandardMaterial) {
        this.allMeshes.push(mesh);
        if (material) this.allMaterials.push(material);
        else if (mesh.material) this.allMaterials.push(mesh.material as StandardMaterial);
    }

    private trackMaterial(mat: StandardMaterial) {
        this.allMaterials.push(mat);
    }

    public dispose() {
        this.allMaterials.forEach((mat) => mat.dispose());
        this.allMaterials = [];

        this.allMeshes.forEach((mesh) => mesh.dispose());
        this.allMeshes = [];

        this.player.dispose();
    }
}
