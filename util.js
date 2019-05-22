// Rotation functions derived from rotation matrix multiplication
// https://stackoverflow.com/questions/14607640/rotating-a-vector-in-3d-space

const rotateX = (v, theta) => createVector(
  v.x,
  v.y * Math.cos(theta) - v.z * Math.sin(theta),
  v.y * Math.sin(theta) + v.z * Math.cos(theta)
);

const rotateY = (v, theta) => createVector(
  v.x * Math.cos(theta) + v.z * Math.sin(theta),
  v.y,
  v.z * Math.cos(theta) - v.x * Math.sin(theta)
);

const rotateZ = (v, theta) => createVector(
  v.x * Math.cos(theta) - v.y * Math.sin(theta),
  v.x * Math.sin(theta) + v.y * Math.cos(theta),
  v.z
);

const rotateVector = (v, r) => rotateZ(rotateY(rotateX(v, r.x), r.y), r.z);
