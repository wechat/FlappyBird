import {
  _decorator,
  assetManager,
  Component,
  Constructor,
  Prefab,
  instantiate,
} from "cc";
const { ccclass, property } = _decorator;

declare global {
  interface IUI<UIDATA> {
    OnOpen(uiData?: UIDATA): void;
  }
  type UIClass<T extends Component & IUI<UIDATA>, UIDATA> = Constructor<T> & {
    readonly bundleName: string;
    readonly prefabUrl: string;
    readonly className: string;
  };
}

@ccclass("UIMgr")
export class UIMgr extends Component {
  private static _instance: UIMgr = null!;

  static getInstance(): UIMgr {
    return this._instance;
  }

  onLoad() {
    UIMgr._instance = this;
  }

  /**
   * UI 管理器
   * @param uiClass
   * @param uiData
   */
  open<UIDATA = any, T extends Component & IUI<UIDATA> = any>(
    uiClass: UIClass<T, UIDATA>,
    uiData?: UIDATA
  ) {
    // 加载远程资源和设备资源，动态加载资源
    assetManager.loadBundle(uiClass.bundleName, (_, bundle) => {
      bundle.load(uiClass.prefabUrl, Prefab, (err, prefab) => {
        if (err) {
          console.error(err);
          return;
        }
        const uiNode = instantiate(prefab);
        this.node.addChild(uiNode);
        const uiComponent = uiNode.getComponent(
          uiClass.className
        ) as any as IUI<UIDATA>;
        uiComponent.OnOpen(uiData);
      });
    });
  }

  close<T extends Component & IUI<any> = any>(uiComponent: T) {
    uiComponent.node.destroy();
  }
}
