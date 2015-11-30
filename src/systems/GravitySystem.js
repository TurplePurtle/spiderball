import Gravity from "../components/Gravity";
import Velocity from "../components/Velocity";

export default class GravitySystem {
  constructor() {
  }

  run(context) {
    const dt = context.dt;
    const entities = context.entityService.getComponentMap(Gravity);
    for (let i = 0, len = entities.length; i < len; i++) {
      const entity = entities[i];
      const v = entity.getComponent(Velocity);
      const g = entity.getComponent(Gravity);
      v.y += g.g * dt;
    }
  }
}
