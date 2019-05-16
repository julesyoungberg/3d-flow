const seek = ({target, pos, maxSpeed, maxForce, vel}) => {
  const desired = getDesired({target, pos, maxSpeed});
  return steer({desired, vel, maxForce});
};

const pursue = ({targetPos, targetVel, vel, pos, maxSpeed, maxForce}) => {
  const next = p5.Vector.add(targetPos, targetVel);
  const desired = getDesired({target: next, pos, maxSpeed: maxSpeed - 2});
  return steer({desired, vel, maxForce: maxForce - 2});
};

const arrive = ({target, pos, maxSpeed, maxForce, vel, r=100}) => {
  const desired = getDesired({target, pos});
  const d = desired.mag();

  if (d < r) {
    desired.setMag(map(d, 0, r, 0, maxSpeed));
  } else {
    desired.setMag(maxSpeed);
  }

  return steer({desired, vel, maxForce});
};

const flee = ({target, pos, maxSpeed, maxForce, vel, r=50}) => {
  const desired = getDesired({target, pos});
  const d = desired.mag();

  if (d >= r) return createVector();

  desired.setMag(maxSpeed);
  desired.mult(-1);

  return steer({desired, vel, maxForce});
};

const show = ({vel, pos, r}) => {
  const theta = vel.heading() + PI/2;
  fill(127);
  stroke(0);
  strokeWeight(1);
  push();
  translate(pos.x, pos.y);
  rotate(theta);
  beginShape();
  vertex(0, -r*2);
  vertex(-r, r*2);
  vertex(r, r*2);
  endShape(CLOSE);
  pop();
};
