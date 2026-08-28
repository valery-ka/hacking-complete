import { Color3, Mesh, Scene, StandardMaterial, Vector3, VertexData } from "@babylonjs/core";

import * as PlayerVertexData from "assets/models/player/PlayerVertexData";
import { IVertexData } from "types/common";

const LIGHT = "light";
const DARK = "dark";

export class PlayerAssetsManager {
    public static initialize(scene: Scene) {
        if (!scene.metadata.player_assets) {
            scene.metadata.player_assets = {};
        }

        if (!scene.metadata.player_assets.player_meshes) {
            scene.metadata.player_assets.player_meshes = {};
        }

        if (!scene.metadata.player_assets.light_material) {
            scene.metadata.player_assets.light_material = this.createLightMaterial(scene);
        }

        if (!scene.metadata.player_assets.dark_material) {
            scene.metadata.player_assets.dark_material = this.createDarkMaterial(scene);
        }

        this.playerVertexData(scene);

        this.createLightPlayer3HP(scene);
        this.createLightPlayer2HP(scene);
        this.createLightPlayer1HP(scene);

        this.createDarkPlayer3HP(scene);
        this.createDarkPlayer2HP(scene);
        this.createDarkPlayer1HP(scene);

        this.createDualPlayer3HP(scene);
        this.createDualPlayer2HP(scene);
        this.createDualPlayer1HP(scene);

        this.disposeVertexMeshes(scene);
    }

    // From Vertex Data
    private static playerVertexData(scene: Scene) {
        const createMeshPart = (meshName: string, getVertexData: () => IVertexData) => {
            const baseKey = `left_${meshName}_from_vertex`;
            const mesh = new Mesh(baseKey, scene);

            const vertexData = getVertexData();
            const positions = vertexData.positions;
            const indices = vertexData.indices;
            const normals: number[] = [];

            const vertexDataObj = new VertexData();
            VertexData.ComputeNormals(positions, indices, normals);

            vertexDataObj.positions = positions;
            vertexDataObj.indices = indices;
            vertexDataObj.normals = normals;

            vertexDataObj.applyToMesh(mesh);

            mesh.flipFaces(true);

            const cloneKey = `right_${meshName}_from_vertex`;
            const clonedMesh = mesh.clone(cloneKey);
            clonedMesh.scaling.x = -1;

            if (!scene.metadata.player_assets.player_meshes) {
                scene.metadata.player_assets.player_meshes = {};
            }

            scene.metadata.player_assets.player_meshes[baseKey] = mesh;
            scene.metadata.player_assets.player_meshes[cloneKey] = clonedMesh;
        };

        createMeshPart("core", PlayerVertexData.getCoreLeftVertex);
        createMeshPart("box", PlayerVertexData.getBoxLeftVertex);
        createMeshPart("upper_body", PlayerVertexData.getUpperBodyLeftVertex);
    }

    private static disposeVertexMeshes(scene: Scene) {
        const meshes = scene.metadata.player_assets.player_meshes;

        Object.values(meshes).forEach((mesh) => {
            if (mesh instanceof Mesh) {
                mesh.dispose();
            }
        });

        delete scene.metadata.player_assets.player_meshes;
    }

    // General
    private static scaleMesh(mesh: Mesh) {
        mesh.scaling = new Vector3(1.77, 1.77, 1.77);
    }

    public static getAssets(scene: Scene) {
        return scene.metadata?.player_assets;
    }

    // Materials
    private static createLightMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("player-material-light", scene);
        const lightColor = new Color3(0.8, 0.77, 0.69);

        mat.diffuseColor = lightColor;
        mat.emissiveColor = lightColor.scale(0.5);
        return mat;
    }

    private static createDarkMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("player-material-dark", scene);
        const darkColor = new Color3(0.24, 0.23, 0.19);

        mat.diffuseColor = darkColor;
        mat.emissiveColor = darkColor.scale(0.5);
        return mat;
    }

    // === CORE ===
    private static createCoreLeft(scene: Scene, type: string): Mesh {
        const originalMesh = scene.metadata.player_assets.player_meshes
            .left_core_from_vertex as Mesh;
        const clonedMesh = originalMesh.clone(`core-left-${type}`);
        clonedMesh.makeGeometryUnique();

        return clonedMesh;
    }

    private static createCoreRight(scene: Scene, type: string): Mesh {
        const originalMesh = scene.metadata.player_assets.player_meshes
            .right_core_from_vertex as Mesh;
        const clonedMesh = originalMesh.clone(`core-right-${type}`);
        clonedMesh.makeGeometryUnique();

        return clonedMesh;
    }

    // === BOXES ===
    private static createBoxLeft(scene: Scene, type: string): Mesh {
        const originalMesh = scene.metadata.player_assets.player_meshes
            .left_box_from_vertex as Mesh;
        const clonedMesh = originalMesh.clone(`box-left-${type}`);
        clonedMesh.makeGeometryUnique();

        return clonedMesh;
    }

    private static createBoxRight(scene: Scene, type: string): Mesh {
        const originalMesh = scene.metadata.player_assets.player_meshes
            .right_box_from_vertex as Mesh;
        const clonedMesh = originalMesh.clone(`box-right-${type}`);
        clonedMesh.makeGeometryUnique();

        return clonedMesh;
    }

    // === UPPER BODY ===
    private static createUpperBodyLeft(scene: Scene, type: string): Mesh {
        const originalMesh = scene.metadata.player_assets.player_meshes
            .left_upper_body_from_vertex as Mesh;
        const clonedMesh = originalMesh.clone(`upper-body-left-${type}`);
        clonedMesh.makeGeometryUnique();

        return clonedMesh;
    }

    private static createUpperBodyRight(scene: Scene, type: string): Mesh {
        const originalMesh = scene.metadata.player_assets.player_meshes
            .right_upper_body_from_vertex as Mesh;
        const clonedMesh = originalMesh.clone(`upper-body-right-${type}`);
        clonedMesh.makeGeometryUnique();

        return clonedMesh;
    }

    // === LIGHT PLAYER ===
    private static createLightPlayer3HP(scene: Scene) {
        if (!scene.metadata.player_assets.player_light_3_hp) {
            const lightMaterial = scene.metadata.player_assets.light_material;
            const darkMaterial = scene.metadata.player_assets.dark_material;

            const leftBox = this.createBoxLeft(scene, LIGHT);
            const rightBox = this.createBoxRight(scene, LIGHT);
            const leftUpperBody = this.createUpperBodyLeft(scene, LIGHT);
            const rightUpperBody = this.createUpperBodyRight(scene, LIGHT);

            const mergedLightParts = Mesh.MergeMeshes(
                [leftBox, rightBox, leftUpperBody, rightUpperBody],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedLightParts.material = lightMaterial;

            const leftCore = this.createCoreLeft(scene, LIGHT);
            const rightCore = this.createCoreRight(scene, LIGHT);

            const mergedDarkParts = Mesh.MergeMeshes(
                [leftCore, rightCore],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedDarkParts.material = darkMaterial;

            const mergedLightPlayer = Mesh.MergeMeshes(
                [mergedLightParts, mergedDarkParts],
                true,
                true,
                undefined,
                false,
                true,
            ) as Mesh;

            mergedLightPlayer.setEnabled(false);
            mergedLightPlayer.name = "PlayerLight3HP";
            this.scaleMesh(mergedLightPlayer);

            scene.metadata.player_assets.player_light_3_hp = mergedLightPlayer;
        }
    }

    private static createLightPlayer2HP(scene: Scene) {
        if (!scene.metadata.player_assets.player_light_2_hp) {
            const lightMaterial = scene.metadata.player_assets.light_material;
            const darkMaterial = scene.metadata.player_assets.dark_material;

            const leftBox = this.createBoxLeft(scene, LIGHT);
            const leftUpperBody = this.createUpperBodyLeft(scene, LIGHT);
            const rightUpperBody = this.createUpperBodyRight(scene, LIGHT);

            const mergedLightParts = Mesh.MergeMeshes(
                [leftBox, leftUpperBody, rightUpperBody],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedLightParts.material = lightMaterial;

            const leftCore = this.createCoreLeft(scene, LIGHT);
            const rightCore = this.createCoreRight(scene, LIGHT);

            const mergedDarkParts = Mesh.MergeMeshes(
                [leftCore, rightCore],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedDarkParts.material = darkMaterial;

            const mergedLightPlayer = Mesh.MergeMeshes(
                [mergedLightParts, mergedDarkParts],
                true,
                true,
                undefined,
                false,
                true,
            ) as Mesh;

            mergedLightPlayer.setEnabled(false);
            mergedLightPlayer.name = "PlayerLight2HP";
            this.scaleMesh(mergedLightPlayer);

            scene.metadata.player_assets.player_light_2_hp = mergedLightPlayer;
        }
    }

    private static createLightPlayer1HP(scene: Scene) {
        if (!scene.metadata.player_assets.player_light_1_hp) {
            const lightMaterial = scene.metadata.player_assets.light_material;
            const darkMaterial = scene.metadata.player_assets.dark_material;

            const leftUpperBody = this.createUpperBodyLeft(scene, LIGHT);
            const rightUpperBody = this.createUpperBodyRight(scene, LIGHT);

            const mergedLightParts = Mesh.MergeMeshes(
                [leftUpperBody, rightUpperBody],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedLightParts.material = lightMaterial;

            const leftCore = this.createCoreLeft(scene, LIGHT);
            const rightCore = this.createCoreRight(scene, LIGHT);

            const mergedDarkParts = Mesh.MergeMeshes(
                [leftCore, rightCore],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedDarkParts.material = darkMaterial;

            const mergedLightPlayer = Mesh.MergeMeshes(
                [mergedLightParts, mergedDarkParts],
                true,
                true,
                undefined,
                false,
                true,
            ) as Mesh;

            mergedLightPlayer.setEnabled(false);
            mergedLightPlayer.name = "PlayerLight1HP";
            this.scaleMesh(mergedLightPlayer);

            scene.metadata.player_assets.player_light_1_hp = mergedLightPlayer;
        }
    }

    // === DARK PLAYER ===
    private static createDarkPlayer3HP(scene: Scene) {
        if (!scene.metadata.player_assets.player_dark_3_hp) {
            const lightMaterial = scene.metadata.player_assets.light_material;
            const darkMaterial = scene.metadata.player_assets.dark_material;

            const leftBox = this.createBoxLeft(scene, DARK);
            const rightBox = this.createBoxRight(scene, DARK);
            const leftUpperBody = this.createUpperBodyLeft(scene, DARK);
            const rightUpperBody = this.createUpperBodyRight(scene, DARK);

            const mergedDarkParts = Mesh.MergeMeshes(
                [leftBox, rightBox, leftUpperBody, rightUpperBody],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedDarkParts.material = darkMaterial;

            const leftCore = this.createCoreLeft(scene, DARK);
            const rightCore = this.createCoreRight(scene, DARK);

            const mergedLightParts = Mesh.MergeMeshes(
                [leftCore, rightCore],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedLightParts.material = lightMaterial;

            const mergedDarkPlayer = Mesh.MergeMeshes(
                [mergedLightParts, mergedDarkParts],
                true,
                true,
                undefined,
                false,
                true,
            ) as Mesh;

            mergedDarkPlayer.setEnabled(false);
            mergedDarkPlayer.name = "PlayerDark3HP";
            this.scaleMesh(mergedDarkPlayer);

            scene.metadata.player_assets.player_dark_3_hp = mergedDarkPlayer;
        }
    }

    private static createDarkPlayer2HP(scene: Scene) {
        if (!scene.metadata.player_assets.player_dark_2_hp) {
            const lightMaterial = scene.metadata.player_assets.light_material;
            const darkMaterial = scene.metadata.player_assets.dark_material;

            const leftBox = this.createBoxLeft(scene, DARK);
            const leftUpperBody = this.createUpperBodyLeft(scene, DARK);
            const rightUpperBody = this.createUpperBodyRight(scene, DARK);

            const mergedDarkParts = Mesh.MergeMeshes(
                [leftBox, leftUpperBody, rightUpperBody],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedDarkParts.material = darkMaterial;

            const leftCore = this.createCoreLeft(scene, DARK);
            const rightCore = this.createCoreRight(scene, DARK);

            const mergedLightParts = Mesh.MergeMeshes(
                [leftCore, rightCore],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedLightParts.material = lightMaterial;

            const mergedDarkPlayer = Mesh.MergeMeshes(
                [mergedLightParts, mergedDarkParts],
                true,
                true,
                undefined,
                false,
                true,
            ) as Mesh;

            mergedDarkPlayer.setEnabled(false);
            mergedDarkPlayer.name = "PlayerDark2HP";
            this.scaleMesh(mergedDarkPlayer);

            scene.metadata.player_assets.player_dark_2_hp = mergedDarkPlayer;
        }
    }

    private static createDarkPlayer1HP(scene: Scene) {
        if (!scene.metadata.player_assets.player_dark_1_hp) {
            const lightMaterial = scene.metadata.player_assets.light_material;
            const darkMaterial = scene.metadata.player_assets.dark_material;

            const leftUpperBody = this.createUpperBodyLeft(scene, DARK);
            const rightUpperBody = this.createUpperBodyRight(scene, DARK);

            const mergedDarkParts = Mesh.MergeMeshes(
                [leftUpperBody, rightUpperBody],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedDarkParts.material = darkMaterial;

            const leftCore = this.createCoreLeft(scene, DARK);
            const rightCore = this.createCoreRight(scene, DARK);

            const mergedLightParts = Mesh.MergeMeshes(
                [leftCore, rightCore],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedLightParts.material = lightMaterial;

            const mergedDarkPlayer = Mesh.MergeMeshes(
                [mergedLightParts, mergedDarkParts],
                true,
                true,
                undefined,
                false,
                true,
            ) as Mesh;

            mergedDarkPlayer.setEnabled(false);
            mergedDarkPlayer.name = "PlayerDark1HP";
            this.scaleMesh(mergedDarkPlayer);

            scene.metadata.player_assets.player_dark_1_hp = mergedDarkPlayer;
        }
    }

    // === DUAL PLAYER ===
    private static createDualPlayer3HP(scene: Scene) {
        if (!scene.metadata.player_assets.player_dual_3_hp) {
            const lightMaterial = scene.metadata.player_assets.light_material;
            const darkMaterial = scene.metadata.player_assets.dark_material;

            const leftBox = this.createBoxLeft(scene, DARK);
            const leftCore = this.createCoreLeft(scene, DARK);
            const leftUpperBody = this.createUpperBodyLeft(scene, DARK);

            const mergedDarkParts = Mesh.MergeMeshes(
                [leftBox, leftCore, leftUpperBody],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedDarkParts.material = darkMaterial;

            const rightBox = this.createBoxRight(scene, LIGHT);
            const rightCore = this.createCoreRight(scene, LIGHT);
            const rightUpperBody = this.createUpperBodyRight(scene, LIGHT);

            const mergedLightParts = Mesh.MergeMeshes(
                [rightBox, rightCore, rightUpperBody],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedLightParts.material = lightMaterial;

            const mergedDarkPlayer = Mesh.MergeMeshes(
                [mergedLightParts, mergedDarkParts],
                true,
                true,
                undefined,
                false,
                true,
            ) as Mesh;

            mergedDarkPlayer.setEnabled(false);
            mergedDarkPlayer.name = "PlayerDual3HP";
            this.scaleMesh(mergedDarkPlayer);

            scene.metadata.player_assets.player_dual_3_hp = mergedDarkPlayer;
        }
    }

    private static createDualPlayer2HP(scene: Scene) {
        if (!scene.metadata.player_assets.player_dual_2_hp) {
            const lightMaterial = scene.metadata.player_assets.light_material;
            const darkMaterial = scene.metadata.player_assets.dark_material;

            const leftBox = this.createBoxLeft(scene, DARK);
            const leftCore = this.createCoreLeft(scene, DARK);
            const leftUpperBody = this.createUpperBodyLeft(scene, DARK);

            const mergedDarkParts = Mesh.MergeMeshes(
                [leftBox, leftCore, leftUpperBody],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedDarkParts.material = darkMaterial;

            const rightCore = this.createCoreRight(scene, LIGHT);
            const rightUpperBody = this.createUpperBodyRight(scene, LIGHT);

            const mergedLightParts = Mesh.MergeMeshes(
                [rightCore, rightUpperBody],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedLightParts.material = lightMaterial;

            const mergedDarkPlayer = Mesh.MergeMeshes(
                [mergedLightParts, mergedDarkParts],
                true,
                true,
                undefined,
                false,
                true,
            ) as Mesh;

            mergedDarkPlayer.setEnabled(false);
            mergedDarkPlayer.name = "PlayerDual2HP";
            this.scaleMesh(mergedDarkPlayer);

            scene.metadata.player_assets.player_dual_2_hp = mergedDarkPlayer;
        }
    }

    private static createDualPlayer1HP(scene: Scene) {
        if (!scene.metadata.player_assets.player_dual_1_hp) {
            const lightMaterial = scene.metadata.player_assets.light_material;
            const darkMaterial = scene.metadata.player_assets.dark_material;

            const leftCore = this.createCoreLeft(scene, DARK);
            const leftUpperBody = this.createUpperBodyLeft(scene, DARK);

            const mergedDarkParts = Mesh.MergeMeshes(
                [leftCore, leftUpperBody],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedDarkParts.material = darkMaterial;

            const rightCore = this.createCoreRight(scene, LIGHT);
            const rightUpperBody = this.createUpperBodyRight(scene, LIGHT);

            const mergedLightParts = Mesh.MergeMeshes(
                [rightCore, rightUpperBody],
                true,
                true,
                undefined,
                false,
                false,
            ) as Mesh;

            mergedLightParts.material = lightMaterial;

            const mergedDarkPlayer = Mesh.MergeMeshes(
                [mergedLightParts, mergedDarkParts],
                true,
                true,
                undefined,
                false,
                true,
            ) as Mesh;

            mergedDarkPlayer.setEnabled(false);
            mergedDarkPlayer.name = "PlayerDual1HP";
            this.scaleMesh(mergedDarkPlayer);

            scene.metadata.player_assets.player_dual_1_hp = mergedDarkPlayer;
        }
    }
}
