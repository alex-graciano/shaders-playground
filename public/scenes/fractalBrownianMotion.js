import { Scene } from "./scene";
import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

export class FractalBrownianMotionScene extends Scene {
    fragmentShader = './../shaders/fractalBrownianMotion/fragment.glsl';
    fpsGraph;

    params = {
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
 
    getFragmentShader() { return this.fragmentShader }

    getUniforms() {
        return this.uniforms;
    }
    
    createGUI() {
        const pane = new Pane();
        pane.registerPlugin(EssentialsPlugin);
        let folder;

        folder = pane.addFolder({ title: 'Noise' });
        folder.addBinding(this.params.noise, 'vec2Hash', {x: {min: 0, max: 10, offset: 0.001}, y: {min: -10, max: 10, offset: 0.001}});
        folder.addBinding(this.params.noise, 'vec1Hash', {min: 10000, max: 50000, step: 0.05});
        folder.addBinding(this.params.noise, 'spacePartitions', {min: 1, max: 20, step: 1.0});
        
        folder = pane.addFolder({ title: 'Fractal Brownian Motion' });
        folder.addBinding(this.params.fbm, 'step', {min: -10, max: 10, step: 0.01});
        folder.addBinding(this.params.fbm, 'octaves', {min: 0, max: 10, step: 1});
        folder.addBinding(this.params.fbm, 'gain', {min: 0, max: 2, step: 0.005});
        folder.addBinding(this.params.fbm, 'lacunarity', {min: 0, max: 2, step: 0.005});
        
        folder = pane.addFolder({ title: 'Warping' });

        this.fpsGraph = pane.addBlade({
            view: 'fpsgraph',
            label: 'FPS',
            rows: 2,
        });
    }

    preRender() {
        this.fpsGraph.begin();
        
        // fbm uniforms
        this.uniforms.u_step.value = this.params.fbm.step;
        this.uniforms.u_octaves.value = this.params.fbm.octaves;
        this.uniforms.u_gain.value = this.params.fbm.gain;
        this.uniforms.u_lacunarity.value = this.params.fbm.lacunarity;

        // noise uniforms
        this.uniforms.u_1dhash.value = this.params.noise.vec1Hash;
        this.uniforms.u_2dhash.value.x = this.params.noise.vec2Hash.x;
        this.uniforms.u_2dhash.value.y = this.params.noise.vec2Hash.y;
        this.uniforms.u_spacePartitions.value = this.params.noise.spacePartitions;
    }

    postRender() {
        this.fpsGraph.end();
    }

    shouldAnimate() {
        return this.params.animate;
    }
}