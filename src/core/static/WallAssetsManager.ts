import { Color3, MeshBuilder, Scene, ShaderMaterial, StandardMaterial } from "@babylonjs/core";

export class WallAssetsManager {
    public static initialize(scene: Scene) {
        if (!scene.metadata.wall_assets) {
            scene.metadata.wall_assets = {};
        }

        if (!scene.metadata.wall_assets.box_wall_light) {
            const box_wall_light = MeshBuilder.CreateBox(
                "box-wall-light-instance-mesh",
                { size: 1 },
                scene,
            );

            box_wall_light.setEnabled(false);
            box_wall_light.convertToUnIndexedMesh();
            box_wall_light.material = this.createLightMaterial(scene);

            scene.metadata.wall_assets.box_wall_light = box_wall_light;
        }

        if (!scene.metadata.wall_assets.box_wall_dark) {
            const box_wall_dark = MeshBuilder.CreateBox(
                "box-wall-dark-instance-mesh",
                { size: 1 },
                scene,
            );

            box_wall_dark.setEnabled(false);
            box_wall_dark.convertToUnIndexedMesh();
            box_wall_dark.material = this.createDarkMaterial(scene);

            scene.metadata.wall_assets.box_wall_dark = box_wall_dark;
        }

        if (!scene.metadata.wall_assets.box_wall_base) {
            const box_wall_base = MeshBuilder.CreateBox(
                "box-wall-base-instance-mesh",
                { size: 1 },
                scene,
            );

            box_wall_base.setEnabled(false);
            box_wall_base.convertToUnIndexedMesh();
            box_wall_base.material = this.createBaseMaterial(scene);

            scene.metadata.wall_assets.box_wall_base = box_wall_base;
        }

        if (!scene.metadata.wall_assets.box_wall_ui) {
            const box_wall_ui = MeshBuilder.CreateBox(
                "box-wall-ui-instance-mesh",
                { size: 1 },
                scene,
            );

            box_wall_ui.setEnabled(false);
            box_wall_ui.convertToUnIndexedMesh();
            box_wall_ui.material = this.createUIMaterial(scene);

            scene.metadata.wall_assets.box_wall_ui = box_wall_ui;
        }

        if (!scene.metadata.wall_assets.box_wall_invisible) {
            const box_wall_invisible = MeshBuilder.CreateBox(
                "box-wall-invisible-instance-mesh",
                { size: 1 },
                scene,
            );

            box_wall_invisible.setEnabled(false);
            box_wall_invisible.convertToUnIndexedMesh();
            box_wall_invisible.material = this.createInvisibleMaterial(scene);
            box_wall_invisible.visibility = 0.0;

            scene.metadata.wall_assets.box_wall_invisible = box_wall_invisible;
        }

        if (!scene.metadata.wall_assets.cylinder_wall_light) {
            const cylinder_wall_light = MeshBuilder.CreateCylinder(
                "cylinder-wall-light-instance-mesh",
                { height: 1, diameter: 1, tessellation: 12 },
                scene,
            );

            cylinder_wall_light.setEnabled(false);
            cylinder_wall_light.material = this.createLightMaterial(scene);

            scene.metadata.wall_assets.cylinder_wall_light = cylinder_wall_light;
        }

        if (!scene.metadata.wall_assets.cylinder_wall_dark) {
            const cylinder_wall_dark = MeshBuilder.CreateCylinder(
                "cylinder-wall-dark-instance-mesh",
                { height: 1, diameter: 1, tessellation: 12 },
                scene,
            );

            cylinder_wall_dark.setEnabled(false);
            cylinder_wall_dark.material = this.createDarkMaterial(scene);

            scene.metadata.wall_assets.cylinder_wall_dark = cylinder_wall_dark;
        }

        if (!scene.metadata.wall_assets.cylinder_wall_base) {
            const cylinder_wall_base = MeshBuilder.CreateCylinder(
                "cylinder-wall-base-instance-mesh",
                { height: 1, diameter: 1, tessellation: 12 },
                scene,
            );

            cylinder_wall_base.setEnabled(false);
            cylinder_wall_base.material = this.createBaseMaterial(scene);

            scene.metadata.wall_assets.cylinder_wall_base = cylinder_wall_base;
        }

        if (!scene.metadata.wall_assets.cylinder_wall_invisible) {
            const cylinder_wall_invisible = MeshBuilder.CreateCylinder(
                "cylinder-wall-invisible-instance-mesh",
                { height: 1, diameter: 1, tessellation: 12 },
                scene,
            );

            cylinder_wall_invisible.setEnabled(false);
            cylinder_wall_invisible.convertToUnIndexedMesh();
            cylinder_wall_invisible.material = this.createInvisibleMaterial(scene);
            cylinder_wall_invisible.visibility = 0.0;

            scene.metadata.wall_assets.cylinder_wall_invisible = cylinder_wall_invisible;
        }

        if (!scene.metadata.wall_assets.cylinder_wall_transparent) {
            const cylinder_wall_transparent = MeshBuilder.CreateCylinder(
                "cylinder-wall-transparent-instance-mesh",
                { height: 1, diameter: 1, tessellation: 12 },
                scene,
            );

            cylinder_wall_transparent.setEnabled(false);
            cylinder_wall_transparent.convertToUnIndexedMesh();
            cylinder_wall_transparent.material = this.createTransparentMaterial(scene);
            cylinder_wall_transparent.visibility = 0.25;

            scene.metadata.wall_assets.cylinder_wall_transparent = cylinder_wall_transparent;
        }

        if (!scene.metadata.wall_assets.lawa_box_wall) {
            const lawa_box_wall = MeshBuilder.CreateBox(
                "lawa-wall-box-instance-mesh",
                { size: 1 },
                scene,
            );

            lawa_box_wall.setEnabled(false);
            lawa_box_wall.convertToUnIndexedMesh();
            lawa_box_wall.material = this.createSphereLawaWallMaterial(scene);

            scene.metadata.wall_assets.lawa_box_wall = lawa_box_wall;
        }

        if (!scene.metadata.wall_assets.lawa_box_wall_transparent) {
            scene.metadata.wall_assets.lawa_box_wall_transparent =
                this.createSphereLawaWallTransparentMaterial(scene);
        }

        if (!scene.metadata.wall_assets.lawa_box_wall_not_instanced) {
            scene.metadata.wall_assets.lawa_box_wall_not_instanced =
                this.createSphereLawaWallTransparentMaterialNotInstanced(scene);
        }
    }

    private static createSphereLawaWallMaterial(scene: Scene): ShaderMaterial {
        const mat = new ShaderMaterial(
            `lawa-wall-material`,
            scene,
            {
                vertex: "lavaWallMaterial",
                fragment: "lavaWallMaterial",
            },
            {
                needAlphaBlending: false,
                attributes: ["position", "uv", "world0", "world1", "world2", "world3"],
                uniforms: ["world", "viewProjection", "semitransparent"],
                defines: ["#define INSTANCES"],
            },
        );

        mat.setFloat("semitransparent", 1.0);

        return mat;
    }

    private static createSphereLawaWallTransparentMaterialNotInstanced(
        scene: Scene,
    ): ShaderMaterial {
        const mat = new ShaderMaterial(
            `lawa-wall-material`,
            scene,
            {
                vertex: "lavaWallMaterial",
                fragment: "lavaWallMaterial",
            },
            {
                needAlphaBlending: false,
                attributes: ["position", "uv", "world0", "world1", "world2", "world3"],
                uniforms: ["world", "viewProjection", "semitransparent"],
            },
        );

        mat.setFloat("semitransparent", 1.0);

        return mat;
    }

    private static createSphereLawaWallTransparentMaterial(scene: Scene): ShaderMaterial {
        const mat = new ShaderMaterial(
            `lawa-skeleton-material`,
            scene,
            {
                vertex: "lavaWallMaterial",
                fragment: "lavaWallMaterial",
            },
            {
                needAlphaBlending: true,
                attributes: ["position", "uv"],
                uniforms: ["world", "viewProjection", "semitransparent"],
            },
        );

        mat.setFloat("semitransparent", 0.0);
        mat.backFaceCulling = false;

        return mat;
    }

    private static createLightMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("wall-light-material", scene);

        mat.diffuseColor = new Color3(0.8, 0.77, 0.69);
        mat.emissiveColor = new Color3(0.4, 0.385, 0.345);
        return mat;
    }

    private static createDarkMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("wall-dark-material", scene);

        mat.diffuseColor = new Color3(0.2, 0.19, 0.16);
        mat.emissiveColor = new Color3(0.1, 0.095, 0.08);
        return mat;
    }

    private static createInvisibleMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("wall-invisible-material", scene);

        mat.alpha = 0;
        return mat;
    }

    private static createUIMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("wall-ui-material", scene);

        mat.diffuseColor = new Color3(0.6, 0.56, 0.46);
        mat.emissiveColor = new Color3(0.3, 0.28, 0.23);

        return mat;
    }

    private static createBaseMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("wall-base-material", scene);

        mat.diffuseColor = new Color3(0.71, 0.67, 0.53);
        mat.emissiveColor = new Color3(0.355, 0.335, 0.265);

        return mat;
    }

    private static createTransparentMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("wall-base-material", scene);

        mat.diffuseColor = new Color3(0.96, 0.89, 0.73);
        mat.emissiveColor = new Color3(0.96, 0.89, 0.73);

        return mat;
    }

    public static getAssets(scene: Scene) {
        return scene.metadata?.wall_assets;
    }
}
