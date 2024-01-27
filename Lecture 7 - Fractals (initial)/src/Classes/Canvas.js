class Canvas {
  constructor() {
    this.element = document.getElementById("canvas");
    this.ctx = this.element.getContext("2d");

    // Set Dimensions
    const dpr = 2;
    this.element.width = document.body.offsetWidth * dpr;
    this.element.height = document.body.offsetHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  toCanvasY(y) {
    return this.element.clientHeight - y;
  }

  clear() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(
      0,
      0,
      this.element.clientWidth,
      this.element.clientHeight
    );
  }
}

const canvas = new Canvas();

export default canvas;
