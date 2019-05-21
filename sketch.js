var debug = false;

var flow;
var boids = [];

let angle = 0

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL)

	const cam = createEasyCam()
  // cam.zoom(1000)

	// flow = new FlowField(10, width, height);
	//
	// for (var i = 0; i < 600; i++) {
  //   boids.push(new Boid(
	// 		createVector(
	// 			random(width), random(height)), random(5, 10), random(0.5, 1)
	// 		)
	// 	);
  // }
}

function draw() {
	background(245);
	ambientLight(60, 60, 60);
	pointLight(255, 255, 255, 0, height * 0.4, 100)
	//directionalLight(255, 255, 255, 0, 1, 0)
	drawFloor()
  // if (debug) flow.show();
	// flow.update();
	drawShape()
  // Tell all the boids to follow the flow field
  // boids.forEach(boid => {
	// 	boid.separate(boids);
  //   boid.follow(flow);
  //   boid.run();
  // });
}

function drawShape() {
	push()
	rotateX(angle)
	rotateY(angle * 0.3)
	rotateZ(angle * 1.2)

	//directionalLight(255, 255, 0, 1, 0, 0)
	noStroke()
	ambientMaterial(255)
	torus(100, 10)
	pop()

	angle += 0.03
}

function drawFloor() {
	push()
	translate(0, height / 2, 0)
	rotateX(PI / 2)
	noStroke()
	ambientMaterial(255)
	plane(10000)
	pop()
}


function keyPressed() {
  if (key == ' ') {
    debug = !debug;
  }
}

function toViewSpace(x, y) {
	if (typeof y === 'undefined') {
		return toViewSpace(x.x, x.y)
	} else {
		return createVector(2 * x - width, 2 * y - height)
	}
}
