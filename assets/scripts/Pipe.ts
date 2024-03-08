import {
  _decorator,
  Component,
  Intersection2D,
  Rect,
  UITransform,
  Sprite,
} from "cc";
import { BirdCtrl } from "./BirdCtrl";
const { ccclass, property } = _decorator;

@ccclass("Pipe")
export class Pipe extends Component {
  @property({
    type: Sprite,
    displayName: "上方管道",
  })
  private upPipe: Sprite = null!;

  @property({
    type: Sprite,
    displayName: "下方管道",
  })
  private downPipe: Sprite = null!;

  start() {}

  update(deltaTime: number) {}

  // 鸟是否碰到管道
  checkBirdCollision(birdCtrl: BirdCtrl) {
    // 把鸟的坐标系转到到管道里面
    const birdPositionInPipe = this.node
      .getComponent(UITransform)
      .convertToNodeSpaceAR(birdCtrl.node.worldPosition);
    const birdRect = new Rect(
      birdPositionInPipe.x - 34,
      birdPositionInPipe.y - 24,
      68,
      48
    );

    // 如果上边碰撞
    if (Intersection2D.rectRect(birdRect, new Rect(-26, 100, 52, 1024))) {
      return true;
    }
    // 如果下边碰撞
    if (
      Intersection2D.rectRect(birdRect, new Rect(-26, -100 - 1024, 52, 1024))
    ) {
      return true;
    }
    return false;
  }
}
