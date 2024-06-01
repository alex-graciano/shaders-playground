import { Scene } from "./scene";

export class DomainWarpingScene extends Scene {
    fragmentShader = './../../shaders/domainWarping/fragment.glsl';
 
    getFragmentShader() { return this.fragmentShader }

    shouldAnimate() { return true; }

}