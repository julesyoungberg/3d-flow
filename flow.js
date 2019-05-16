const followFlow = ({pos, vel, flow, maxSpeed, maxForce}) => {
  const desired = flow.lookup(pos);
  desired.mult(maxSpeed);
  const steer = p5.Vector.sub(desired, vel);
  steer.limit(maxForce);
  return steer;
};

const showFlow = ({field, r}) => {
  field.forEach((col, i) => col.forEach((row, j) => {
    drawVector(row, i*r, j*r, r-2);
  }));
};

const lookup = ({field, pos, r, cols, rows}) => {
  const col = Math.round(constrain(pos.x / r, 0, cols - 1));
  const row = Math.round(constrain(pos.y / r, 0, rows - 1));
  return field[col][row].copy();
}
