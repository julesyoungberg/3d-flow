// TODO: try adding gravitational pull towards center
const particles = [];

const params = {
	size: 50,
	particleCount: 4000,
	particleSize: 0.4,
	particleSpeed: 0.5,
	particleDrag: 0.9,
	bgColor: "#000000",
	// particleBlending: THREE.AdditiveBlending,
	noiseScale: 0.03,
	noiseSpeed: 0.009,
	noiseStrength: 0.08,
	noiseFreeze: false,
	noiseOffset: Math.random()*100,
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

const cent = params.size / 2;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);

	const cam = new Dw.EasyCam(this._renderer, {
		distance: 80, center: [cent, cent, cent]
	});
	cam.zoom(params.size/3);

	noiseSeed(random(10000));

	for (let i = 0; i < params.particleCount; i++) {
		const randPos = () => random(0, params.size);
		particles.push(new Particle(
			createVector(randPos(), randPos(), randPos()),
			particleConfig()
		));
	}
}

function draw() {
	background(255);
	directionalLight(255, 0, 0, 1, 0, .25);
	directionalLight(0, 255, 0, 0, 1, -.25);
	directionalLight(0, 0, 255, 0, 0, .25);
	directionalLight(255, 0, 255, -1, 1, -.25);
	directionalLight(0, 255, 255, 0, 8, -1);
	particles.forEach(particle => particle.run());
	// translate(cent, cent, cent);
	// normalMaterial();
	// box(10);
}
