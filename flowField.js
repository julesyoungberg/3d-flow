class FlowField {
  constructor(babylon, res, size) {
    this.babylon = babylon;
    this.field = [];
    this.lines = [];
    this.res = res;
    this.size = size;
    this.scale = size / res;
    this.halfScale = this.scale / 2;
    this.padding = 5;
    const centerNum = (this.res - 1) / 2;
    this.center = new Babylon.Vector3(
      centerNum, centerNum, centerNum
    );
    this.createFlowField();
  }

  createFlowField = () => {
    const radius = this.res / 2 - this.padding - 2;

    // TODO: create 3 different objects of noise offsets
    // 1 for each axis of rotation
    // initialize them differently and increment them differently
    noiseSeed(random(10000));
    const initials = {
      xAxis: { xOff: random(), yOff: random(), zOff: random() },
      yAxis: { xOff: random(), yOff: random(), zOff: random() },
      zAxis: { xOff: random(), yOff: random(), zOff: random() },
    };
    const offsets = Object.assign({}, initials);
    const increments = {
      xAxis: random(0.001, 0.1),
      yAxis: random(0.001, 0.1),
      zAxis: random(0.001, 0.1),
    };
    const axis = Object.keys(offsets);

    for (let k = 0; k < this.res; k++) {
      axis.forEach(a => offsets[a].xOff = initials[a].xOff);
      this.field[k] = [];

      for (var i = 0; i < this.res; i++) {
        axis.forEach(a => offsets[a].yOff = initials[a].yOff);
        this.field[k][i] = [];

        for (var j = 0; j < this.res; j++) {
          const current = new Babylon.Vector3(i, j, k);
          const d = Babylon.Vector3.Distance(this.center, current);

          if (d <= radius) {
            const values = [];
            axis.forEach(a => {
              const o = offsets[a];
              const noiseVal = noise(o.xOff, o.yOff, o.zOff);
              const val = map(noiseVal, 0, 1, -1, 1);
              values.push(val);
            });
            const noiseDir = new Babylon.Vector3(
              values[0],
              values[1],
              values[2]
            ).normalize();
            this.field[k][i][j] = noiseDir;
          }

          // --------------- 2D LOGIC -------------------
          // const current = new Babylon.Vector2(i, j);
          // const d = Babylon.Vector2.Distance(this.center, current);
          //
          // const noiseVal = noise(xOff, yOff, this.zOff);
          // const theta = map(noiseVal, 0, 1, 0, TWO_PI);
          // const noiseDir = new Babylon.Vector2(
          //   Math.cos(theta),
          //   Math.sin(theta)
          // );
          //
          // if (d > radius) {
          //   // let amount = d - radius;
          //   // if (amount > this.padding) amount = this.padding;
          //   //
          //   // const q = amount / this.padding;
          //   // const toCenter = this.center.subtract(current).normalize();
          //   // const toCenterAngle = Math.atan2(toCenter.y, toCenter.x);
          //   // const newAngle = toCenterAngle - PI / 2.5;
          //   // const newDir = new Babylon.Vector2(
          //   //   Math.cos(newAngle),
          //   //   Math.sin(newAngle)
          //   // );
          //   // this.field[i][j] = newDir;
          // } else {
          //   this.field[i][j] = noiseDir;
          // }

          axis.forEach(a => offsets[a].yOff += increments[a]);
        }

        axis.forEach(a => offsets[a].xOff += increments[a]);
      }

      axis.forEach(a => offsets[a].zOff += increments[a]);
    }
  };

  show = () => {
    this.field.forEach((layer, k) => {
      this.lines[k] = [];
      layer.forEach((col, i) => {
        this.lines[k][i] = [];
        col.forEach((item, j) => {
          const pos = this.toViewSpace(i, j, k);
          this.lines[k][i][j] = this.drawVector(item, pos);
        })
      });
    });
  };

  drawVector = (v, pos) => {
    const vLength = this.scale / 3;
    // calculate cell corners
    const x0 = pos.x - this.halfScale;
    const x1 = pos.x + this.halfScale;
    const y0 = pos.y - this.halfScale;
    const y1 = pos.y + this.halfScale;
    const z0 = pos.z - this.halfScale;
    const z1 = pos.z + this.halfScale;

    const origin = pos;

    const point = new Babylon.Vector3(
      map(v.x, -1, 1, x0, x1),
      map(v.y, -1, 1, y0, y1),
      map(v.z, -1, 1, z0, z1)
    );

    const points = [ origin, point ];

    const colors = [
      new Babylon.Color4(0, 0, 0, 1),
      new Babylon.Color4(1, 0, 0, 1)
    ];

    const line = Babylon.MeshBuilder.CreateLines(
      `flowFieldVector`,
      { points, colors },
      this.babylon.scene
    );

    this.babylon.addShadowCaster(line);

    return line;
  };

  lookup = (v) => {
    const col = Math.round(constrain(v.x, 0, this.res - 1));
    const row = Math.round(constrain(v.y, 0, this.res - 1));
    const lay = Math.round(constrain(v.z, 0, this.res - 1));
    if (col < 0 || col >= this.res) return null;
    if (row < 0 || row >= this.res) return null;
    if (lay < 0 || lay >= this.res) return null;
    return this.field[lay][col][row];
  };

  toViewSpace = (x, y, z) => {
    return new Babylon.Vector3(
      this.mapToViewSpace(x),
      this.mapToViewSpace(y),
      this.mapToViewSpace(z)
    );
  };

  mapToViewSpace = n => {
    return map(n, 0, this.res - 1, - this.size / 2, this.size / 2);
  };

  deleteLines = () => {
    this.lines.forEach(col => col.forEach(item => item.dispose()));
    this.lines = [];
  };
}
