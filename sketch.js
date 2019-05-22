// TODO: Get params from the following example
// https://codepen.io/EastingAndNorthing/pen/QpYWQq?editors=0010

let cam;
let particles = [];

const size = 50;
const particleCount = 3000;
const cent = size / 2;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	cam = new Dw.EasyCam(this._renderer, {
		distance: 80, center: [cent, cent, cent]
	});
	cam.zoom(size/2);
	noiseSeed(random(10000));

	for (let i = 0; i < particleCount; i++) {
		particles.push(new Particle(
			createVector(random(0, size), random(0, size), random(0, size))
		));
	}
}

function draw() {
	background(0);
	directionalLight(255, 0, 0, 1, 0, .25);
	directionalLight(0, 255, 0, 0, 1, -.25);
	directionalLight(0, 0, 255, 0, 0, .25);
	directionalLight(255, 0, 255, -1, 1, -.25);
	directionalLight(0, 255, 255, 0, 8, -1);
	particles.forEach(particle => particle.run(size));
}

function keyPressed() {
  if (key == ' ') debug = !debug;
}
