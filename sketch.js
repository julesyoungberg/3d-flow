const params = {
	size: 22,
	noiseScale: 0.10,
	noiseSpeed: 0.009,
	noiseStrength: 0.08,
	noiseFreeze: false,
	particleCount: 3000,
	particleSize: 0.22,
	particleSpeed: 0.1,
	particleDrag: 0.9,
	particleColor: 0x41a5ff, //0x41a5ff, 0xff6728
	bgColor: 0x000000,
	particleBlending: THREE.AdditiveBlending
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  55, window.innerWidth / window.innerHeight, .1, 1000
);
camera.lookAt(scene.position);
camera.position.set(params.size*2, params.size/2, params.size/2);

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitalControls(camera, renderer.domElement)
