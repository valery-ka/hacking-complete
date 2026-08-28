import {
    Color3,
    CSG,
    Mesh,
    MeshBuilder,
    Scene,
    ShaderMaterial,
    StandardMaterial,
} from "@babylonjs/core";

export class EnemyAssetsManager {
    public static initialize(scene: Scene) {
        if (!scene.metadata.enemy_assets) {
            scene.metadata.enemy_assets = {};
        }

        if (!scene.metadata.enemy_assets.light_material) {
            scene.metadata.enemy_assets.light_material = this.createLightMaterial(scene);
        }

        if (!scene.metadata.enemy_assets.dark_material) {
            scene.metadata.enemy_assets.dark_material = this.createDarkMaterial(scene);
        }

        if (!scene.metadata.enemy_assets.slightly_dark_material) {
            scene.metadata.enemy_assets.slightly_dark_material =
                this.createSlightlyDarkMaterial(scene);
        }

        if (!scene.metadata.enemy_assets.black_material) {
            scene.metadata.enemy_assets.black_material = this.createBlackMaterial(scene);
        }

        if (!scene.metadata.enemy_assets.core_shield_material) {
            scene.metadata.enemy_assets.core_shield_material = this.createCoreShieldMaterial(scene);
        }

        if (!scene.metadata.enemy_assets.sphere_bomb_disc_material) {
            scene.metadata.enemy_assets.sphere_bomb_disc_material =
                this.createSphereBombDiscMaterial(scene);
        }

        if (!scene.metadata.enemy_assets.rocket_material_body) {
            scene.metadata.enemy_assets.rocket_material_body = this.createRocketMaterialBody(scene);
        }

        if (!scene.metadata.enemy_assets.kamikaze_material) {
            scene.metadata.enemy_assets.kamikaze_material = this.createKamikazeMaterial(scene);
        }

        if (!scene.metadata.enemy_assets.laser_inactive_material) {
            scene.metadata.enemy_assets.laser_inactive_material =
                this.createLaserInactiveMaterial(scene);
        }

        if (!scene.metadata.enemy_assets.laser_active_material) {
            scene.metadata.enemy_assets.laser_active_material =
                this.createLaserActiveMaterial(scene);
        }

        this.createEnemyArrowAsset(scene);
        this.createEnemyArrowShieldAsset(scene);
        this.createEnemyArrowShield2Asset(scene);
        this.createEnemyArrowShield3Asset(scene);
        this.createEnemyKamikazeAsset(scene);
        this.createEnemyCheerAsset(scene);
        this.createEnemyBoxAsset(scene);
        this.createEnemyCylinderAsset(scene);
        this.createEnemyCylinderBombAsset(scene);
        this.createEnemyCylinderShieldAsset(scene);
        this.createEnemySphereAsset(scene);
        this.createEnemySphereBombAsset(scene);
        this.createEnemySphereBombDiscAsset(scene);
        this.createEnemySphereShieldAsset(scene);
        this.createRocketMesh(scene);
        this.createEnemyFireballAsset(scene);
    }

    private static createEnemyArrowAsset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_arrow_merged) {
            const head = MeshBuilder.CreateCylinder(
                "enemy-arrow-head",
                {
                    diameterTop: 0,
                    diameterBottom: 1.56,
                    tessellation: 4,
                    height: 0.8,
                },
                scene,
            );

            head.rotation.x = -Math.PI / 4;
            head.rotation.y = -Math.PI / 2;
            head.rotation.z = -Math.PI / 2;

            const back = MeshBuilder.CreateBox(
                "enemy-arrow-back",
                { width: 1.1, depth: 0.8, height: 1.1 },
                scene,
            );
            back.position.z = -0.8;

            const mergedMesh = Mesh.MergeMeshes([head, back], true, true, undefined, false, false);

            if (mergedMesh) {
                mergedMesh.name = "enemy-arrow-merged";

                mergedMesh.material = scene.metadata.enemy_assets.dark_material;

                mergedMesh.convertToFlatShadedMesh();
                mergedMesh.setEnabled(false);

                scene.metadata.enemy_assets.enemy_arrow_merged = mergedMesh;
            }
        }
    }

    private static createEnemyCheerAsset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_cheer_merged) {
            const head = MeshBuilder.CreateCylinder(
                "enemy-cheer-head",
                {
                    diameterTop: 0,
                    diameterBottom: 1.56,
                    tessellation: 4,
                    height: 0.8,
                },
                scene,
            );

            head.position.y = 0.8;
            head.rotation.y = Math.PI / 4;

            const back = MeshBuilder.CreateBox(
                "enemy-cheer-body",
                { width: 1.1, depth: 1.1, height: 0.8 },
                scene,
            );

            const mergedMesh = Mesh.MergeMeshes([head, back], true, true, undefined, false, false);

            if (mergedMesh) {
                mergedMesh.position.y = -0.2;
                mergedMesh.name = "enemy-cheer-merged";

                mergedMesh.material = scene.metadata.enemy_assets.dark_material;

                mergedMesh.convertToFlatShadedMesh();
                mergedMesh.setEnabled(false);

                scene.metadata.enemy_assets.enemy_cheer_merged = mergedMesh;
            }
        }
    }

    private static createEnemyArrowShieldAsset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_arrow_shield_merged) {
            const head = MeshBuilder.CreateCylinder(
                "enemy-arrow-head-shield",
                {
                    diameterTop: 0,
                    diameterBottom: 1.56,
                    tessellation: 4,
                    height: 0.8,
                },
                scene,
            );
            head.rotation.x = -Math.PI / 4;
            head.rotation.y = -Math.PI / 2;
            head.rotation.z = -Math.PI / 2;
            head.material = scene.metadata.enemy_assets.light_material;

            const back = MeshBuilder.CreateBox(
                "enemy-arrow-back",
                { width: 1.1, depth: 0.8, height: 1.1 },
                scene,
            );
            back.position.z = -0.8;
            back.material = scene.metadata.enemy_assets.dark_material;

            const mergedMesh = Mesh.MergeMeshes([head, back], true, true, undefined, false, true);

            if (mergedMesh) {
                mergedMesh.name = "enemy-arrow-shield-merged";

                mergedMesh.convertToFlatShadedMesh();
                mergedMesh.setEnabled(false);

                scene.metadata.enemy_assets.enemy_arrow_shield_merged = mergedMesh;
            }
        }
    }

    private static createEnemyArrowShield2Asset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_arrow_shield_2_merged) {
            const head_1 = MeshBuilder.CreateCylinder(
                "enemy-arrow-head-1-shield",
                {
                    diameterTop: 0,
                    diameterBottom: 1.56,
                    tessellation: 4,
                    height: 0.8,
                },
                scene,
            );
            head_1.position.z = 0.8;

            head_1.rotation.x = -Math.PI / 4;
            head_1.rotation.y = -Math.PI / 2;
            head_1.rotation.z = -Math.PI / 2;
            head_1.material = scene.metadata.enemy_assets.light_material;

            const head_2 = MeshBuilder.CreateCylinder(
                "enemy-arrow-head-2-shield",
                {
                    diameterTop: 0,
                    diameterBottom: 1.56,
                    tessellation: 4,
                    height: 0.8,
                },
                scene,
            );
            head_2.position.z = -0.8;

            head_2.rotation.x = -Math.PI / 4;
            head_2.rotation.y = Math.PI / 2;
            head_2.rotation.z = -Math.PI / 2;

            head_2.material = scene.metadata.enemy_assets.light_material;

            const back = MeshBuilder.CreateBox(
                "enemy-arrow-back",
                { width: 1.1, depth: 0.8, height: 1.1 },
                scene,
            );
            back.material = scene.metadata.enemy_assets.dark_material;

            const mergedMesh = Mesh.MergeMeshes(
                [head_1, head_2, back],
                true,
                true,
                undefined,
                false,
                true,
            );

            if (mergedMesh) {
                mergedMesh.name = "enemy-arrow-shield-2-merged";

                mergedMesh.convertToFlatShadedMesh();
                mergedMesh.setEnabled(false);

                scene.metadata.enemy_assets.enemy_arrow_shield_2_merged = mergedMesh;
            }
        }
    }

    private static createEnemyArrowShield3Asset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_arrow_shield_3_merged) {
            const head_1 = MeshBuilder.CreateCylinder(
                "enemy-arrow-head-1-shield",
                {
                    diameterTop: 0,
                    diameterBottom: 1.56,
                    tessellation: 4,
                    height: 1,
                },
                scene,
            );
            head_1.position.z = 1;

            head_1.rotation.x = -Math.PI / 4;
            head_1.rotation.y = -Math.PI / 2;
            head_1.rotation.z = -Math.PI / 2;
            head_1.material = scene.metadata.enemy_assets.light_material;

            const head_2 = MeshBuilder.CreateCylinder(
                "enemy-arrow-head-2-shield",
                {
                    diameterTop: 0,
                    diameterBottom: 1.56,
                    tessellation: 4,
                    height: 1,
                },
                scene,
            );
            head_2.position.z = -1;

            head_2.rotation.x = -Math.PI / 4;
            head_2.rotation.y = Math.PI / 2;
            head_2.rotation.z = -Math.PI / 2;

            head_2.material = scene.metadata.enemy_assets.light_material;

            const head_3 = MeshBuilder.CreateCylinder(
                "enemy-arrow-head-3-shield",
                {
                    diameterTop: 0,
                    diameterBottom: 1.56,
                    tessellation: 4,
                    height: 1,
                },
                scene,
            );
            head_3.position.x = 1.05;

            head_3.rotation.x = -Math.PI / 4;
            head_3.rotation.z = -Math.PI / 2;

            head_3.material = scene.metadata.enemy_assets.light_material;

            const back = MeshBuilder.CreateBox(
                "enemy-arrow-back",
                { width: 1.1, depth: 1, height: 1.1 },
                scene,
            );
            back.material = scene.metadata.enemy_assets.dark_material;

            const mergedMesh = Mesh.MergeMeshes(
                [head_1, head_2, head_3, back],
                true,
                true,
                undefined,
                false,
                true,
            );

            if (mergedMesh) {
                mergedMesh.name = "enemy-arrow-shield-3-merged";
                mergedMesh.rotation.y = -Math.PI / 2;
                mergedMesh.convertToFlatShadedMesh();
                mergedMesh.setEnabled(false);

                scene.metadata.enemy_assets.enemy_arrow_shield_3_merged = mergedMesh;
            }
        }
    }

    private static createEnemyKamikazeAsset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_kamikaze_merged) {
            const head = MeshBuilder.CreateCylinder(
                "enemy-kamikaze-head",
                {
                    diameterTop: 0,
                    diameterBottom: 1.56,
                    tessellation: 4,
                    height: 0.8,
                },
                scene,
            );
            head.rotation.x = -Math.PI / 4;
            head.rotation.y = -Math.PI / 2;
            head.rotation.z = -Math.PI / 2;
            head.material = scene.metadata.enemy_assets.kamikaze_material;

            const back = MeshBuilder.CreateBox(
                "enemy-kamikaze-back",
                { width: 1.1, depth: 0.8, height: 1.1 },
                scene,
            );
            back.position.z = -0.8;
            back.material = scene.metadata.enemy_assets.black_material;

            const mergedMesh = Mesh.MergeMeshes([head, back], true, true, undefined, false, true);

            if (mergedMesh) {
                mergedMesh.name = "enemy-kamikaze-merged";

                mergedMesh.convertToFlatShadedMesh();
                mergedMesh.setEnabled(false);

                scene.metadata.enemy_assets.enemy_kamikaze_merged = mergedMesh;
            }
        }
    }

    private static createEnemyBoxAsset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_box_merged) {
            const box = MeshBuilder.CreateBox("enemy-box", { size: 1.0 }, scene);
            box.material = scene.metadata.enemy_assets.black_material;

            box.convertToFlatShadedMesh();
            box.setEnabled(false);

            scene.metadata.enemy_assets.enemy_box_merged = box;
        }
    }

    private static createEnemyCylinderAsset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_cylinder_merged) {
            const cylinder = MeshBuilder.CreateCylinder(
                "enemy-cylinder",
                { diameter: 1, height: 1.5, tessellation: 20 },
                scene,
            );

            cylinder.material = scene.metadata.enemy_assets.dark_material;

            // cylinder.convertToFlatShadedMesh();
            cylinder.setEnabled(false);

            scene.metadata.enemy_assets.enemy_cylinder_merged = cylinder;
        }
    }

    private static createEnemyCylinderBombAsset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_cylinder_bomb_merged) {
            const cylinderBody = MeshBuilder.CreateCylinder(
                "enemy-cylinder-bomb-body",
                { diameter: 1, height: 1.5, tessellation: 20 },
                scene,
            );

            const bombSphere1 = MeshBuilder.CreateSphere(
                "enemy-cylinder-bomb-sphere-1",
                { diameter: 0.25, segments: 12 },
                scene,
            );
            bombSphere1.position.copyFromFloats(1, 0, 0);

            const bombSphere2 = MeshBuilder.CreateSphere(
                "enemy-cylinder-bomb-sphere-2",
                { diameter: 0.25, segments: 12 },
                scene,
            );
            bombSphere2.position.copyFromFloats(-0.5, 0, 0.866);

            const bombSphere3 = MeshBuilder.CreateSphere(
                "enemy-cylinder-bomb-sphere-3",
                { diameter: 0.25, segments: 12 },
                scene,
            );
            bombSphere3.position.copyFromFloats(-0.5, 0, -0.866);

            const mergedMesh = Mesh.MergeMeshes(
                [cylinderBody, bombSphere1, bombSphere2, bombSphere3],
                true,
                true,
                undefined,
                false,
                false,
            );

            if (mergedMesh) {
                mergedMesh.name = "enemy-cylinder-bomb-merged";

                mergedMesh.material = scene.metadata.enemy_assets.dark_material;

                // mergedMesh.convertToFlatShadedMesh();
                mergedMesh.setEnabled(false);

                scene.metadata.enemy_assets.enemy_cylinder_bomb_merged = mergedMesh;
            }
        }
    }

    private static createEnemyCylinderShieldAsset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_cylinder_shield_merged) {
            const cylinderBody = MeshBuilder.CreateCylinder(
                "enemy-cylinder-body",
                { diameter: 1, height: 1.5, tessellation: 20 },
                scene,
            );
            cylinderBody.material = scene.metadata.enemy_assets.slightly_dark_material;

            const leftShield = MeshBuilder.CreateCylinder(
                "enemy-cylinder-shield-left",
                { diameterTop: 0, diameterBottom: 1.44, tessellation: 4, height: 0.4 },
                scene,
            );
            leftShield.position.x = -0.85;
            leftShield.rotation.x = Math.PI / 4;
            leftShield.rotation.z = Math.PI / 2;

            const rightShield = MeshBuilder.CreateCylinder(
                "enemy-cylinder-shield-right",
                { diameterTop: 0, diameterBottom: 1.44, tessellation: 4, height: 0.4 },
                scene,
            );
            rightShield.position.x = 0.85;
            rightShield.rotation.x = Math.PI / 4;
            rightShield.rotation.z = -Math.PI / 2;

            const shieldsMerged = Mesh.MergeMeshes(
                [leftShield, rightShield],
                true,
                true,
                undefined,
                false,
                false,
            );

            if (shieldsMerged) {
                shieldsMerged.material = scene.metadata.enemy_assets.light_material;
                shieldsMerged.convertToFlatShadedMesh();

                const finalMerged = Mesh.MergeMeshes(
                    [cylinderBody, shieldsMerged],
                    true,
                    true,
                    undefined,
                    false,
                    true,
                );

                if (finalMerged) {
                    finalMerged.name = "enemy-cylinder-shield-merged";
                    // finalMerged.convertToFlatShadedMesh();
                    finalMerged.setEnabled(false);
                    scene.metadata.enemy_assets.enemy_cylinder_shield_merged = finalMerged;
                }
            }
        }
    }

    private static createEnemySphereAsset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_sphere_merged) {
            const enemySphere = MeshBuilder.CreateSphere(
                "enemy-sphere-merged",
                { diameter: 1.0, segments: 12 },
                scene,
            );
            enemySphere.material = scene.metadata.enemy_assets.dark_material;
            enemySphere.setEnabled(false);

            scene.metadata.enemy_assets.enemy_sphere_merged = enemySphere;
        }
    }

    private static createEnemyFireballAsset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_fireball) {
            const enemyFireball = MeshBuilder.CreateSphere(
                "enemy-sphere-merged",
                { diameter: 1.0, segments: 12 },
                scene,
            );
            enemyFireball.material = scene.metadata.enemy_assets.rocket_material_body;
            enemyFireball.setEnabled(false);

            scene.metadata.enemy_assets.enemy_fireball = enemyFireball;
        }
    }

    private static createEnemySphereBombAsset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_sphere_bomb_merged) {
            const sphereBody = MeshBuilder.CreateSphere(
                "enemy-sphere-bomb-body",
                { diameter: 1.0, segments: 12 },
                scene,
            );

            const bombSphere1 = MeshBuilder.CreateSphere(
                "enemy-cylinder-bomb-sphere-1",
                { diameter: 0.25, segments: 12 },
                scene,
            );
            bombSphere1.position.copyFromFloats(0.636, 0, 0.636);

            const bombSphere2 = MeshBuilder.CreateSphere(
                "enemy-cylinder-bomb-sphere-2",
                { diameter: 0.25, segments: 12 },
                scene,
            );
            bombSphere2.position.copyFromFloats(-0.636, 0, 0.636);

            const bombSphere3 = MeshBuilder.CreateSphere(
                "enemy-cylinder-bomb-sphere-3",
                { diameter: 0.25, segments: 12 },
                scene,
            );
            bombSphere3.position.copyFromFloats(0.636, 0, -0.636);

            const bombSphere4 = MeshBuilder.CreateSphere(
                "enemy-cylinder-bomb-sphere-4",
                { diameter: 0.25, segments: 12 },
                scene,
            );
            bombSphere4.position.copyFromFloats(-0.636, 0, -0.636);

            const mergedMesh = Mesh.MergeMeshes(
                [sphereBody, bombSphere1, bombSphere2, bombSphere3, bombSphere4],
                true,
                true,
                undefined,
                false,
                false,
            );

            if (mergedMesh) {
                mergedMesh.name = "enemy-sphere-bomb-merged";

                mergedMesh.material = scene.metadata.enemy_assets.slightly_dark_material;

                mergedMesh.convertToFlatShadedMesh();
                mergedMesh.setEnabled(false);

                scene.metadata.enemy_assets.enemy_sphere_bomb_merged = mergedMesh;
            }
        }
    }

    private static createEnemySphereBombDiscAsset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_sphere_bomb_disc_merged) {
            const disc = MeshBuilder.CreateDisc("bomb-sphere-disc-mesh", {
                radius: 4.0,
                sideOrientation: Mesh.DOUBLESIDE,
            });
            disc.material = scene.metadata.enemy_assets.sphere_bomb_disc_material;

            disc.rotation.x = -Math.PI / 2;
            disc.position.y = -0.45;
            disc.setEnabled(false);

            scene.metadata.enemy_assets.enemy_sphere_bomb_disc_merged = disc;
        }
    }

    private static createEnemySphereShieldAsset(scene: Scene): void {
        if (!scene.metadata.enemy_assets.enemy_sphere_shield) {
            const sphereShield = MeshBuilder.CreateSphere(
                "enemy-sphere-shield-mesh",
                { diameter: 3.6, segments: 12 },
                scene,
            );

            sphereShield.material = scene.metadata.enemy_assets.core_shield_material;
            sphereShield.setEnabled(false);

            scene.metadata.enemy_assets.enemy_sphere_shield = sphereShield;
        }
    }

    private static createRocketMesh(scene: Scene): void {
        if (!scene.metadata.enemy_assets.rocket_mesh_merged) {
            const cylinder = MeshBuilder.CreateCylinder("rocket-0", {
                tessellation: 4,
                diameterTop: 0.0,
                diameterBottom: 1.0,
                height: 1.2,
            });

            cylinder.rotation.x = -Math.PI / 2;

            const box = MeshBuilder.CreateBox("rocket-1", { size: 1.5 });
            box.position.y = -0.75;

            const cylinderCSG = CSG.FromMesh(cylinder);
            const boxCSG = CSG.FromMesh(box);

            const finalRocketCSG = cylinderCSG.subtract(boxCSG);
            const rocketMesh = finalRocketCSG.toMesh("rocket-mesh-merged");
            rocketMesh.material = scene.metadata.enemy_assets.rocket_material_body;
            rocketMesh.convertToFlatShadedMesh();

            cylinder.dispose();
            box.dispose();

            rocketMesh.rotation.y = Math.PI;
            rocketMesh.setEnabled(false);

            scene.metadata.enemy_assets.rocket_mesh_merged = rocketMesh;
        }
    }

    private static createLightMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("enemy-material-light", scene);
        const diffuse = 1.0;
        const emissive = 0.35;
        mat.diffuseColor = new Color3(diffuse, diffuse, diffuse);
        mat.emissiveColor = new Color3(emissive, emissive, emissive);
        return mat;
    }

    private static createDarkMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("enemy-material-dark", scene);
        mat.diffuseColor = new Color3(0.36, 0.36, 0.36);
        mat.emissiveColor = new Color3(0.12, 0.12, 0.12);
        return mat;
    }

    private static createSlightlyDarkMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("enemy-material-slightly-dark", scene);
        mat.diffuseColor = new Color3(0.27, 0.27, 0.27);
        mat.emissiveColor = new Color3(0.09, 0.09, 0.09);
        return mat;
    }

    private static createBlackMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("enemy-material-black", scene);
        mat.diffuseColor = new Color3(0.18, 0.18, 0.18);
        mat.emissiveColor = new Color3(0.06, 0.06, 0.06);
        return mat;
    }

    private static createCoreShieldMaterial(scene: Scene): ShaderMaterial {
        const mat = new ShaderMaterial(
            "enemy-material-core-shield",
            scene,
            {
                vertex: "coreShieldMaterial",
                fragment: "coreShieldMaterial",
            },
            {
                attributes: ["position", "uv", "world0", "world1", "world2", "world3"],
                uniforms: ["world", "viewProjection", "time"],
                defines: ["#define INSTANCES"],
                needAlphaBlending: true,
            },
        );

        let elapsed = 0;

        scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;
            mat.setFloat("time", elapsed);
        });

        return mat;
    }

    private static createSphereBombDiscMaterial(scene: Scene): ShaderMaterial {
        const mat = new ShaderMaterial(
            "sphere-bomb-disc-material",
            scene,
            {
                vertex: "sphereBombDiscMaterial",
                fragment: "sphereBombDiscMaterial",
            },
            {
                attributes: ["position", "uv", "world0", "world1", "world2", "world3"],
                uniforms: ["world", "viewProjection", "semitransparent"],
                defines: ["#define INSTANCES"],
                needAlphaBlending: true,
            },
        );

        return mat;
    }

    private static createLaserActiveMaterial(scene: Scene): StandardMaterial {
        const material = new StandardMaterial("laser-active-material");

        const primaryColor = new Color3(0.7, 0.27, 0.29);

        material.diffuseColor = primaryColor;
        material.emissiveColor = primaryColor;

        let elapsed = 0;
        const duration = 0.035;

        scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;

            const t = (elapsed % duration) / duration;
            const pingpong = t < 0.5 ? t * 2 : (1 - t) * 2;

            material.emissiveColor = Color3.Lerp(primaryColor.scale(0.5), primaryColor, pingpong);
        });

        return material;
    }

    private static createLaserInactiveMaterial(scene: Scene): StandardMaterial {
        const material = new StandardMaterial("laser-inactive-material", scene);

        const primaryColor = new Color3(1.0, 0.0, 0.0);

        material.diffuseColor = primaryColor;
        material.wireframe = true;

        return material;
    }

    private static createRocketMaterialBody(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("rocket-material-body");
        const emissive = new Color3(1.0, 0.45, 0.25);
        mat.diffuseColor = Color3.Black();
        mat.emissiveColor = emissive;

        let elapsed = 0;
        const duration = 0.5;

        scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;
            const t = (elapsed % duration) / duration;
            const pingpong = t < 0.5 ? t * 2 : (1 - t) * 2;
            mat.emissiveColor = Color3.Lerp(emissive.scale(0.5), emissive, pingpong);
        });

        return mat;
    }

    private static createKamikazeMaterial(scene: Scene): StandardMaterial {
        const mat = new StandardMaterial("kamikaze-material");
        const emissive = new Color3(1.0, 0.1, 0.1);
        mat.diffuseColor = Color3.Black();
        mat.emissiveColor = emissive;

        let elapsed = 0;
        const duration = 0.25;

        scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;
            const t = (elapsed % duration) / duration;
            const pingpong = t < 0.5 ? t * 2 : (1 - t) * 2;
            mat.emissiveColor = Color3.Lerp(emissive.scale(0.5), emissive, pingpong);
        });

        return mat;
    }

    public static getAssets(scene: Scene) {
        return scene.metadata?.enemy_assets;
    }
}
