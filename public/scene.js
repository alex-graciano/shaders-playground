var container;
var camera, scene, renderer, clock;
var uniforms;

init().then(() => animate());

async function init() {
    container = document.body;

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

    uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() }
    };

    var vertexShader = await fetch('./shaders/vertex.glsl');
    var vertexShaderText = await vertexShader.text();

    var fragmentShader = await fetch('./shaders/fragment.glsl');
    var fragmentShaderText = await fragmentShader.text();


    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vertexShaderText,
        fragmentShader: fragmentShaderText
    } );

    var mesh = new THREE.Mesh( geometry, material );
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