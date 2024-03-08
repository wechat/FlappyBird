import { _decorator, Component, Node, Vec3 } from "cc";
import { BirdCtrl } from "./BirdCtrl";
const { ccclass, property } = _decorator;

@ccclass("GroundCtrl")
export class GroundCtrl extends Component {
  private isStartMove: boolean = false;

  setEnableMove(isMove: boolean) {
    this.isStartMove = isMove;
  }

  onUpdate(deltaTime: number) {
    if (!this.isStartMove) return;
    let x = this.node.position.x - 2;
    if (x < -750) {
      x = x + 750;
    }
    this.node.position = new Vec3(
      x,
      this.node.position.y,
      this.node.position.z
    );
  }

  /**
   * 鸟是否掉在地面上
   * @param birdCtrl 鸟
   * @returns
   */
  checkCollisionToGround(birdCtrl: BirdCtrl): boolean {
    if (birdCtrl.getPositionY() < this.node.position.y) {
      birdCtrl.setBirdToGround(this.node.position.y);
      return true;
    }
    return false;
  }
}
