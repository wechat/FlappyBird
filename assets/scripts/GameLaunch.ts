import { _decorator, Component, Input, Label, Node } from "cc";
import { GroundCtrl } from "./GroundCtrl";
import { BirdCtrl } from "./BirdCtrl";
import { EndUI } from "./EndUI";
import { UIMgr } from "./manager/UIMgr";
import { PipeCtrl } from "./PipeCtrl";
import EventMgr from "./manager/EventMgr";
import DataMgr from "./manager/DataMgr";
import { AudioMgr } from "./manager/AudioMgr";
const { ccclass, property } = _decorator;

enum EGameOverType {
  // 调到地面
  FailToGround,
  // 碰到管道
  CollisionToPipe,
}

@ccclass("Main")
export class Main extends Component {
  @property({ type: Node, displayName: "开始控制器" })
  private startScreen: Node = null!;
  @property({ type: Label, displayName: "分数" })
  private scoreLabel: Label = null!;
  @property({ type: GroundCtrl, displayName: "地面控制器" })
  private groundCtrl: GroundCtrl = null!;
  @property({ type: BirdCtrl, displayName: "鸟控制器" })
  private birdCtrl: BirdCtrl = null!;
  @property({ type: PipeCtrl, displayName: "管道控制器制器" })
  private pipeCtrl: PipeCtrl = null!;
  // 游戏是否结束
  private gameOver: boolean = false;

  start() {
    this.node.on(Input.EventType.TOUCH_START, (e) => {
      if (this.gameOver) return;
      this.onTouchStart(e);
    });
  }

  update(deltaTime: number) {
    this.birdCtrl?.onUpdate(deltaTime);
    this.groundCtrl?.onUpdate(deltaTime);
    this.pipeCtrl?.onUpdate(deltaTime);

    // 游戏是否结束
    if (this.gameOver) return;
    // 如果有鸟碰到地面，游戏结束
    if (this.groundCtrl?.checkCollisionToGround(this.birdCtrl)) {
      this.handleGameOver(EGameOverType.FailToGround);
    }
    // 如果有鸟碰到管道，游戏结束
    if (this.pipeCtrl?.checkBirdCollisionToPipe(this.birdCtrl)) {
      this.handleGameOver(EGameOverType.CollisionToPipe);
    }
  }

  clickStrart() {
    this.gameOver = false;
    this.startScreen.active = false;
    this.birdCtrl.setEnableMove(true);
    this.groundCtrl.setEnableMove(true);
    this.pipeCtrl.startGame();
    EventMgr.off("ADD_SCORE_EVENT");
    EventMgr.on(
      "ADD_SCORE_EVENT",
      () => {
        const _score = DataMgr.getValue<number>("score") + 1;
        this.scoreLabel.node.parent.active = true;
        this.scoreLabel.string = `分数：${_score}`;
        DataMgr.setValue("score", _score);
        // 播放得分音效
        AudioMgr.getInstance().playOneShot(AudioMgr.point);
      },
      this
    );
  }

  resetGame() {
    // 开始场景
    this.startScreen.active = true;
    // 重置鸟
    this.birdCtrl.resetPosition();
    // 重置管道
    this.pipeCtrl.resetPosition();
    // 取消订阅事件
    this.scoreLabel.node.parent.active = false;
    // 初始化得分
    DataMgr.setValue("score", 0);
    // 取消订阅事件
    EventMgr.off("ADD_SCORE_EVENT");
  }

  handleGameOver(type: EGameOverType) {
    this.gameOver = true;
    this.birdCtrl.setEnableMove(false);
    this.groundCtrl.setEnableMove(false);
    this.pipeCtrl.setEnableMove(false);

    // 添加音效
    if (type === EGameOverType.CollisionToPipe) {
      AudioMgr.getInstance().playOneShot(AudioMgr.hit);
    } else {
      AudioMgr.getInstance().playOneShot(AudioMgr.die);
    }

    // 打开游戏结束UI
    UIMgr.getInstance().open<EndUI_UIData>(EndUI, {
      closeHandler: () => this.resetGame(),
    });
  }

  /**
   * 跳跃行为
   */
  toToJump() {
    this.birdCtrl.jump();
    // 播放煽动翅膀音效
    AudioMgr.getInstance().playOneShot(AudioMgr.wing);
  }

  /**
   * 点击屏幕
   */
  onTouchStart(event: TouchEvent) {
    if (this.gameOver) return;
    this.toToJump();
  }
}
