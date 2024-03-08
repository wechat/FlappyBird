import { _decorator, Component, Node, UITransform, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BirdCtrl")
export class BirdCtrl extends Component {
  // 重力加速度
  private gravity: number = -9.8 * 80;
  // 鸟在竖着方向上的速度
  private _vy: number = 0;
  // 是否开始游戏
  private isStartMove: boolean = false;

  private get vy(): number {
    return this._vy;
  }

  private setVy(vy: number) {
    this._vy = vy;
    if (vy === 0) {
      this.node.angle = 0;
    } else {
      if (vy > 0) {
        this.node.angle = 10 * (Math.min(vy, 400) / 400);
      } else {
        this.node.angle = -30 * (Math.min(-vy, 400) / 400);
      }
    }
  }

  setEnableMove(isMove: boolean) {
    this.isStartMove = isMove;
  }

  onUpdate(deltaTime: number) {
    if (!this.isStartMove) return;
    // 计算新的速度
    this.setVy(this.vy + this.gravity * deltaTime);
    // 计算新的 y 方向位置
    const y = this.node.position.y + this.vy * deltaTime;

    this.node.position = new Vec3(
      this.node.position.x,
      y,
      this.node.position.z
    );
  }

  getPositionY(): number {
    return (
      this.node.position.y -
      this.node.getComponent(UITransform).contentSize.height / 2
    );
  }

  setBirdToGround(y: number) {
    this.node.position = new Vec3(
      this.node.position.x,
      y + this.node.getComponent(UITransform).contentSize.height / 2,
      this.node.position.z
    );
  }

  resetPosition() {
    this.setVy(0);
    this.node.position = new Vec3(
      this.node.position.x,
      90,
      this.node.position.z
    );
  }

  /**
   * 鸟跳跃
   */
  jump() {
    this.setVy(400);
  }
}
