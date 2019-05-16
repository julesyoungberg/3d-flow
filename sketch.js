var debug = false;

var flow;
var vehicles = [];

function setup() {
	createCanvas(windowWidth, windowHeight);

	flow = new FlowField(10);

	for (var i = 0; i < 600; i++) {
    vehicles.push(new Vehicle(
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
  // Tell all the vehicles to follow the flow field
  vehicles.forEach(vehicle => {
		vehicle.seperate(vehicles);
    vehicle.follow(flow);
    vehicle.run();
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
