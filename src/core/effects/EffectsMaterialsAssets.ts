import { Color3, Scene, StandardMaterial } from "@babylonjs/core";

const WHITE_COLOR = new Color3(0.95, 0.95, 0.95);
const LIGHT_COLOR = new Color3(0.97, 0.95, 0.94);
const DARK_COLOR = new Color3(0.24, 0.23, 0.19);
const RED_COLOR = new Color3(1.0, 0.34, 0.17);
const GREEN_COLOR = new Color3(0.0, 1.0, 0.0);
const BLUE_COLOR = new Color3(0.0, 0.0, 1.0);
const YELLOW_COLOR = new Color3(1.0, 1.0, 0.0);

export class EffectsAssetsManager {
    public static initialize(scene: Scene) {
        if (!scene.metadata.effects_assets) {
            scene.metadata.effects_assets = {};
        }

        if (!scene.metadata.effects_assets.cubes_explosion_light_material) {
            scene.metadata.effects_assets.cubes_explosion_light_material =
                this.createLightMaterial(scene);
        }

        if (!scene.metadata.effects_assets.cubes_explosion_dark_material) {
            scene.metadata.effects_assets.cubes_explosion_dark_material =
                this.createDarkMaterial(scene);
        }

        if (!scene.metadata.effects_assets.cubes_explosion_white_material) {
            scene.metadata.effects_assets.cubes_explosion_white_material =
                this.createWhiteMaterial(scene);
        }

        if (!scene.metadata.effects_assets.cubes_explosion_red_material) {
            scene.metadata.effects_assets.cubes_explosion_red_material =
                this.createRedMaterial(scene);
        }

        if (!scene.metadata.effects_assets.cubes_explosion_green_material) {
            scene.metadata.effects_assets.cubes_explosion_green_material =
                this.createGreenMaterial(scene);
        }

        if (!scene.metadata.effects_assets.cubes_explosion_blue_material) {
            scene.metadata.effects_assets.cubes_explosion_blue_material =
                this.createBlueMaterial(scene);
        }

        if (!scene.metadata.effects_assets.cubes_explosion_yellow_material) {
            scene.metadata.effects_assets.cubes_explosion_yellow_material =
                this.createYellowMaterial(scene);
        }
    }

    private static createLightMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial(`cubes-explosion-light-material`, scene);
        mat.diffuseColor = LIGHT_COLOR as any;
        mat.emissiveColor = LIGHT_COLOR as any;
        mat.transparencyMode = 3;
        return mat;
    }

    private static createDarkMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial(`cubes-explosion-dark-material`, scene);
        mat.diffuseColor = DARK_COLOR as any;
        mat.emissiveColor = new Color3(0, 0, 0);
        mat.transparencyMode = 3;
        return mat;
    }

    private static createWhiteMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial(`cubes-explosion-white-material`, scene);
        mat.diffuseColor = WHITE_COLOR as any;
        mat.emissiveColor = WHITE_COLOR as any;
        mat.transparencyMode = 3;
        return mat;
    }

    private static createRedMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial(`cubes-explosion-red-material`, scene);
        mat.diffuseColor = RED_COLOR as any;
        mat.emissiveColor = RED_COLOR as any;
        mat.transparencyMode = 3;
        return mat;
    }

    private static createGreenMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial(`cubes-explosion-green-material`, scene);
        mat.diffuseColor = GREEN_COLOR as any;
        mat.emissiveColor = GREEN_COLOR as any;
        mat.transparencyMode = 3;
        return mat;
    }

    private static createBlueMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial(`cubes-explosion-blue-material`, scene);
        mat.diffuseColor = BLUE_COLOR as any;
        mat.emissiveColor = BLUE_COLOR as any;
        mat.transparencyMode = 3;
        return mat;
    }

    private static createYellowMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial(`cubes-explosion-yellow-material`, scene);
        mat.diffuseColor = YELLOW_COLOR as any;
        mat.emissiveColor = YELLOW_COLOR as any;
        mat.transparencyMode = 3;
        return mat;
    }

    public static getAssets(scene: Scene) {
        return scene.metadata?.effects_assets;
    }
}
