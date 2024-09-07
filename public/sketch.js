import {SceneBuilder} from './scenes';
import { Pane } from 'tweakpane';


let container;
let camera, scene, renderer, clock;
let uniforms, fragmentMaterial;

const shaderScene = SceneBuilder();
let pane;
let panelHidden = false;

const params = {
    tilesPerSize: 1
}

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
        u_originViewport: { type: "v2", value: new THREE.Vector2() },
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

    renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    
    container.appendChild( renderer.domElement );
    
    registerEvents();
    createGUI();
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
    uniforms.u_originViewport.value.x = 0;
    uniforms.u_originViewport.value.y = 0;
    createGUI();
}

function animate() {
    requestAnimationFrame( animate );
    shaderScene.preRender();
    render();
    shaderScene.postRender();
}

function render() {
    uniforms.u_time.value += (shaderScene.shouldAnimate() * clock.getDelta());
    renderer.render( scene, camera );
}


function registerEvents() {

    window.onkeydown = function(e){
        if(e.shiftKey){
            if (e.keyCode == 72) { // H. Hide pannel
                panelHidden = !panelHidden;
                pane.hidden = panelHidden;
                shaderScene.hideGUI(panelHidden);
            }
        }
    }

    window.addEventListener( 'resize', onWindowResize, false );
    onWindowResize();
    
    document.onmousemove = function(e){
        uniforms.u_mouse.value.x = e.pageX
        uniforms.u_mouse.value.y = e.pageY
    }
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
}

function setViewport(
    originX,
    originY,
    resolutionWidth,
    resolutionHeight
) {

    uniforms.u_resolution.value.x = resolutionWidth;
    uniforms.u_resolution.value.y = resolutionHeight;
    uniforms.u_originViewport.value.x = originX;
    uniforms.u_originViewport.value.y = originY;
}

async function makeScreenshot() {
    
    const tileSizeWidth = window.innerWidth;
    const tileSizeHeight = window.innerHeight;
    const imageSizeWidth = tileSizeWidth * params.tilesPerSize;
    const imageSizeHeight = tileSizeHeight * params.tilesPerSize;

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = imageSizeWidth;
    finalCanvas.height = imageSizeHeight;
    const ctx = finalCanvas.getContext('2d');

    for (let y = 0; y < imageSizeHeight; y += tileSizeHeight) {
      for (let x = 0; x < imageSizeWidth; x += tileSizeWidth) {

        setViewport(
            x / imageSizeWidth,
            y / imageSizeHeight,
            imageSizeWidth, 
            imageSizeHeight
        );

        renderer.render( scene, camera );
        const tileURL = renderer.domElement.toDataURL();
        const img = await loadImage(tileURL);
        ctx.drawImage(img, x, imageSizeHeight - tileSizeHeight - y, tileSizeWidth, tileSizeHeight);
      }
    }

    const timestamp = Date.now();
    const screenshotDataURL = finalCanvas.toDataURL();
    const link = document.createElement('a');
    link.download = `render_${timestamp}.jpg`;
    link.href = screenshotDataURL;
    link.click();

    // Reset viewport
    onWindowResize();
}

function createGUI() {
    // Put the common GUI in the lower right part
    const leftMargin = 32; // In pixels. Hardcoded for simplity
    const paneWidth = 256; // In pixels
    const rightPosition = window.innerWidth - paneWidth - leftMargin;

    if (pane) {
        pane.dispose();   
    }
    
    pane = new Pane();
    pane.element.style.position = 'absolute';
    pane.element.style.right = `${rightPosition}px`;
    pane.element.style.width = `${paneWidth}px`;

    const folder = pane.addFolder({ title: 'Common actions' });
    folder.addBinding(params, 'tilesPerSize', {min: 1, max: 16, step: 1});

    folder.addButton({
        title: 'Save',
    }).on('click', () => {
        makeScreenshot();
    });
}


init().then(() => {
    shaderScene.createGUI();
    animate();
});