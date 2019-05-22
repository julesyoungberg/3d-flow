class Boid {
  constructor(pos, ms, mf) {
    this.r = 5.0;
    this.maxSpeed = .2// ms;
    this.maxForce = .1// mf;
    this.acceleration = createVector(0, 0, 0);
    this.velocity = createVector(
      random(),
      random(),
      random()
    );
    this.position = pos.copy();
  }

  show = () => {
    push();
    noStroke();
    ambientMaterial(0);
    translate(this.position.x, this.position.y, this.position.z);
    sphere(.1);
    pop();
  }

  run = (flow, others) => {
    // this.separate(others);
    this.follow(flow);
    this.update();
    this.show();
  }

  follow = flow => {
    const d = flow.lookup(this.position);
    if (d) {
      const desired = createVector(d.x, d.y, 0);
      desired.mult(this.maxSpeed);
      this.applyForce(this.steer(desired));
    } else {
      // const direction = this.velocity.copy().normalize();
      // const toCenter = p5.Vector.sub(flow.center, this.position).normalize();
      // const reflectionFactor = 2 * direction.dot(toCenter);
      // const reflection = p5.Vector.sub(direction, toCenter.mult(reflectionFactor));
      // const desired = p5.Vector.add(reflection.mult(0.5), toCenter.mult(0.5));
      // this.applyForce(this.steer(desired));
      this.applyForce(this.seek(flow.center));
    }
  }

  // PHYSICS FUNCTIONS
  update = () => {
    this.velocity.add(this.acceleration);
    this.limitVelocity();
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  applyForce = force => {
    this.acceleration.add(force);
  }

  distance = other => {
    return p5.Vector.sub(this.position, other.position);
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

  // BOID STEERING BEHAVIOURS
  steer = desired => {
    const steer = p5.Vector.sub(desired, this.velocity);
    return this.limitForce(steer);
  }

  seek = target => {
    const desired = p5.Vector.sub(target, this.position);
    desired.normalize().mult(this.maxSpeed * .2);

    return this.steer(desired);
  }

  separate = (others, callback) => {
    const sum = createVector(0, 0, 0);
    let count = 0;

    others.forEach(other => {
      const d = this.distance(other);

      if (d > 0 && d < 10) {
        const diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        sum.add(diff);
        count++;
      }

      if (callback) callback(d, other);
    })

    if (count > 0) {
      sum.normalize().mult(this.maxSpeed);
      this.applyForce(this.steer(sum));
    }
  }

  borders = () => {
    if (this.position.x < -this.r) this.position.x = width + this.r
    if (this.position.y < -this.r) this.position.y = height + this.r
    if (this.position.x > width + this.r) this.position.x = -this.r
    if (this.position.y > height + this.r) this.position.y = -this.r
  }
}
