const update = ({vel, acc, pos, prev, maxSpeed}) => {
  vel.add(acc);
  if (maxSpeed) vel.limit(maxSpeed);
  if (prev) prev = pos.copy();
  pos.add(vel);
  acc.mult(0);
  return {vel, acc, pos, prev};
};

const applyForce = ({acc, force}) => acc.add(force);

const initializeObject = (x, y, z) => ({
  acc: createVector(0, 0),
  vel: createVector(random(-1, 1), random(-1, 1), z ? random(-1, 1) : undefined),
  pos: createVector(x, y, z),
  prev: createVector(x, y, z)
});

const steer = ({desired, vel, maxForce}) => {
  const s = p5.Vector.sub(desired, vel);
  if (maxForce) s.limit(maxForce);
  return s;
};

const getDesired = ({target, pos, maxSpeed}) => {
  const desired = p5.Vector.sub(target, pos);
  if (maxSpeed) desired.setMag(maxSpeed);
  return desired;
}
