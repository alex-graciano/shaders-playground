import PerlinNoiseScene from './perlinNoiseScene';
import { Scene } from './scene';

export const SceneBuilder = () => {
    const url = window.location.href;
    const scene = url.split('/').pop();

    console.info(`Loading ${scene} scene...`)
    switch (scene) {
        case "perlinNoise":
            return new PerlinNoiseScene();
        default:
            return new Scene();
    }
    
}