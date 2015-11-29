import Player from "../components/Player";
import Position from "../components/Position";
import Velocity from "../components/Velocity";
import FallDeath from "../components/FallDeath";
import Spider from "../components/Spider";
import Web from "../components/Web";
import PlatformStander from "../components/PlatformStander";

export default class PlayerSpiderControlSystem {
  constructor(entityService, input) {
    this.entityService = entityService;
    this.input = input;
  }

  run(dt) {
    const player = this.entityService.getComponentMap(Player).firstEntity();
    const input = this.input;
    const pos = player.getComponent(Position);
    const vel = player.getComponent(Velocity);
    const fallDeath = player.getComponent(FallDeath);
    const spider = player.getComponent(Spider);
    const web = player.getComponent(Web);
    const grounded = player.getComponent(PlatformStander).grounded;

    const axisX = input.getAxis("x");
    const axisY = input.getAxis("y");
    const axisThresh = 0.1;

    if (spider.webbing && web.hit) {
      // swinging
      if (grounded || axisY < -axisThresh) {
        // release swing
        spider.webbing = false;
      } else {
        // swing physics
        // normalized web vector
        let dx = web.x - pos.x;
        let dy = web.y - pos.y;
        let length = Math.sqrt(dx*dx + dy*dy);
        dx = dx / length;
        dy = dy / length;
        // swing direction
        const ux = -dy;
        const uy = dx;
        // calculate speed in direction of swing
        // (add gravity before projecting!)
        const speed = ux * vel.x + uy * vel.y;
        vel.x = speed * ux;
        vel.y = speed * uy;
      }
    } else {
      // not swinging

      const accel = grounded ? 2000 : 1000;
      const drag = grounded ? 12 : 2;
      const runSpeed = axisX * 150;

      if (grounded && axisY < -axisThresh) {
        vel.y = -200;
      }

      if (axisX < -axisThresh) {
        if (vel.x > runSpeed) {
          vel.x = Math.max(vel.x - accel * dt, runSpeed);
        }
        spider.facing = -1;
      } else if (axisX > axisThresh) {
        if (vel.x < runSpeed) {
          vel.x = Math.min(vel.x + accel * dt, runSpeed);
        }
        spider.facing = 1;
      } else {
        vel.x *= Math.max(1 - drag * dt, 0);
      }
    }

    if (!spider.webbing && input.justPressed("action")) {
      // shoot web
      spider.webbing = true;
      web.t = 0;
      web.x = pos.x;
      web.y = pos.y;
      web.dx = spider.facing * Math.sqrt(0.5);
      web.dy = -Math.sqrt(0.5);
      web.hit = false;
    }

    if (pos.y > fallDeath.y) {
      fallDeath.triggered = true;
      pos.x = 50;
      pos.y = 300;
      vel.x = 0;
      vel.y = 0;
      spider.webbing = false;
    }
  }
}
