let debug = true;

let cam, flow;
let boids = [];

const resolution = 30;
const size = 100;
const boidCount = 500;
const cent = (size) / 2;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	cam = new Dw.EasyCam(this._renderer, {
		distance: 80, center: [cent, cent, cent]
	});
	// cam.zoom(0.001)

	flow = new FlowField(resolution, size);

	// for (let i = 0; i < boidCount; i++) {
	// 	boids.push(new Boid(
	// 		createVector(
	// 			random(0, resolution / 4) + 3 * resolution / 8,
	// 			random(0, resolution / 4) + 3 * resolution / 8,
	// 			0
	// 		),
	// 		random(.5, 5),
	// 		random(0.1, .5)
	// 	));
	// }
}

function draw() {
	background(255);
	if (debug) flow.show();
	boids.forEach(boid => boid.run(flow, boids));
	// push();
	// translate(cent, cent, cent);
	// noStroke();
	// ambientMaterial(127);
	// box(size);
	// pop();
}

function keyPressed() {
  if (key == ' ') debug = !debug;
}
