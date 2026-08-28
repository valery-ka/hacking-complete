import { Texture } from "@babylonjs/core";
import { useEffect, useState } from "react";
import { useEngineContext } from "contexts";

export const useFetchMenuTextures = () => {
    const { engineSceneRef } = useEngineContext();
    const [texturesLoaded, setTexturesLoaded] = useState<boolean>(true);

    // useEffect(() => {
    //     const scene = engineSceneRef.current;
    //     if (!scene) return;

    //     if (!scene.metadata.textures) scene.metadata.textures = {};

    //     let isDisposed = false;
    //     setTexturesLoaded(false);

    //     const loadTextureAsync = (url: string) => {
    //         return new Promise((resolve, reject) => {
    //             const tex: Texture = new Texture(
    //                 url,
    //                 scene,
    //                 true,
    //                 false,
    //                 Texture.NEAREST_SAMPLINGMODE,
    //                 () => resolve(tex),
    //                 (_message, exception) => reject(exception),
    //             );
    //         });
    //     };

    //     const run = async () => {
    //         const manifest = await fetch("textures/ui_textures.json").then((r) => r.json());
    //         const textureList = manifest.textures || [];

    //         const textures = await Promise.all(
    //             textureList.map((path: string) => loadTextureAsync(path)),
    //         );

    //         if (isDisposed) return;

    //         textures.forEach((tex: Texture, i) => {
    //             const path = textureList[i];
    //             scene.metadata.textures[path] = tex;
    //         });

    //         setTexturesLoaded(true);
    //     };

    //     run().catch((err) => console.error(err));

    //     return () => {
    //         isDisposed = true;
    //     };
    // }, []);

    return { texturesLoaded };
};
