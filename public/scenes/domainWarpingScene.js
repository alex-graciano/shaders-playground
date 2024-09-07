import { Scene } from "./scene";

/**
    This scene includes code from the following projects:
    Inigo Quilez https://iquilezles.org/articles/warp/

    This code is an adaptation created by the cited project. All rights reserved
*/
export class DomainWarpingScene extends Scene {
    fragmentShader = './../../shaders/domainWarping/fragment.glsl';
 
    getFragmentShader() { return this.fragmentShader }

    shouldAnimate() { return true; }

}