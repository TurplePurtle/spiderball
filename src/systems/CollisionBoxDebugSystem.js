import Position from "../components/Position";
import CollisionBox from "../components/CollisionBox";

export default class CollisionBoxDebugSystem {
  constructor() {
  }

  run(context) {
    const ctx = context.canvasContext;
    const prevStyle = ctx.strokeStyle;
    ctx.strokeStyle = "#f00";
    const entities = context.entityService.getComponentMap(CollisionBox);
    for (let i = 0, len = entities.length; i < len; i++) {
      const entity = entities[i];
      const pos = entity.getComponent(Position);
      const box = entity.getComponent(CollisionBox);
      ctx.strokeRect(pos.x + box.x, pos.y + box.y, box.w, box.h);
    }
    ctx.strokeStyle = prevStyle;
  }
}
