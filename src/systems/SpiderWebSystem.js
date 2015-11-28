import Position from "../components/Position";
import Spider from "../components/Spider";
import Web from "../components/Web";
import Platform from "../components/Platform";
import CollisionBox from "../components/CollisionBox";

export default class SpiderWebSystem {
  constructor(entityService, context) {
    this.entityService = entityService;
    this.context = context;
  }

  run(dt) {
    const entities = this.entityService.getComponentMap(Web);
    for (let entity of entities) {
      const spider = entity.getComponent(Spider);
      const pos = entity.getComponent(Position);
      if (spider.webbing) {
        const web = entity.getComponent(Web);

        if (web.hit) {
          // could be effects or whatever
        } else if (web.t > web.ttl) {
          spider.webbing = false;
        } else {
          web.x += web.dx * web.rate * dt;
          web.y += web.dy * web.rate * dt;
          web.t += dt;

          const platforms = this.entityService.getComponentMap(Platform);
          for (let p of platforms) {
            const pos = p.getComponent(Position);
            const box = p.getComponent(CollisionBox);
            if (
              web.x > pos.x + box.x &&
              web.x < pos.x + box.x + box.w &&
              web.y > pos.y + box.y &&
              web.y < pos.y + box.y + box.h
            ) {
              web.hit = true;
            }
          }
        }

        const ctx = this.context;
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(web.x, web.y);
        ctx.stroke();
      }
    }
  }
}
