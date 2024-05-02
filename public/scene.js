import { Pane } from 'tweakpane'

let container;
let camera, scene, renderer, clock;
let uniforms;

const params = {
    cols: 10,
    rows: 10,
    scaleMin: 1,
    scaleMax : 30,
    frequency: 0.001,
    amplitude: 0.2,
    animate: true,
    frame: 0,
    lineCap: 'butt'
  }

  
  async function init() {
      container = document.body;

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();
    clock = new THREE.Clock();
    
    const geometry = new THREE.PlaneBufferGeometry( 2, 2 );
    
    const vShader = './shaders/vertex.glsl';
    const fShader = './shaders/fragment.glsl';
    
    uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() }
    };
    
    const vertexShader = await fetch(vShader);
    const vertexShaderText = await vertexShader.text();

    const fragmentShader = await fetch(fShader);
    const fragmentShaderText = await fragmentShader.text();
    
    
    const material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertexShaderText,
        fragmentShader: fragmentShaderText
    } );

    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    
    container.appendChild( renderer.domElement );
    
    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );
    
    document.onmousemove = function(e){
        uniforms.u_mouse.value.x = e.pageX
        uniforms.u_mouse.value.y = e.pageY
    }
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    uniforms.u_time.value += clock.getDelta();
    renderer.render( scene, camera );
}

function createGUI() {
    const pane = new Pane();
    let folder;

    folder = pane.addFolder({ title: 'Grid' });
    folder.addBinding(params, 'lineCap', {options: {butt: 'butt', round: 'round', square: 'square'}});
    folder.addBinding(params, 'cols', {min: 2, max: 50, step: 1});
    folder.addBinding(params, 'rows', {min: 2, max: 50, step: 1});
    folder.addBinding(params, 'scaleMin', {min: 1, max: 100, step: 1});
    folder.addBinding(params, 'scaleMax', {min: 1, max: 100, step: 1});
    
    folder = pane.addFolder({ title: 'Noise' });
    folder.addBinding(params, 'frequency', {min: -0.01, max: 0.01});
    folder.addBinding(params, 'amplitude', {min: 0, max: 1});
    folder.addBinding(params, 'animate');
    folder.addBinding(params, 'frame', {min: 0, max: 999});
    
}

createGUI();
init().then(() => animate());