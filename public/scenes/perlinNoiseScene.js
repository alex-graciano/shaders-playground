import { Scene } from "./scene";
import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

export class PerlinNoiseScene extends Scene {
    vertexShader = './../shaders/vertex.glsl';
    fragmentShader = './../shaders/perlinNoise/fragment.glsl';

    fpsGraph;
    perlinList = {
        value: 0
    };

    PERLIN_NOISE = [
        {text: 'simple', value: 0},
        {text: 'billow', value: 1},
        {text: 'ridged', value: 2},
    ];

    params = {
        debug: false,
        animate: true
    };
 
    
    getVertexShader() { return this.vertexShader}
    getFragmentShader() { return this.fragmentShader }

    getUniforms() {
        return {
            u_debug: { type: "b", value: this.params.debug },
            u_noise: { type: "i", value: this.perlinList.value}
        }
    }
    
    createGUI() {
        const pane = new Pane();
        pane.registerPlugin(EssentialsPlugin);
        let folder;
    
        folder = pane.addFolder({ title: 'Parameters' });
        folder.addBinding(this.params, 'debug');
        folder.addBinding(this.params, 'animate');
    
        this.perlinList = pane.addBlade({
            view: 'list',
            label: 'Perlin noise',
            options: this.PERLIN_NOISE,
            value: this.PERLIN_NOISE[0].value,
        });
    
        this.fpsGraph = pane.addBlade({
            view: 'fpsgraph',
            label: 'FPS',
            rows: 2,
        });
    }

    preRender(uniforms) {
        this.fpsGraph.begin();
        uniforms.u_debug.value = this.params.debug;
        uniforms.u_noise.value = this.perlinList.value;
    }

    postRender(uniforms) {
        this.fpsGraph.end();
    }

    shouldAnimate() {
        return this.params.animate;
    }
}