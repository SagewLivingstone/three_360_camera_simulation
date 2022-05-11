import * as THREE from "./three/build/three.module.js";

// import "./CubemapToEquirectangular.js";

import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from "./three/examples/jsm/postprocessing/ShaderPass.js";

import { GLTFLoader } from "./three/examples/jsm/loaders/GLTFLoader.js";
import { FisheyeShader } from "./FisheyeShader.js";
import { CubemapToEquirectangular } from "./CubemapToEquirectangular.js";

// *** Setup scene and camera ***

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 140, window.innerWidth / window.innerHeight, 0.001, 1000 );

camera.lookAt(1, 0, 0);

// *** Setup renderer with fisheye projection shader ***

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var equiManaged = new CubemapToEquirectangular( renderer, true );

const composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera ) );

let effect = new ShaderPass( FisheyeShader );
composer.addPass(effect);
effect.renderToScreen = true;

let horizontalFOV = 140.0;
let strength = 1.0;
let cylindricalRatio = 2;
let height = Math.tan( THREE.Math.degToRad(horizontalFOV) / 2) / camera.aspect;

camera.fov = Math.atan(height) * 2 * 180 / Math.PI;
camera.updateProjectionMatrix();

// Push values to uniforms of effect shader
effect.uniforms[ "strength" ].value = strength;
effect.uniforms[ "height" ].value = height;
effect.uniforms[ "aspectRatio" ].value = camera.aspect;
effect.uniforms[ "cylindricalRatio" ].value = cylindricalRatio;

// *** Load the checkerboard box *** 

const gltfLoader = new GLTFLoader();

gltfLoader.load( "./resources/checkerboard_box.glb", (gltf) => {
    gltf.scene.rotation.z = 0.5 * Math.PI;
    scene.add( gltf.scene );
}, undefined, (error) => {
    console.error(error);
});

// *** Simple lighting setup for the scene (we don't really care) ***

const light = new THREE.AmbientLight( 0xffffff );
scene.add(light);

// *** Use a random hdri for the background env map ***

const envMap = new THREE.TextureLoader().load("resources/CERN_360.jpg");
envMap.mapping = THREE.EquirectangularRefractionMapping;
scene.background = envMap;

document.getElementById( 'capture' ).addEventListener( 'click', function( e ) {
    equiManaged.update( camera, scene );
});

// *** Render scene ***

function animate() {
	requestAnimationFrame( animate );

    composer.render();
}

animate();