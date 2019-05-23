const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

class Particle {
  constructor(config) {
    this.maxForce = .1;
    this.acceleration = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.geometry = new THREE.BoxGeometry(config.size, config.size, config.size);

    const randV = () => Math.random() * config.noiseSize;
    this.position = new THREE.Vector3(randV(), randV(), randV());
    this.mesh = null;
    this.configure(config);
  }

  init(scene) {
    this.mesh = new THREE.Mesh(this.geometry, material);
    this.mesh.geometry.dynamic = true;
    this.mesh.geometry.verticesNeedUpdate = true;
    scene.add(this.mesh);
  }

  configure = ({
    size, speed, drag,
    noiseScale, noiseSpeed, noiseStrength, noiseOffset, noiseSize,
  }) => {
    if (size) this.size = size;
    if (speed) this.speed = speed;
    if (drag) this.drag = drag;
    if (noiseScale) this.noiseScale = noiseScale;
    if (noiseSpeed) this.noiseSpeed = noiseSpeed;
    if (noiseStrength) this.noiseStrength = noiseStrength;
    if (noiseOffset) this.noiseOffset = noiseOffset;
    if (noiseSize) this.noiseSize = noiseSize;
  }

  // show = () => {
  //   const cent = this.noiseSize / 2;
  //   const center = new THREE.Vector3(cent, cent, cent);
  //   const distToCenter = p5.Vector.dist(center, this.position);
  //   const factor = 1 / map(
  //     distToCenter, 0, this.noiseSize, 1, 25
  //   );
  //
  //   push();
  //   noStroke();
  //   translate(this.position.x, this.position.y, this.position.z);
  //   rotate(this.velocity.heading());
  //   ambientMaterial(255);
  //   box(this.size * factor);
  //   pop();
  // }

  run = (frameCount) => {
    this.followFlow(frameCount);
    this.borders();
    this.update();
    // this.show();
  }

  followFlow = (frameCount) => {
    const p = this.position.clone().multiplyScalar(this.noiseScale);
    const sample = noise.perlin3(
      p.x,
      p.y,
      p.z + this.noiseOffset + frameCount * this.noiseSpeed
    ) * Math.PI * 2;

    const euler = new THREE.Euler(sample, sample, sample);
    this.acceleration.set(1, 1, 1);
    this.acceleration.applyEuler(euler);
    this.acceleration.multiplyScalar(this.noiseStrength);
  }

  borders = () => {
    if (this.position.x < 0) this.position.x = this.noiseSize;
    if (this.position.y < 0) this.position.y = this.noiseSize;
    if (this.position.z < 0) this.position.z = this.noiseSize;
    if (this.position.x > this.noiseSize) this.position.x = 0;
    if (this.position.y > this.noiseSize) this.position.y = 0;
    if (this.position.z > this.noiseSize) this.position.z = 0;
  };

  update = () => {
    this.velocity.add(this.acceleration);
    this.velocity.clampLength(0, this.speed);
    this.position.add(this.velocity);
    this.acceleration.set(0, 0, 0);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.scale();
    this.rotate();
  };

  scale = () => {
    const cent = this.noiseSize / 2;
    const center = new THREE.Vector3(cent, cent, cent);
    const distToCenter = center.distanceTo(this.position);
    const factor = 1 / map(
      distToCenter, 0, this.noiseSize, 1, 25
    );
    this.mesh.scale.set(factor, factor, factor);
  };

  rotate = () => {
    const dir = this.velocity.clone().normalize();
    const euler = new THREE.Euler(0, 0, 0);
    euler.setFromVector3(dir);
    this.mesh.setRotationFromEuler(euler);
  };
}
