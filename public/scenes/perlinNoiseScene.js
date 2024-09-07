import { Scene } from "./scene";
import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

export class PerlinNoiseScene extends Scene {
    pane = undefined;

    MIN_VECTOR = -0.5;
    MAX_VECTOR = 0.5;

    fragmentShader = '../shaders/noise/perlinNoiseFragment.glsl';
    
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
            spacePartitions: 1.0,
            length: 1.0
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
        u_length: {type: "f", value: this.params.noise.length},
    }

    randomVector() {
        const x = Math.random() * (this.MAX_VECTOR - this.MIN_VECTOR) + this.MIN_VECTOR;
        const y = Math.random() * (this.MAX_VECTOR - this.MIN_VECTOR) + this.MIN_VECTOR;
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
        this.pane = this.pane ?? new Pane();
        this.pane.registerPlugin(EssentialsPlugin);
        let folder;
    
        folder = this.pane.addFolder({ title: 'Parameters' });
        folder.addBinding(this.params, 'debug');
        folder.addBinding(this.params, 'animate');
    
        this.perlinList = this.pane.addBlade({
            view: 'list',
            label: 'Perlin noise',
            options: this.PERLIN_NOISE,
            value: this.PERLIN_NOISE[this.perlinList.value].value,
        });

        folder = this.pane.addFolder({ title: 'Noise' });
        folder.addBinding(this.params.noise, 'length', {min: -10.0, max: 10.0, step: 0.05});
        folder.addBinding(this.params.noise, 'spacePartitions', {min: 1, max: 20, step: 1.0});

        folder = this.pane.addFolder({ title: 'Divergence vectors', expanded: false, });
        for (const [key, _] of Object.entries(this.params.vectors)) {
            folder.addBinding(this.params.vectors, key, {
                x: {min: this.MIN_VECTOR, max: this.MAX_VECTOR, offset: 1.0},
                y: {min: this.MIN_VECTOR, max: this.MAX_VECTOR, offset: 1.0, inverted: true}
            });
        }

    
        this.fpsGraph = this.pane.addBlade({
            view: 'fpsgraph',
            label: 'FPS',
            rows: 2,
        });
    }

    preRender() {
        this.fpsGraph.begin();
        this.uniforms.u_debug.value = this.params.debug;
        this.uniforms.u_noise.value = this.perlinList.value;
        this.uniforms.u_length.value = this.params.noise.length;
        this.uniforms.u_spacePartitions.value = this.params.noise.spacePartitions;
        this.uniforms.u_divergenceVectors.value = this.mapVectorsToArray(this.params.vectors);
    }

    postRender() {
        this.fpsGraph.end();
    }

    shouldAnimate() {
        return this.params.animate;
    }

    hideGUI(flag) {
        this.pane.hidden = flag;
    }
}