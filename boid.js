class Boid {
  constructor(pos, ms, mf) {
    this.r = 2.0
    this.maxSpeed = ms
    this.maxForce = mf
    this.acceleration = createVector()
    this.velocity = p5.Vector.random2D()
    this.position = pos.copy()
    this.previousPos = this.position.copy()
  }

  show = () => {
    const theta = this.velocity.heading() + PI/2
    const viewPosition = toViewSpace(this.position)
    fill(127)
    noStroke()
    push()
    translate(viewPosition.x, viewPosition.y)
    rotate(theta)
    sphere(this.r)
    pop()
  }

  drawLine = () => {
    const diff = p5.Vector.sub(this.position, this.previousPos)
    this.previousPos = this.position.copy();
  }

  run = () => {
    this.update();
    this.borders();
    this.show();
    this.drawLine();
  }

  follow = flow => {
    const desired = flow.lookup(this.position)
    desired.mult(this.maxSpeed)
    this.applyForce(this.steer(desired))
  }

  // PHYSICS FUNCTIONS
  update = () => {
    this.velocity.add(this.acceleration)
    this.limitVelocity()
    this.prevPosition = this.position.copy()
    this.position.add(this.velocity)
    this.acceleration.mult(0)
  }

  applyForce = force => {
    this.acceleration.add(force)
  }

  distance = other => {
    return p5.Vector.dist(this.position, other.position)
  }

  limitVelocity = () => {
    if (this.maxSpeed) this.velocity.limit(this.maxSpeed)
    return this.velocity
  }

  limitForce = force => {
    if (this.maxForce) force.limit(this.maxForce)
    return force
  }

  // BOID STEERING BEHAVIOURS
  steer = desired => {
    const steer = p5.Vector.sub(desired, this.velocity)
    return this.limitForce(steer)
  }

  seek = target => {
    const desired = p5.Vector.sub(target, this.position)
    desired.setMag(this.maxSpeed)

    return this.steer(desired)
  }

  separate = (others, callback) => {
    const sum = createVector()
    let count = 0

    others.forEach(other => {
      const d = this.distance(other)

      if (d > 0 && d < 10) {
        const diff = p5.Vector.sub(this.position, other.position)
        diff.normalize()
        sum.add(diff)
        count++
      }

      if (callback) callback(d, other)
    })

    if (count > 0) {
      sum.div(count).setMag(this.maxSpeed)
      this.applyForce(this.steer(sum))
    }
  }

  borders = () => {
    if (this.position.x < -this.r) this.position.x = width + this.r
    if (this.position.y < -this.r) this.position.y = height + this.r
    if (this.position.x > width + this.r) this.position.x = -this.r
    if (this.position.y > height + this.r) this.position.y = -this.r
  }
}
