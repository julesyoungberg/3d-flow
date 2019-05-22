const params = {
	size: 50,
	particleCount: 3000,
	particleSize: 10,
	particleSpeed: 0.7,
	particleDrag: 0.9,
	bgColor: "#000000",
	noiseScale: 0.03,
	noiseSpeed: 0.009,
	noiseStrength: 0.08,
	noiseOffset: Math.random()*100,
	rotation: 0.013,
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
const particles = [];
let cam, rotation = 0, paused = false;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);

	cam = new Dw.EasyCam(this._renderer, {
		distance: 80, center: [cent, cent, cent]
	});
	// cam.zoom(params.size);

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
	if (paused) return;
	
	background(255);
	directionalLight(255, 0, 0, 1, 0, .25);
	directionalLight(0, 255, 0, 0, 1, -.25);
	directionalLight(0, 0, 255, 0, 0, .25);
	directionalLight(255, 0, 255, -1, 1, -.25);
	directionalLight(0, 255, 255, 0, 8, -1);

	particles.forEach(particle => particle.run());

	cam.rotateX(params.rotation);
	cam.rotateY(params.rotation * 0.7);
	cam.rotateZ(params.rotation * 0.3);
}

function keyPressed() {
	if (key == " ") paused = !paused;
}
