function Vehicle(l, ms, mf) {
  this.r = 3.0;
  this.maxSpeed = ms;
  this.maxForce = mf;
  const initials = initializeObject(l.x, l.y);
  this.acc = initials.acc;
  this.vel = initials.vel;
  this.pos = initials.pos;
  this.prev = initials.prev;

  this.show = () => {
    const theta = this.vel.heading() + PI/2;
    fill(127, 100);
    stroke(0, 10);
    strokeWeight(1);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r*2);
    vertex(-this.r, this.r*2);
    vertex(this.r, this.r*2);
    endShape(CLOSE);
    pop();
  };

  this.drawLine = () => {
    const x = Math.abs(this.pos.x - this.prev.x);
    const y = Math.abs(this.pos.y - this.prev.y);

    if (x < 50 && y < 50) {
      strokeWeight(0.5);
      stroke(100);
      line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);
    }

    this.prev = this.pos.copy();
  };

  this.borders = () => {
    this.pos = borders({pos: this.pos, r: this.r});
  };

  this.follow = flow => {
    this.applyForce(followFlow({
      pos: this.pos,
      vel: this.vel,
      flow: flow,
      maxSpeed: this.maxSpeed,
      maxForce: this.maxForce,
    }));
  };

  this.update = () => {
    const newData = update({
      vel: this.vel,
      acc: this.acc,
      pos: this.pos,
      prev: this.prev,
      maxSpeed: this.maxSpeed,
    });
  };

  this.applyForce = force => {
    this.acc = applyForce({acc: this.acc, force});
  };

  this.run = () => {
    this.update();
    this.borders();
    //this.show();
    this.drawLine();
  };

  this.seperate = (boids) => {
    var neighborDist = 20;
    var steer = createVector(0, 0);
    var count = 0;

    for (var i in boids) {
      var d = p5.Vector.dist(this.pos, boids[i].pos);
      if (d > 0 && d < neighborDist) {
        var diff = p5.Vector.sub(this.pos, boids[i].pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.div(count);
      steer.setMag(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }

    this.applyForce(steer);
  };
}
