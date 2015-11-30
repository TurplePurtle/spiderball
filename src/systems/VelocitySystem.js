import Position from "../components/Position";
import Velocity from "../components/Velocity";

export default class VelocitySystem {
  constructor() {
  }

  run(context) {
    const dt = context.dt;
    const entities = context.entityService.getComponentMap(Velocity);
    for (let entity of entities) {
      const pos = entity.getComponent(Position);
      const v = entity.getComponent(Velocity);
      pos.x_ = pos.x;
      pos.y_ = pos.y;
      pos.x += v.x * dt;
      pos.y += v.y * dt;
    }
  }
}
