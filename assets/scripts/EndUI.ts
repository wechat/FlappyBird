import { _decorator, Component, Label, Node } from "cc";
import { UIMgr } from "./manager/UIMgr";
import DataMgr from "./manager/DataMgr";
const { ccclass, property } = _decorator;

declare global {
  interface EndUI_UIData {
    closeHandler: () => void;
  }
}

@ccclass("EndUI")
export class EndUI extends Component implements IUI<EndUI_UIData> {
  static readonly className: string = "EndUI";
  static readonly prefabUrl: string = "EndUI";
  static readonly bundleName: string = "PrefabsBundle";
  @property({ type: Label, displayName: "分数" })
  private scoreLabel: Label = null!;

  private uiData: EndUI_UIData;

  start() {}

  OnOpen(uiData?: EndUI_UIData) {
    const _score = DataMgr.getValue<number>("score");
    this.uiData = uiData;
    this.scoreLabel.string = `得分：${_score}`;
  }

  clickToClose() {
    this.uiData.closeHandler();
    UIMgr.getInstance().close(this);
  }
}
