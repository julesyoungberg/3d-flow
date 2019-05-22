class Particle {
  constructor(pos, config={ speed: 0.5 }) {
    this.maxForce = .1;
    this.acceleration = createVector();
    this.velocity = createVector();
    this.position = pos.copy();
    this.configure(config);
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

  show = () => {
    push();
    noStroke();
    translate(this.position.x, this.position.y, this.position.z);
    rotate(this.velocity.heading());
    ambientMaterial(255);
    box(this.size);
    pop();
  }

  run = () => {
    this.followFlow();
    this.borders();
    this.update();
    this.show();
  }

  followFlow = () => {
    const p = p5.Vector.mult(this.position, this.noiseScale);
    const sample = noise(
      p.x,
      p.y,
      p.z + this.noiseOffset + frameCount * this.noiseSpeed
    ) * PI * 2;

    const euler = createVector(sample, sample, sample);
    const acc = createVector(1, 1, 1);
    this.acceleration = rotateVector(acc, euler);
    this.acceleration.mult(this.noiseStrength);
  }

  borders = () => {
    if (this.position.x < 0) this.position.x = this.noiseSize;
    if (this.position.y < 0) this.position.y = this.noiseSize;
    if (this.position.z < 0) this.position.z = this.noiseSize;
    if (this.position.x > this.noiseSize) this.position.x = 0;
    if (this.position.y > this.noiseSize) this.position.y = 0;
    if (this.position.z > this.noiseSize) this.position.z = 0;
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
    if (this.speed) this.limit(this.velocity, this.speed);
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
