import Vector from "./Vector";

class Fractal {
  vectors = [];

  constructor({ layers = 4, angle = Math.PI / 6, pos = new Vector(0, 0) }) {
    this.layers = layers;
    this.angle = angle;
    this.pos = pos;
  }

  construct() {
    // Reset vectors array
    this.vectors = [];

    // Fill this.vectors with layers that are filled with vectors
    for (let i = 0; i < this.layers; i++) {
      // Initial layer
      if (i === 0) {
        const v = new Vector(0, 100, this.pos);
        this.vectors.push([v]);

        continue;
      }

      const previousLayer = this.vectors[i - 1];
      this.vectors[i] = [];

      for (let j = 0; j < previousLayer.length; j++) {
        const vi = previousLayer[j];
        const magnitude = vi.magnitude() * (3 / 4);
        const pos = vi.add(vi.pos);

        const v1 = new Vector(vi.x, vi.y, pos)
          .rotate(-this.angle)
          .unit()
          .multiply(magnitude);
        const v2 = new Vector(vi.x, vi.y, pos)
          .rotate(this.angle)
          .unit()
          .multiply(magnitude);

        this.vectors[i].push(v1, v2);
      }
    }
  }

  draw() {
    this.construct();

    this.vectors.forEach((layer) => layer.forEach((vector) => vector.draw()));
  }
}

export default Fractal;
