import * as Scenes from '../scenes';

export const SceneBuilder = () => {
    const url = window.location.href;
    const scene = url.split('/').pop();

    console.info(`Loading ${scene} scene...`)
    switch (scene) {
        case "perlin":
            return new Scenes.PerlinNoiseScene();
        case "warping":
            return new Scenes.DomainWarpingScene();
        case "fbm":
            return new Scenes.FractalBrownianMotionScene();
        default:
            return new Scenes.Scene();
    }
    
}