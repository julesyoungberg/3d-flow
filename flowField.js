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
    this.createFlowField();
  }

  createFlowField = () => {
    const zOff = 0.0;
    const radius = this.res / 2 - this.padding - 2;
    const origin = new Babylon.Vector2(1, 0);
    const center = new Babylon.Vector2(
      (this.res - 1) / 2,
      (this.res - 1) / 2
    );

    noiseSeed(random(10000));
    let xOff = 0;

    for (var i = 0; i < this.res; i++) {
      let yOff = 0;
      this.field[i] = [];

      for (var j = 0; j < this.res; j++) {
        const current = new Babylon.Vector2(i, j);
        const d = Babylon.Vector2.Distance(center, current);

        const noiseVal = noise(xOff, yOff, this.zOff);
        const theta = map(noiseVal, 0, 1, 0, TWO_PI);
        const noiseDir = new Babylon.Vector2(
          Math.cos(theta),
          Math.sin(theta)
        );

        if (d > radius) {
          let amount = d - radius;
          if (amount > this.padding) amount = this.padding;

          const q = amount / this.padding;
          const toCenter = center.subtract(current).normalize();
          // this.field[i][j] = toCenter.scale(q).add(
          //   desired.scale(1 - q)
          // ).normalize();
          const noiseAngle = Babylon.Angle.BetweenTwoPoints(origin, noiseDir);
          const desiredAngle = Babylon.Angle.BetweenTwoPoints(origin, toCenter);
          const angle = (q * desiredAngle.radians()) + (1 - q) * noiseAngle.radians();
          this.field[i][j] = new Babylon.Vector2(
            Math.cos(angle),
            Math.sin(angle)
          );
        } else {
          this.field[i][j] = noiseDir;
        }

        yOff += 0.3;
      }

      xOff += 0.3;
    }
  };

  show = () => {
    this.field.forEach((col, i) => {
      this.lines[i] = [];
      col.forEach((item, j) => {
        const pos = this.toViewSpace(i, j);
        this.lines[i][j] = this.drawVector(item, pos);
      })
    });
  };

  drawVector = (v, pos) => {
    const vLength = this.scale / 3;
    // calculate cell corners
    const x0 = pos.x - this.scale / 2;
    const x1 = pos.x + this.scale / 2;
    const y0 = pos.y - this.scale / 2;
    const y1 = pos.y + this.scale / 2;

    const origin = new Babylon.Vector3(pos.x, pos.y, 0);

    const point = new Babylon.Vector3(
      map(v.x, -1, 1, x0, x1),
      map(v.y, -1, 1, y0, y1),
      0
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
    return this.field[col][row].clone();
  };

  toViewSpace = (x, y) => {
    return new Babylon.Vector2(
      this.mapToViewSpace(x),
      this.mapToViewSpace(y)
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
