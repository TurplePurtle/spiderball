import Position from "../components/Position";
import Velocity from "../components/Velocity";
import Spider from "../components/Spider";
import Web from "../components/Web";
import Platform from "../components/Platform";
import CollisionBox from "../components/CollisionBox";

export default class SpiderWebSystem {
  constructor() {
  }

  run(context) {
    const dt = context.dt;
    const entities = context.entityService.getComponentMap(Web);
    for (let entity of entities) {
      const spider = entity.getComponent(Spider);
      const pos = entity.getComponent(Position);
      if (spider.webbing) {
        const web = entity.getComponent(Web);
        const vel = entity.getComponent(Velocity);

        if (web.hit) {
          // swing physics

          // normalized web vector
          const dx = pos.x - web.x;
          const dy = pos.y - web.y;
          const length = web.hitLength;
          // swing direction
          const ux = -dy / length;
          const uy = dx / length;
          // calculate speed in direction of swing
          const speed = ux * vel.x + uy * vel.y;

          // constrain web length
          const delta = speed * dt;
          const freeX = dx + ux * delta;
          const freeY = dy + uy * delta;
          const ratio = length / Math.sqrt(freeX*freeX + freeY*freeY);
          const newX = web.x + freeX * ratio;
          const newY = web.y + freeY * ratio;

          vel.x = (newX - pos.x) / dt;
          vel.y = (newY - pos.y) / dt;
        } else if (web.t > web.ttl) {
          spider.webbing = false;
        } else {
          web.x += web.dx * web.rate * dt;
          web.y += web.dy * web.rate * dt;
          web.t += dt;

          const platforms = context.entityService.getComponentMap(Platform);
          for (let p of platforms) {
            const pPos = p.getComponent(Position);
            const box = p.getComponent(CollisionBox);
            if (
              web.x > pPos.x + box.x &&
              web.x < pPos.x + box.x + box.w &&
              web.y > pPos.y + box.y &&
              web.y < pPos.y + box.y + box.h
            ) {
              const dx = pos.x - web.x;
              const dy = pos.y - web.y;
              web.hitLength = Math.sqrt(dx*dx + dy*dy);
              web.hit = true;
              break;
            }
          }
        }
      }
    }
  }
}
