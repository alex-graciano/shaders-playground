import * as Scenes from '../scenes';

export const SceneBuilder = () => {
    const url = window.location.href;
    const scene = url.split('/').pop();

    console.info(`Loading ${scene} scene...`)
    switch (scene) {
        case "noise":
            return new Scenes.PerlinNoiseScene();
        case "fbm":
            return new Scenes.FractalBrownianMotionScene();
        default:
            return new Scenes.Scene();
    }
    
}