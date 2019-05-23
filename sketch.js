const params = {
	size: 50,
	particleCount: 3000,
	particleSize: 10,
	particleSpeed: 0.3, //0.7,
	particleDrag: 0.9,
	bgColor: "#000000",
	noiseScale: 0.03,
	noiseSpeed: 0.009,
	noiseStrength: 0.08,
	noiseOffset: Math.random()*100,
	rotationSpeed: 0.01,
	lightIntensity: 0.8,
	camDist: 120 // size * 2 + 20
};

const particleConfig = () => ({
	size: params.particleSize,
	speed: params.particleSpeed,
	drag: params.particleDrag,
	noiseScale: params.noiseScale,
	noiseSpeed: params.noiseSpeed,
	noiseStrength: params.noiseStrength,
	noiseOffset: params.noiseOffset,
	noiseSize: params.size,
});

const particles = [];
let paused = false;
let three, cube;

function setup() {
	three = new ThreeController(params);

	// var geometry = new THREE.BoxGeometry( params.size, params.size, params.size );
	// var material = new THREE.MeshLambertMaterial( { color: 0x009900 } );
	// cube = new THREE.Mesh( geometry, material );
	// three.scene.add( cube );
	// cube.position.set(params.size / 2, params.size / 2, params.size / 2);

	const center = new THREE.Vector3(params.size/2, params.size/2, params.size/2);
	const target = new THREE.Object3D();
	target.position = center;

	const lights = [];
	lights[1] = new THREE.DirectionalLight(0xff0000, params.lightIntensity);
	lights[2] = new THREE.DirectionalLight(0x00ff00, params.lightIntensity);
	lights[3] = new THREE.DirectionalLight(0x0000ff, params.lightIntensity);
	lights[4] = new THREE.DirectionalLight(0xff00ff, params.lightIntensity);
	lights[5] = new THREE.DirectionalLight(0x00ffff, params.lightIntensity);
	lights[1].position.set(1000, 0, 250);
	lights[2].position.set(0, 1000, -250);
	lights[3].position.set(0, 0, 250);
	lights[4].position.set(-1000, 1000, -250);
	lights[5].position.set(0, 8000, -1000);

	three.scene.add(target);

	lights.forEach(light => {
		light.target = target;
		three.scene.add(light);
	});

	noise.seed(Math.random());

	for (let i = 0; i < params.particleCount; i++) {
		particles.push(createParticle());
	}
}

let frameCount = 0, gridIndex = 0;

function render() {
	requestAnimationFrame(render);
	three.update(params);

	// updateParticleCount();

	particles.forEach(p => p.run(frameCount));

	frameCount++;
	three.render();
}

function updateParticleCount() {
	const particleOffset = parseInt(params.particleCount - particles.length);
	if (particleOffset > 0) {
		for (let i = 0; i < particleOffset; i++) {
			particles.push(createParticle());
		}
	} else {
		for (let i = 0; i < -particleOffset; i++) {
			three.scene.remove(particles[i].mesh);
			particles.splice(i, 1);
		}
	}
}

function createParticle() {
	const particle = new Particle(particleConfig());
	particle.init(three.scene);
	return particle;
}

setup();
render();
