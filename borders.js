const borders = ({pos, r=0}) => {
  if (pos.x < -r) pos.x = width + r;
  if (pos.y < -r) pos.y = height + r;
  if (pos.x > width + r) pos.x = -r;
  if (pos.y > height + r) pos.y = -r;
  return pos;
};
