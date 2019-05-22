class Particle {
  constructor(pos) {
    this.maxSpeed = .5;
    this.maxForce = .1;
    this.acceleration = createVector();
    this.velocity = createVector();
    this.position = pos.copy();
  }

  show = () => {
    push();
    noStroke();
    translate(this.position.x, this.position.y, this.position.z);
    rotate(this.velocity.heading());
    ambientMaterial(255);
    box(.2);
    pop();
  }

  run = (size) => {
    this.followFlow();
    this.borders(size);
    this.update();
    this.show();
  }

  followFlow = () => {
    const noiseScale = 0.01;
    const p = p5.Vector.mult(this.position, noiseScale);
    const sample = noise(p.x, p.y, p.z) * PI * 2;

    const euler = createVector(sample, sample, sample);
    const acc = createVector(1, 1, 1);
    this.acceleration = rotateVector(acc, euler);
  }

  borders = () => {
    if (this.position.x < 0) this.position.x = size;
    if (this.position.y < 0) this.position.y = size;
    if (this.position.z < 0) this.position.z = size;
    if (this.position.x > size) this.position.x = 0;
    if (this.position.y > size) this.position.y = 0;
    if (this.position.z > size) this.position.z = 0;
  };

  // ----- PHYSICS -----
  update = () => {
    this.velocity.add(this.acceleration);
    this.limitVelocity();
    this.position.add(this.velocity);
    this.acceleration.setMag(0);
  }

  applyForce = force => {
    this.acceleration.add(force);
  }

  limit = (vector, maxMag) => {
    if (vector.mag() > maxMag) {
      return vector.normalize().mult(maxMag);
    }
    return vector;
  }

  limitVelocity = () => {
    if (this.maxSpeed) this.limit(this.velocity, this.maxSpeed);
    return this.velocity;
  }

  limitForce = force => {
    if (this.maxForce) this.limit(force, this.maxForce);
    return force;
  }

  steer = desired => {
    const steer = p5.Vector.sub(desired, this.velocity);
    return this.limitForce(steer);
  }
}
