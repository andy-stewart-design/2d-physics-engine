class Canvas {
  constructor() {
    this.element = document.getElementById("canvas");
    this.ctx = this.element.getContext("2d");

    // Set Dimensions
    this.element.width = window.innerWidth - 2 * 50;
    this.element.height = window.innerHeight - 2 * 50;
  }

  toCanvasY(y) {
    return this.element.clientHeight - y;
  }

  clear() {
    this.ctx.clearRect(
      0,
      0,
      this.element.clientWidth,
      this.element.clientHeight
    );
  }
}

const canvas = new Canvas();

export default canvas;
