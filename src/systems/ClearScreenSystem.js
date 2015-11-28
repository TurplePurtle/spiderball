export default class ClearScreenSystem {
  constructor(context) {
    this.context = context;
  }

  run() {
    const ctx = this.context;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
