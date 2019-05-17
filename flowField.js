class FlowField {
  constructor(r) {
    this.field = []
    this.r = r
    this.rows = height / r;
    this.cols = width / r;
    this.zoff = 0.0;
    this.radius = 10;
    this.border = 5;
    this.center = createVector(this.cols/2, this.rows/2);

    noiseSeed(random(10000));
    let xoff = 0;

    for (var i = 0; i < this.cols; i++) {
      let yoff = 0;
      this.field[i] = [];
      for (var j = 0; j < this.rows; j++) {
        const current = createVector(i, j);
        const d = this.center.dist(current);
        const theta = map(noise(xoff,yoff,this.zoff),0,1,0,TWO_PI);
        const angle = p5.Vector.fromAngle(theta);

        if (d > this.radius) {
          let amount = d - this.radius;
          if (amount > 5) amount = 5;
          const q = amount / 5;
          const toCenter = p5.Vector.sub(this.center, current).setMag(1);
          this.field[i][j] = p5.Vector.add(toCenter.mult(q), angle.mult(1 - q));
        } else {
          this.field[i][j] = angle;
        }
        yoff += 0.1;
      }
      xoff += 0.1;
    }
  }

  show = () => {
    this.field.forEach((col, i) => col.forEach((row, j) => {
      this.drawVector(row, i*this.r, j*this.r, this.r-2);
    }));
  }

  drawVector = (v, x, y, scayl) => {
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
  }

  lookup = (v) => {
    const col = Math.round(constrain(v.x / this.r, 0, this.cols-1));
    const row = Math.round(constrain(v.y / this.r, 0, this.rows-1));
    return this.field[col][row].copy();
  }

  update = () => {
    let xoff = 0;
    for (var i = 0; i < this.cols; i++) {
      let yoff = 0;
      for (var j = 0; j < this.rows; j++) {
        const current = createVector(i, j);
        const d = this.center.dist(current);
        const theta = map(noise(xoff,yoff,this.zoff),0,1,0,TWO_PI);
        const angle = p5.Vector.fromAngle(theta);

        if (d > this.radius) {
          let amount = d - this.radius;
          if (amount > 5) amount = 5;
          const q = amount / 5;
          const toCenter = p5.Vector.sub(this.center, current).setMag(1);
          this.field[i][j] = p5.Vector.add(toCenter.mult(q), angle.mult(1 - q));
        } else {
          this.field[i][j] = angle;
        }
        yoff += 0.2;
      }
      xoff += 0.2;
    }
    // Animate by changing 3rd dimension of noise every frame
    this.zoff += 0.05;
  }
}
