import Position from "../components/Position";
import CollisionBox from "../components/CollisionBox";

export default class CollisionBoxDebugSystem {
  constructor(entityService, context) {
    this.entityService = entityService;
    this.context = context;
  }

  run(dt) {
    const ctx = this.context;
    const prevStyle = ctx.strokeStyle;
    ctx.strokeStyle = "#f00";
    const entities = this.entityService.getComponentMap(CollisionBox);
    for (let entity of entities) {
      const pos = entity.getComponent(Position);
      const box = entity.getComponent(CollisionBox);
      ctx.strokeRect(pos.x + box.x, pos.y + box.y, box.w, box.h);
    }
    ctx.strokeStyle = prevStyle;
  }
}
