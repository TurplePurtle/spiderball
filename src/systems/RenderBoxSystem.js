import Position from "../components/Position";
import RenderBox from "../components/RenderBox";

export default class RenderBoxSystem {
  constructor(entityService, context) {
    this.entityService = entityService;
    this.context = context;
  }

  run() {
    const ctx = this.context;
    const entities = this.entityService.getComponentMap(RenderBox);
    ctx.fillStyle = "#fff";
    for (let entity of entities) {
      const pos = entity.getComponent(Position);
      const box = entity.getComponent(RenderBox);
      ctx.fillRect(pos.x + box.x | 0, pos.y + box.y | 0, box.w, box.h);
    }
  }
}
