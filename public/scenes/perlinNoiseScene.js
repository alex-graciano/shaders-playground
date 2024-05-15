import { Scene } from "./scene";
import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

export class PerlinNoiseScene extends Scene {
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
        animate: false,
        vectors: {
            v00: {x: 0.5, y: 0.5},
            v01: {x: 0.5, y: 0.5},
            v02: {x: 0.5, y: 0.5},
            v03: {x: 0.5, y: 0.5},
            v04: {x: 0.5, y: 0.5},
            v00: {x: 0.5, y: 0.5},
            v11: {x: 0.5, y: 0.5},
            v12: {x: 0.5, y: 0.5},
            v13: {x: 0.5, y: 0.5},
            v14: {x: 0.5, y: 0.5},
            v20: {x: 0.5, y: 0.5},
            v21: {x: 0.5, y: 0.5},
            v22: {x: 0.5, y: 0.5},
            v23: {x: 0.5, y: 0.5},
            v24: {x: 0.5, y: 0.5},
            v30: {x: 0.5, y: 0.5},
            v31: {x: 0.5, y: 0.5},
            v32: {x: 0.5, y: 0.5},
            v33: {x: 0.5, y: 0.5},
            v34: {x: 0.5, y: 0.5},
            v40: {x: 0.5, y: 0.5},
            v41: {x: 0.5, y: 0.5},
            v42: {x: 0.5, y: 0.5},
            v43: {x: 0.5, y: 0.5},
            v44: {x: 0.5, y: 0.5},
        }
    };

    uniforms = {
        u_debug: { type: "b", value: this.params.debug },
        u_noise: { type: "i", value: this.perlinList.value}
    }
 
    getFragmentShader() { return this.fragmentShader }

    getUniforms() {
        return this.uniforms;
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

        folder = pane.addFolder({ title: 'Divergence vectors' });
        for (const [key, _] of Object.entries(this.params.vectors)) {
            folder.addBinding(this.params.vectors, key, {x: {min: -1, max: 1, offset: 0.001}, y: {min: -1, max: 1, offset: 0.001}});
        }

    
        this.fpsGraph = pane.addBlade({
            view: 'fpsgraph',
            label: 'FPS',
            rows: 2,
        });
    }

    preRender() {
        this.fpsGraph.begin();
        this.uniforms.u_debug.value = this.params.debug;
        this.uniforms.u_noise.value = this.perlinList.value;
    }

    postRender() {
        this.fpsGraph.end();
    }

    shouldAnimate() {
        return this.params.animate;
    }
}