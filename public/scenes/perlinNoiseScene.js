import { Scene } from "./scene";
import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

export class PerlinNoiseScene extends Scene {
    fragmentShader = '../shaders/noise/perlinNoiseFragment.glsl';
    
    fpsGraph;
    perlinList = {
        value: 2
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
            v00: this.randomVector(),
            v01: this.randomVector(),
            v02: this.randomVector(),
            v03: this.randomVector(),
            v04: this.randomVector(),
            v10: this.randomVector(),
            v11: this.randomVector(),
            v12: this.randomVector(),
            v13: this.randomVector(),
            v14: this.randomVector(),
            v20: this.randomVector(),
            v21: this.randomVector(),
            v22: this.randomVector(),
            v23: this.randomVector(),
            v24: this.randomVector(),
            v30: this.randomVector(),
            v31: this.randomVector(),
            v32: this.randomVector(),
            v33: this.randomVector(),
            v34: this.randomVector(),
            v40: this.randomVector(),
            v41: this.randomVector(),
            v42: this.randomVector(),
            v43: this.randomVector(),
            v44: this.randomVector(),
        },
        fbm: {
            octaves: 8,
            gain: 0.5,
            lacunarity: 1.0,
            step: 2.5
        },
        noise: {
            vec2Hash: {x: 1.9898, y: 7.233 },
            vec1Hash: 43778.543123,
            spacePartitions: 3.0
        }
    };

    uniforms = {
        u_debug: { type: "b", value: this.params.debug },
        u_noise: { type: "i", value: this.perlinList.value},
        u_divergenceVectors: { value: this.mapVectorsToArray(this.params.vectors)},

        // fbm uniforms
        u_octaves: {type: "i", value: this.params.fbm.octaves},
        u_gain: {type: "f", value: this.params.fbm.gain},
        u_step: {type: "f", value: this.params.fbm.step},
        u_lacunarity: {type: "f", value: this.params.fbm.lacunarity},
        
        // noise uniforms
        u_spacePartitions: {type: "f", value: this.params.noise.spacePartitions},
        u_1dhash: {type: "f", value: this.params.noise.vec1Hash},
        u_2dhash: {type: "v2", value: new THREE.Vector2(
            this.params.noise.vec2Hash.x, this.params.noise.vec2Hash.y
        )},
    }

    randomVector() {
        const min = 0.0;
        const max = 100.0;
        const x = Math.random() * (max - min) + min;
        const y = Math.random() * (max - min) + min;
        return {x, y};
    }

    mapVectorsToArray(vectorsObject) {
        return Object.entries(vectorsObject).map(([_, v]) => new THREE.Vector2(v.x, v.y));
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
            value: this.PERLIN_NOISE[this.perlinList.value].value,
        });

        folder = pane.addFolder({ title: 'Divergence vectors', expanded: false, });
        for (const [key, _] of Object.entries(this.params.vectors)) {
            folder.addBinding(this.params.vectors, key, {
                x: {min: 0, max: 200, offset: 1.0},
                y: {min: 0, max: 200, offset: 1.0, inverted: true}
            });
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