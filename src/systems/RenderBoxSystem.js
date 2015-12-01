import Position from "../components/Position";
import RenderBox from "../components/RenderBox";

export default class RenderBoxSystem {
  constructor() {
  }

  run(context) {
    const ctx = context.canvasContext;
    const entities = context.entityService.getComponentMap(RenderBox);
    for (let i = 0, len = entities.length; i < len; i++) {
      const entity = entities[i];
      const pos = entity.getComponent(Position);
      const box = entity.getComponent(RenderBox);
      ctx.save();
      ctx.fillStyle = box.fillStyle || "#fff";
      const x = pos.x + box.x | 0;
      const y = pos.y + box.y | 0;
      ctx.translate(x, y);
      ctx.fillRect(0, 0, box.w, box.h);
      ctx.restore();
    }
  }
}
