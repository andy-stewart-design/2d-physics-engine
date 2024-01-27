import canvas from "./Canvas";

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  divide(scalar) {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  unit() {
    if (this.magnitude() === 0) {
      return new Vector(0, 0);
    }

    return this.divide(this.magnitude());
  }

  normal() {
    return new Vector(-this.y, this.x);
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  draw(x, y, color = "white", factor = 1) {
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(x, canvas.toCanvasY(y));
    canvas.ctx.lineTo(
      x + this.x * factor,
      canvas.toCanvasY(y + this.y * factor)
    );
    canvas.ctx.strokeStyle = color;
    canvas.ctx.stroke();
  }
}

export default Vector;
