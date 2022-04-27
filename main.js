import * as THREE from "./three/build/three.module.js";

import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';

import { GLTFLoader } from "./three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 140, window.innerWidth / window.innerHeight, 0.001, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const composer = new EffectComposer( renderer );

camera.lookAt(1, 0, 0);

const gltfLoader = new GLTFLoader();

gltfLoader.load( "./resources/checkerboard_box.glb", (gltf) => {
    gltf.scene.rotation.z = 0.5 * Math.PI;
    scene.add( gltf.scene );
}, undefined, (error) => {
    console.error(error);
});

const light = new THREE.AmbientLight( 0xffffff );
scene.add(light);

const envMap = new THREE.TextureLoader().load("resources/CERN_360.jpg");
envMap.mapping = THREE.EquirectangularRefractionMapping;
scene.background = envMap;

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

animate();