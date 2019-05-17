class Vehicle {
  constructor(l, ms, mf) {
    this.r = 3.0
    this.maxSpeed = ms
    this.maxForce = mf
    this.acceleration = createVector()
    this.velocity = createRandomVector()
    this.position = createVector(x, y, z)
    this.previousPos = this.position.copy()
  }

  show = () => {
    const theta = this.velocity.heading() + PI/2
    fill(127)
    stroke(0)
    strokeWeight(1)
    push()
    translate(this.position.x, this.position.y)
    rotate(theta)
    beginShape()
    vertex(0, -this.r*2)
    vertex(-this.r, this.r*2)
    vertex(this.r, this.r*2)
    endShape(CLOSE)
    pop()
  }

  drawLine = () => {
    const diff = p5.Vector.sub(this.position, this.previousPos)

    if (diff.x < 50 && diff.y < 50) {
      strokeWeight(0.5);
      stroke(100);
      line(
        this.previousPos.x, this.previousPos.y,
        this.position.x, this.position.y
      );
    }

    this.previousPos = this.position.copy();
  }

  run = () => {
    this.update();
    this.borders();
    //this.show();
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

  separate = (others, callback) => {
    const sum = createVector()
    let count = 0

    others.forEach(other => {
      const d = this.distance(other)

      if (d > 0 && d < this.sepDist) {
        const diff = p5.Vector.sub(this.position, other.position)
        diff.normalize()
        sum.add(diff)
        count++
      }

      if (callback) callback(d, other)
    })

    if (count > 0) {
      sum.div(count).setMag(this.maxSpeed)
      return this.steer(sum)
    } else {
      return sum
    }
  }

  borders = () => {
    if (this.position.x < -this.r) this.position.x = width + this.r
    if (this.position.y < -this.r) this.position.y = height + this.r
    if (this.position.x > width + this.r) this.position.x = -this.r
    if (this.position.y > height + this.r) this.position.y = -this.r
  }
}
