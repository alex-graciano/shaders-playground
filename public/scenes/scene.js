export class Scene {
    shouldAnimate() { return false; };
    getVertexShader() {return '/../shaders/vertex.glsl'};
    getFragmentShader() {return '/../shaders/fragment.glsl'};
    
    createGUI() {};
    getUniforms() {};
    preRender() {};
    postRender() {};
}