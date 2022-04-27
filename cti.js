import * as THREE from "./three/build/three.module.js";



function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

animate();