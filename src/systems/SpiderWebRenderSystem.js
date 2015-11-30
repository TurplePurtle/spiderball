import Position from "../components/Position";
import Spider from "../components/Spider";
import Web from "../components/Web";

export default class SpiderWebSystem {
  constructor() {
  }

  run(context) {
    const ctx = context.canvasContext;
    const entities = context.entityService.getComponentMap(Web);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    for (let i = 0, len = entities.length; i < len; i++) {
      const entity = entities[i];
      const spider = entity.getComponent(Spider);
      const pos = entity.getComponent(Position);
      if (spider.webbing) {
        const web = entity.getComponent(Web);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(web.x, web.y);
        ctx.stroke();
      }
    }
  }
}
