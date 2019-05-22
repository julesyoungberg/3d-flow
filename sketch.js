const Babylon = BABYLON;

let debug = false;

let babylon, scene, flow;
let boids = [];

const resolution = 30;
const size = 4;
const boidCount = 300;

function setup() {
	babylon = new BabylonController();
	scene = babylon.createScene();

	flow = new FlowField(babylon, resolution, size);

	if (debug) flow.show();

	for (let i = 0; i < boidCount; i++) {
		boids.push(new Boid(
			new Babylon.Vector3(
				random(0, resolution / 4) + 3 * resolution / 8,
				random(0, resolution / 4) + 3 * resolution / 8,
				0
			),
			random(.5, 5	),
			random(0.1, .5)
		));
	}

	babylon.engine.runRenderLoop(() => {
		// Tell all the boids to follow the flow field
		boids.forEach(boid => boid.run(flow, boids));
		scene.render();
	});

	window.addEventListener("resize", babylon.engine.resize);
}

function keyPressed() {
  if (key == ' ') {
    debug = !debug;
		if (debug) flow.show();
		else flow.deleteLines();
  }
}
