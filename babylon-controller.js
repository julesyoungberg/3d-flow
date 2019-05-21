class BabylonController {
  constructor() {
    this.canvas = document.getElementById("renderCanvas");
    this.engine = new BABYLON.Engine(this.canvas, true);
  }

  createScene = setup => {
    this.scene = new BABYLON.Scene(this.engine);

  	this.camera = new BABYLON.ArcRotateCamera(
      "Camera",
      -Math.PI / 2, // rotation x ?
      Math.PI / 2, //.1, // rotation y ?
      10, // distance from target
      BABYLON.Vector3.Zero(), // target
      this.scene
    );
    this.camera.attachControl(this.canvas, true);

  	this.ambientLight = new BABYLON.HemisphericLight(
  		"ambientLight", new BABYLON.Vector3(1, 1, 0), this.scene
  	);
    this.pointLight = new BABYLON.PointLight(
  		"pointLight", new BABYLON.Vector3(0, 100, 0), this.scene
  	);

  	const ground = BABYLON.MeshBuilder.CreateGround(
  		"ground", { height: 15, width: 20, subdivisions: 4 }, this.scene
  	);
  	ground.receiveShadows = true;
  	ground.position = new BABYLON.Vector3(0, -2.5, 0);

  	this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.pointLight);

    return this.scene;
  };

  addShadowCaster = mesh => {
    // this.shadowGenerator.getShadowMap().renderList.push(mesh);
    this.shadowGenerator.addShadowCaster(mesh);
  };
}
