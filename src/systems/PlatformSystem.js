import Position from "../components/Position";
import Velocity from "../components/Velocity";
import CollisionBox from "../components/CollisionBox";
import Platform from "../components/Platform";
import PlatformStander from "../components/PlatformStander";

export default class PlatformSystem {
  constructor() {
  }

  run(context) {
    const platformEntities = context.entityService.getComponentMap(Platform);
    const standerEntities = context.entityService.getComponentMap(PlatformStander);
    for (let standerEnt of standerEntities) {
      const box = standerEnt.getComponent(CollisionBox);
      const pos = standerEnt.getComponent(Position);
      const vel = standerEnt.getComponent(Velocity);
      const stand = standerEnt.getComponent(PlatformStander);
      let grounded = false;
      for (let platformEnt of platformEntities) {
        const pBox = platformEnt.getComponent(CollisionBox);
        const pPos = platformEnt.getComponent(Position);
        const pVel = platformEnt.getComponent(Velocity);

        if (
          pos.x + box.x + box.w > pPos.x + pBox.x &&
          pos.x + box.x < pPos.x + pBox.x + pBox.w &&
          pos.y + box.y + box.h > pPos.y + pBox.y &&
          pos.y + box.y < pPos.y + pBox.y + pBox.h &&
          pos.y_ + box.y + box.h <= pPos.y + pBox.y
        ) {
          grounded = true;
          pos.y = pPos.y + pBox.y - box.y - box.h;
          vel.y = 0;
          if (pVel) vel.x += pVel.x;
        }
      }
      stand.grounded = grounded;
    }
  }
}
