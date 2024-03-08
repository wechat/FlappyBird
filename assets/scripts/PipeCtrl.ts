import { _decorator, Component, instantiate, Prefab, Vec3 } from "cc";
import { Pipe } from "./Pipe";
import { BirdCtrl } from "./BirdCtrl";
import EventMgr from "./manager/EventMgr";
const { ccclass, property } = _decorator;

const PIPE_WIDTH = 52;
const BIRD_WIDTH = 68;

@ccclass("PipeCtrl")
export class PipeCtrl extends Component {
  @property({ type: Prefab, displayName: "管道预制体" })
  private pipePrefab: Prefab = null!;
  private isStartMove: boolean = false;
  private _pipes: Pipe[] = [];
  // 管道的开始位置
  private startX: number = 500;
  // 管道的间隔
  private paddingX: number = 300;
  // 管道生成个数
  private pipeNum: number = 4;
  // 管道上下间距
  private pipeRandomRange: number = 300;
  // 管道第一次通过的位置
  private passPositionX: number = 0;

  startGame() {
    this.isStartMove = true;

    if (this._pipes.length === 0) {
      for (let i = 0; i < this.pipeNum; i++) {
        // 初始化创建管道及设置位置
        const pipeNode = instantiate(this.pipePrefab);
        pipeNode.position = new Vec3(
          this.startX + i * this.paddingX,
          this.randomY(),
          0
        );
        this.node.addChild(pipeNode);
        const pipe = pipeNode.getComponent(Pipe);
        this._pipes.push(pipe);
      }
    } else {
      // 容器重置
      this.resetPosition();
    }

    // 计算第一次通过管道的位置
    this.passPositionX = -this.startX - (PIPE_WIDTH + BIRD_WIDTH) / 2;
  }

  setEnableMove(isMove: boolean) {
    this.isStartMove = isMove;
  }

  // 重置管道
  resetPosition() {
    this.node.position = new Vec3(0, 0, 0);
    for (let i = 0; i < this._pipes.length; i++) {
      this._pipes[i].node.position = new Vec3(
        this.startX + i * this.paddingX,
        this.randomY(),
        0
      );
    }
  }

  onUpdate(deltaTime: number) {
    if (!this.isStartMove) return;
    let newX = this.node.position.x - 2;

    this.node.position = new Vec3(
      newX,
      this.node.position.y,
      this.node.position.z
    );

    if (newX < this.passPositionX) {
      this.passPositionX = this.passPositionX - this.paddingX;
      EventMgr.emit("ADD_SCORE_EVENT");
    }

    // 管道位置超出了屏幕左侧
    if (this._pipes[0] && newX + this._pipes[0].node.position.x < -375 - 26) {
      this._pipes[0].node.position = new Vec3(
        this._pipes[this.pipeNum - 1].node.position.x + this.paddingX,
        this.randomY(),
        0
      );
      this._pipes.push(this._pipes[0]);
      this._pipes.splice(0, 1);
    }
  }

  // 随机Y坐标
  randomY() {
    return this.pipeRandomRange * (Math.random() * 2 - 1);
  }

  // 检测每个管道是否碰撞
  checkBirdCollisionToPipe(birdCtrl: BirdCtrl) {
    for (let i = 0; i < this._pipes.length; i++) {
      const pipe = this._pipes[i];
      if (pipe.checkBirdCollision(birdCtrl)) {
        return true;
      }
    }
    return false;
  }
}
