import { director, Node, AudioClip, AudioSource, resources } from "cc";

export class AudioMgr {
  // 掉落
  static readonly die: string = "audio/die";
  // 死亡
  static readonly hit: string = "audio/hit";
  // 得分
  static readonly point: string = "audio/point";
  // 鸟煽动翅膀
  static readonly wing: string = "audio/wing";
  // 鸟煽动翅膀
  static readonly swoosh: string = "audio/swoosh";

  private static _inst: AudioMgr;
  public static getInstance(): AudioMgr {
    if (this._inst == null) {
      this._inst = new AudioMgr();
    }
    return this._inst;
  }

  private _audioSource: AudioSource;
  constructor() {
    // 创建一个节点作为 audioMgr
    let audioMgr = new Node();
    audioMgr.name = "__audioMgr__";

    // 添加节点到场景
    director.getScene().addChild(audioMgr);

    // 标记为常驻节点，这样场景切换的时候就不会被销毁了
    director.addPersistRootNode(audioMgr);

    // 添加 AudioSource 组件，用于播放音频。
    this._audioSource = audioMgr.addComponent(AudioSource);
  }

  public get audioSource() {
    return this._audioSource;
  }

  /**
   * 播放短音频,比如 打击音效，爆炸音效等
   * @param sound clip or url for the audio
   * @param volume
   */
  playOneShot(sound: AudioClip | string, volume: number = 1.0) {
    if (sound instanceof AudioClip) {
      this._audioSource.playOneShot(sound, volume);
    } else {
      resources.load(sound, (err, clip: AudioClip) => {
        if (err) {
          console.log(err);
        } else {
          this._audioSource.playOneShot(clip, volume);
        }
      });
    }
  }

  /**
   * 播放长音频，比如 背景音乐
   * @param sound clip or url for the sound
   * @param volume
   */
  play(sound: AudioClip | string, volume: number = 1.0) {
    if (sound instanceof AudioClip) {
      this._audioSource.clip = sound;
      this._audioSource.play();
      this.audioSource.volume = volume;
    } else {
      resources.load(sound, (err, clip: AudioClip) => {
        if (err) {
          console.log(err);
        } else {
          this._audioSource.clip = clip;
          this._audioSource.play();
          this.audioSource.volume = volume;
        }
      });
    }
  }

  /**
   * stop the audio play
   */
  stop() {
    this._audioSource.stop();
  }

  /**
   * pause the audio play
   */
  pause() {
    this._audioSource.pause();
  }

  /**
   * resume the audio play
   */
  resume() {
    this._audioSource.play();
  }
}
