import { EventTarget } from "cc";
const eventTarget = new EventTarget();

class EventMgr {
  private static instance: EventMgr = null!;
  private constructor() {}

  static getInstance(): EventMgr {
    if (!EventMgr.instance) {
      EventMgr.instance = new EventMgr();
    }
    return EventMgr.instance;
  }
  target(): EventTarget {
    return eventTarget;
  }
}

export default EventMgr.getInstance().target();
