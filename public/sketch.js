import * as Scenes from './scenes';

let container;
let camera, scene, renderer, clock;
let uniforms, fragmentMaterial;

const shaderScene = new Scenes.PerlinNoiseScene();
  
async function init() {
    container = document.body;

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();
    clock = new THREE.Clock();
    
    const geometry = new THREE.PlaneBufferGeometry( 2, 2 );
    
    const vShader = shaderScene.getVertexShader();
    const fShader = shaderScene.getFragmentShader();
    
    uniforms = {
        u_time: {type: "f", value: 1.0},
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() },
        ...shaderScene.getUniforms()
    };
    
    const vertexShader = await fetch(vShader);
    const vertexShaderText = await vertexShader.text();

    const fragmentShader = await fetch(fShader);
    const fragmentShaderText = await fragmentShader.text();
    
    
    fragmentMaterial = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertexShaderText,
        fragmentShader: fragmentShaderText
    } );

    const mesh = new THREE.Mesh( geometry, fragmentMaterial );
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
    shaderScene.preRender(uniforms);
    render();
    shaderScene.postRender(uniforms);
}

function render() {
    uniforms.u_time.value += (shaderScene.shouldAnimate() * clock.getDelta());
    renderer.render( scene, camera );
}

shaderScene.createGUI();
init().then(() => animate());