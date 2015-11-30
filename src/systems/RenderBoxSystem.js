import Position from "../components/Position";
import RenderBox from "../components/RenderBox";

export default class RenderBoxSystem {
  constructor() {
  }

  run(context) {
    const ctx = context.canvasContext;
    const entities = context.entityService.getComponentMap(RenderBox);
    ctx.fillStyle = "#fff";
    for (let i = 0, len = entities.length; i < len; i++) {
      const entity = entities[i];
      const pos = entity.getComponent(Position);
      const box = entity.getComponent(RenderBox);
      ctx.fillRect(pos.x + box.x | 0, pos.y + box.y | 0, box.w, box.h);
    }
  }
}
