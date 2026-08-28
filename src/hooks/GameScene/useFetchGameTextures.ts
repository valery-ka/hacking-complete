import { Texture } from "@babylonjs/core";
import { useEffect } from "react";
import { useEngineContext } from "contexts";

export const useFetchGameTextures = () => {
    const { engineSceneRef } = useEngineContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        if (!scene.metadata.textures) scene.metadata.textures = {};

        fetch("textures/game_textures.json")
            .then((r) => r.json())
            .then(async (manifest) => {
                const textureList = manifest.textures || [];

                for (const texPath of textureList) {
                    try {
                        const tex = new Texture(texPath, scene, true, false);
                        scene.metadata.textures[texPath] = tex;
                    } catch (err) {
                        console.warn("Error loading:", texPath, err);
                    }
                }
            })
            .catch((err) => console.error("Error reading textures.json:", err));

        return () => {};
    }, []);
};
