export class Scene {
    renderer;

    shouldAnimate() { return false; };
    getVertexShader() {return '/../shaders/vertex.glsl'};
    getFragmentShader() {return '/../shaders/fragment.glsl'};
    setRenderer(renderer) { this.renderer = renderer }
    
    createGUI() {};
    getUniforms() {};
    preRender() {};
    postRender() {};
}