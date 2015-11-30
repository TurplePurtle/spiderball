export default class ClearScreenSystem {
  constructor() {
  }

  run(context) {
    const ctx = context.canvasContext;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
