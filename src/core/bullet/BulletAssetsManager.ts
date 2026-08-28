import { Mesh, MeshBuilder, Scene, StandardMaterial, Color3 } from "@babylonjs/core";

const SEGMENTS = 8;
export class BulletAssetsManager {
    public static initialize(scene: Scene) {
        if (!scene.metadata.bullet_assets) {
            scene.metadata.bullet_assets = {};
        }

        const highlightLayer1 = scene.metadata.effects?.highlight_layer_player_1;
        const highlightLayer2 = scene.metadata.effects?.highlight_layer_player_2;

        if (!scene.metadata.bullet_assets.light_bullet) {
            const lightMesh = MeshBuilder.CreateCylinder(
                "player-bullet-mesh-light",
                { height: 1.35, diameter: 0.5, tessellation: 4 },
                scene,
            );

            lightMesh.material = this.createLightMaterial(scene);
            lightMesh.rotation.x = Math.PI / 2;
            lightMesh.setEnabled(false);

            scene.metadata.bullet_assets.light_bullet = lightMesh;
        }

        if (!scene.metadata.bullet_assets.dark_bullet) {
            const darkMesh = MeshBuilder.CreateCylinder(
                "player-bullet-mesh-dark",
                { height: 1.35, diameter: 0.5, tessellation: 4 },
                scene,
            );

            darkMesh.material = this.createDarkMaterial(scene);
            darkMesh.rotation.x = Math.PI / 2;
            highlightLayer1?.addMesh(darkMesh, Color3.Black());
            highlightLayer2?.addMesh(darkMesh, Color3.Black());
            darkMesh.setEnabled(false);

            scene.metadata.bullet_assets.dark_bullet = darkMesh;
        }

        if (!scene.metadata.bullet_assets.physical_bullet) {
            const physicalMesh = MeshBuilder.CreateSphere(
                "enemy-bullet-mesh-physical",
                { diameter: 0.9, segments: SEGMENTS },
                scene,
            );

            physicalMesh.material = this.createPhysicalMaterial(scene);
            highlightLayer1?.addMesh(physicalMesh, new Color3(1, 0.6, 0));
            highlightLayer2?.addMesh(physicalMesh, new Color3(1, 0.6, 0));
            physicalMesh.setEnabled(false);

            scene.metadata.bullet_assets.physical_bullet = physicalMesh;
        }

        if (!scene.metadata.bullet_assets.magical_bullet) {
            const magicalMesh = MeshBuilder.CreateSphere(
                "enemy-bullet-mesh-magical",
                { diameter: 0.9, segments: SEGMENTS },
                scene,
            );

            magicalMesh.material = this.createMagicalMaterial(scene);
            highlightLayer1?.addMesh(magicalMesh, new Color3(0.13, 0.03, 0.23));
            highlightLayer2?.addMesh(magicalMesh, new Color3(0.13, 0.03, 0.23));
            magicalMesh.setEnabled(false);

            scene.metadata.bullet_assets.magical_bullet = magicalMesh;
        }

        if (!scene.metadata.bullet_assets.chlorine_bullet) {
            const chlorineMesh = MeshBuilder.CreateSphere(
                "enemy-bullet-mesh-chlorine",
                { diameter: 0.9, segments: SEGMENTS },
                scene,
            );

            chlorineMesh.material = this.createChlorineMaterial(scene);
            chlorineMesh.setEnabled(false);

            scene.metadata.bullet_assets.chlorine_bullet = chlorineMesh;
        }
    }

    public static dispose(scene: Scene) {
        if (!scene.metadata.bullet_assets) {
            return;
        }

        const assets = scene.metadata.bullet_assets;
        const highlightLayers = [
            scene.metadata.effects?.highlight_layer_player_1,
            scene.metadata.effects?.highlight_layer_player_2,
        ];

        const disposeSource = (mesh: Mesh | null | undefined) => {
            if (!mesh) return;

            for (const layer of highlightLayers) {
                try {
                    layer?.removeMesh(mesh);
                } catch {
                    // layer or mesh already tearing down
                }
            }

            const instances = mesh.instances ? [...mesh.instances] : [];
            for (const instance of instances) {
                if (!instance.isDisposed()) instance.dispose();
            }

            const children = [...mesh.getChildren()];
            for (const child of children) {
                if (!child.isDisposed()) child.dispose();
            }

            if (mesh.material) {
                mesh.material.dispose();
            }

            if (!mesh.isDisposed()) {
                mesh.dispose();
            }
        };

        disposeSource(assets.light_bullet);
        assets.light_bullet = null;
        disposeSource(assets.dark_bullet);
        assets.dark_bullet = null;
        disposeSource(assets.physical_bullet);
        assets.physical_bullet = null;
        disposeSource(assets.magical_bullet);
        assets.magical_bullet = null;
        disposeSource(assets.chlorine_bullet);
        assets.chlorine_bullet = null;

        scene.metadata.bullet_assets = null;
    }

    private static createLightMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("player-bullet-material-light", scene);
        mat.diffuseColor = new Color3(0.85, 0.8, 0.66);
        mat.emissiveColor = new Color3(0.85, 0.8, 0.66);
        mat.disableLighting = true;
        return mat;
    }

    private static createDarkMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("player-bullet-material-dark", scene);
        mat.diffuseColor = new Color3(0.24, 0.23, 0.19);
        mat.emissiveColor = Color3.Black();
        mat.disableLighting = true;
        return mat;
    }

    private static createPhysicalMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("enemy-bullet-material-physical", scene);
        const factor0 = 1.2;
        const factor1 = 0.05;
        mat.diffuseColor = new Color3(0.75 * factor1, 0.25 * factor1, 0 * factor1);
        mat.emissiveColor = new Color3(0.75 * factor0, 0.25 * factor0, 0 * factor0);
        mat.disableLighting = true;
        return mat;
    }

    private static createMagicalMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("enemy-bullet-material-magical", scene);
        const factor = 0.7;
        mat.diffuseColor = new Color3(0.13, 0.03, 0.23);
        mat.emissiveColor = new Color3(0.13 * factor, 0.03 * factor, 0.23 * factor);
        mat.disableLighting = true;
        return mat;
    }

    private static createChlorineMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("enemy-bullet-material-chlorine", scene);
        const factor0 = 0.2;
        const factor1 = 0.6;
        mat.diffuseColor = Color3.White().scale(factor0);
        mat.emissiveColor = Color3.White().scale(factor1);
        mat.disableLighting = true;
        return mat;
    }
}
