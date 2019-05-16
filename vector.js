const drawVector = (v, x, y, scayl) => {
  push();
  const arrowsize = 4;
  // Translate to position to render vector
  translate(x,y);
  stroke(0,100);
  // Call vector heading function to get direction (note that pointing to the right is a heading of 0) and rotate
  rotate(v.heading());
  // Calculate length of vector & scale it to be bigger or smaller if necessary
  const len = v.mag()*scayl;
  // Draw three lines to make an arrow (draw pointing up since we've rotate to the proper direction)
  line(0,0,len,0);
  //line(len,0,len-arrowsize,+arrowsize/2);
  //line(len,0,len-arrowsize,-arrowsize/2);
  pop();
};
