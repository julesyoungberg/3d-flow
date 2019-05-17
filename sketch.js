var debug = false;

var flow;
var boids = [];

function setup() {
	createCanvas(windowWidth, windowHeight);

	flow = new FlowField(10);

	for (var i = 0; i < 600; i++) {
    boids.push(new Boid(
			createVector(
				random(width), random(height)), random(5, 10), random(0.5, 1)
			)
		);
  }
}

function draw() {
	background(255, 10);
  //flow.show();
	flow.update();
  // Tell all the boids to follow the flow field
  boids.forEach(boid => {
		boid.separate(boids);
    boid.follow(flow);
    boid.run();
  });
}


function keyPressed() {
  if (key == ' ') {
    debug = !debug;
  }
}

// Make a new flowfield
function mousePressed() {
  flow = new FlowField(20);
}
