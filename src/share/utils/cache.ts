import { cancel, delay } from "./delay";
import { log } from "./log";

const maxTimeStore = 1000 * 60 * 10;

class Cache<T, K> {
  constructor(readonly maxTime: number = maxTimeStore, readonly store: Map<T, K> = new Map()) {
    if (!store.has || !store.set || !store.delete || !store.get) {
      throw new Error(`store must is a Map or List. store: ${store}`);
    }
  }

  set = (key: T, value: K, time: number = this.maxTime) => {
    if (this.store.has(key)) {
      log(`already cache, should not cache again! key: ${key} oldValue: ${this.store.get(key)} newValue: ${value}`, "warn");
    }
    this.store.set(key, value);
    this.delete(key, time);
  };

  delete = (key: T, time: number = this.maxTime) => {
    delay(
      time,
      () => {
        if (this.store.has(key)) {
          log(`start delete data from cache, next request will update this data. key: ${key}`, "normal");
          this.store.delete(key);
        } else {
          log(`error, nothing need to delete. key: ${key}`, "error");
        }
      },
      key instanceof String ? key.toString() : undefined
    );
  };

  get = (key: T) => {
    if (this.store.has(key)) {
      return this.store.get(key);
    } else {
      log(`warn, not cache yet, nothing to return. key: ${key}`, "warn");
      return false;
    }
  };

  deleteRightNow = (key: T) => {
    if (this.store.has(key)) {
      if (key instanceof String) {
        cancel(key.toString());
      }
      this.store.delete(key);
      log(`force delete data from cache, updata data from database. key: ${key}`, "warn");
    } else {
      log(`error, nothing need to delete. key: ${key}`, "error");
    }
  };
}

export { Cache };
