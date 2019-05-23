const record = false;

const params = {
	size: 50,
	particleCount: 3000,
	particleSize: 10,
	particleSpeed: 0.3,
	noiseScale: 0.03,
	noiseSpeed: 0.009,
	noiseStrength: 0.08,
	noiseOffset: Math.random()*100,
	rotation: 0.013,
};

const particleConfig = () => ({
	size: params.particleSize,
	speed: params.particleSpeed,
	noiseScale: params.noiseScale,
	noiseSpeed: params.noiseSpeed,
	noiseStrength: params.noiseStrength,
	noiseOffset: params.noiseOffset,
	noiseSize: params.size,
});

const cent = params.size / 2;
const particles = [];
let cam, rotation = 0, paused = false;

let capturer, startMillis;
const duration = 60, fps = 60;
const maxFrames = duration * fps;
let frameCount = 0;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	frameRate(fps);
	if (record) {
		capturer = new CCapture({ format: 'webm', framerate: fps, verbose: true });
		capturer.start();
	}

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

	// end
	if (frameCount > maxFrames) {
		noLoop();
		console.log("finished recording");
		capturer.stop();
		capturer.save();
		return;
	}

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

	// save the frame
	if (record) {
		capturer.capture(document.getElementById('defaultCanvas0'));
		frameCount++;
	}
}

function keyPressed() {
	if (key == " ") paused = !paused;
}
