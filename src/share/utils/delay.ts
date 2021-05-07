import { Cancel, KeyMap, ResolveMap, TimeoutMap } from "types/share";
import { log } from "./log";

// let timeoutMap: TimeoutMap;
// let resolveMap: ResolveMap;
// let delay: Delay;
// let keyMap: KeyMap;

const timeoutMap: TimeoutMap = {};
const resolveMap: ResolveMap = {};
const keyMap: KeyMap = {};
const maxKeyLength = 200;
let keyLength = 0;

const cancel: Cancel = (key) => {
  if (timeoutMap[key]) {
    const length = timeoutMap[key].length;
    timeoutMap[key] = timeoutMap[key].map((id) => id && clearTimeout(id)).slice(length);
    resolveMap[key] = resolveMap[key].map((resolve) => resolve && resolve()).slice(length);
  }
  if (keyLength > maxKeyLength) {
    const keys = Object.keys(keyMap).sort((key1, key2) => (keyMap[key1] > keyMap[key2] ? 1 : -1));
    log(`start delete delay key, over max length ${maxKeyLength}`, "normal");
    for (const keyItem of keys) {
      if (keyItem !== key && !resolveMap[keyItem].length) {
        delete keyMap[keyItem];
        delete timeoutMap[keyItem];
        delete resolveMap[keyItem];
        keyLength--;
      }
    }
  }
};

function delay<T>(time: number, action: () => T, key: string): Promise<T | void>;

function delay<T>(time: number, action: () => T): Promise<T>;

function delay<T>(time: number, action: () => T, key?: string): Promise<T | void> {
  if (key === undefined) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(action());
      }, time);
    });
  } else {
    if (!(key in keyMap)) {
      keyMap[key] = 1;
      timeoutMap[key] = [];
      resolveMap[key] = [];
      keyLength++;
    } else {
      keyMap[key]++;
    }
    cancel(key);
    return new Promise((resolve) => {
      resolveMap[key].push(() => resolve(undefined));
      timeoutMap[key].push(
        setTimeout(() => {
          resolve(action());
        }, time)
      );
    });
  }
}

export { delay, cancel };
