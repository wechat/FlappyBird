class DataMgr {
  private static instance: DataMgr = null!;
  // 得分
  private score: number = 0;
  private constructor() {}

  static getInstance(): DataMgr {
    if (!DataMgr.instance) {
      DataMgr.instance = new DataMgr();
    }
    return DataMgr.instance;
  }

  getValue<T>(name: string): T {
    return this[name];
  }

  setValue(name: string, value: number) {
    this[name] = value;
  }
}

export default DataMgr.getInstance();
