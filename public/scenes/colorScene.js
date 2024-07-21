import { Scene } from "./scene";
import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

export class ColorScene extends Scene {
    renderer;

    COLOR_COMBINATIONS = [
        {text: 'Complementary', value: 0},
        {text: 'Monochromatic', value: 1},
        {text: 'Analogous', value: 2},
        {text: 'Triadic', value: 3},
        {text: 'Tetradric', value: 4},
    ];

    params = {
        color: { 
            r: this.randomInt(0, 360),
            g: this.randomInt(0, 360),
            b: this.randomInt(0, 360),
        },
        smooth: false,
        mode: { value: 0 },
        angle: 30.0,
        samples: 4,
        scale: 0.1
    };

    uniforms = {
        u_color: {type: "v3", value: new THREE.Vector3(
            this.params.color.r,
            this.params.color.g,
            this.params.color.b
        )},
        u_smooth: {type: "b", value: this.params.smooth},
        u_mode: {type: "i", value: this.params.mode.value},
        u_angle: {type: "f", value: this.params.angle},
        u_scale: {type: "f", value: this.params.scale},
        u_samples: {type: "i", value: this.params.samples}
    }

    shouldAnimate() { return false; };
    getVertexShader() {return '/../shaders/vertex.glsl'};
    getFragmentShader() {return '/../shaders/color/fragment.glsl'};
    
    createGUI() {
        const pane = new Pane();
        pane.registerPlugin(EssentialsPlugin);
        let folder;

        folder = pane.addFolder({ title: 'Parameters' });
        folder.addBinding(this.params, 'color');
        folder.addBinding(this.params, 'smooth');
        folder.addBinding(this.params, 'angle', {
            min: 0,
            max: 90,
            offset: 0.1
          });
        folder.addBinding(this.params, 'samples', {
            min: 2,
            max: 10,
            offset: 1.0
          });
        folder.addBinding(this.params, 'scale', {
            min: 0.0,
            max: 1.0,
            offset: 0.01
          });
        
    
        this.params.mode = pane.addBlade({
            view: 'list',
            label: 'Color combination',
            options: this.COLOR_COMBINATIONS,
            value: this.COLOR_COMBINATIONS[this.params.mode.value].value,
        });

    };
    getUniforms() { return this.uniforms };
    preRender() {
        this.uniforms.u_color.value.x = this.params.color.r / 255.0;
        this.uniforms.u_color.value.y = this.params.color.g / 255.0;
        this.uniforms.u_color.value.z = this.params.color.b / 255.0;
        this.uniforms.u_mode.value = this.params.mode.value;
        this.uniforms.u_smooth.value = this.params.smooth;
        this.uniforms.u_angle.value = this.params.angle;
        this.uniforms.u_samples.value = this.params.samples;
        this.uniforms.u_scale.value = this.params.scale;
        
    };
    postRender() {};

    randomInt(min, max) {
        return Math.floor(Math.random() * ((max-min)+1) + min);
    }
}